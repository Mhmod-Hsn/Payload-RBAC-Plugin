import type { PayloadRequest } from 'payload'

/**
 * Checks if a user has a specific permission.
 * Gracefully handles populated and unpopulated relationship states as far as possible synchronously.
 * 
 * @param user - The Payload user object from req.user
 * @param requiredPermission - The name of the permission to check for
 * @returns boolean
 */
export const hasPermission = (
  user: PayloadRequest['user'] | null | undefined,
  requiredPermission: string,
): boolean => {
  if (!user || !user.roles || !Array.isArray(user.roles)) {
    return false
  }

  for (const role of user.roles) {
    // If role is just an ID (unpopulated), we can't check its permissions synchronously
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
          return true
        }
      } 
    }
  }

  return false
}
