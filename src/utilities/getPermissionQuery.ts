import type { PayloadRequest, Where } from 'payload'

/**
 * Checks if a user has a specific permission and evaluates its dynamic conditions.
 * 
 * - If the user does not have the permission, returns false.
 * - If the user has the permission without conditions, returns true.
 * - If the user has the permission with conditions, returns a Payload `Where` object.
 * 
 * @param user - The Payload user object from req.user
 * @param requiredPermission - The name of the permission to check for
 * @returns boolean | Where
 */
export const getPermissionQuery = (
  user: PayloadRequest['user'] | null | undefined,
  requiredPermission: string,
): boolean | Where => {
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    return false
  }

  let hasPerm = false
  const allConditions: any[] = []

  for (const role of user.roles) {
    if (typeof role !== 'object' || role === null) {
      continue
    }

    const permissions = role.permissions
    if (!permissions || !Array.isArray(permissions)) {
      continue
    }

    for (const permission of permissions) {
      if (typeof permission === 'object' && permission !== null) {
        if ('name' in permission && permission.name === requiredPermission) {
          hasPerm = true

          // Collect conditions if they exist
          if (
            'conditions' in permission &&
            Array.isArray(permission.conditions) &&
            permission.conditions.length > 0
          ) {
            allConditions.push(permission.conditions)
          } else {
            // If they have the permission WITHOUT conditions in ANY role, they get full access!
            return true
          }
        }
      }
    }
  }

  if (!hasPerm) {
    return false
  }

  // If they have the permission but ONLY with conditions, build the query.
  if (allConditions.length > 0) {
    const orConditions: Where[] = allConditions.map((roleConditions) => {
      const andConditions = roleConditions.map((cond: any) => {
        let parsedValue: any = cond.value

        if (typeof parsedValue === 'string') {
          if (parsedValue === '{{user.roles}}') {
            parsedValue =
              user.roles?.map((r: any) => (typeof r === 'string' ? r : r?.id)).filter(Boolean) || []
          } else if (parsedValue === '{{user.role}}') {
            // Support for single role field if it exists
            const singleRole = (user as any).role
            parsedValue = typeof singleRole === 'object' && singleRole !== null ? singleRole.id : singleRole
          } else if (parsedValue === '{{user.id}}') {
            parsedValue = user.id
          } else if (parsedValue === 'true') {
            parsedValue = true
          } else if (parsedValue === 'false') {
            parsedValue = false
          } else {
            // Simple string replacement for embedded variables
            parsedValue = parsedValue.replace(/\{\{user\.id\}\}/g, String(user.id))
          }
        }

        return {
          [cond.field]: {
            [cond.operator]: parsedValue,
          },
        } as Where
      })

      return { and: andConditions } as Where
    })

    if (orConditions.length === 1) {
      return orConditions[0] as Where
    }

    return { or: orConditions } as Where
  }

  return false
}
