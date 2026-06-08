
import { hasPermission } from './hasPermission';

/**
 * A Higher-Order Function to drop into Payload Collection access control fields.
 * 
 * @param permissionName - The required permission name
 * @returns Access function
 */
export const checkPermission = (permissionName: string): any => {
  return ({ req: { user } }: any) => {
    // We can just rely on the synchronous hasPermission check.
    // If relations are unpopulated, it will return false. Ensure your auth
    // collection is configured with adequate depth for saveToJWT or default depth.
    return hasPermission(user, permissionName)
  }
}
