import { getPermissionQuery } from './getPermissionQuery';

/**
 * A Higher-Order Function to drop into Payload Collection access control fields.
 * 
 * @param permissionName - The required permission name
 * @returns Access function
 */
export const checkPermission = (permissionName: string): any => {
  return ({ req: { user } }: any) => {
    // Use getPermissionQuery which supports both boolean checks and ABAC conditions.
    // If relations are unpopulated, it will return false. Ensure your auth
    // collection is configured with adequate depth for saveToJWT or default depth.
    return getPermissionQuery(user, permissionName)
  }
}
