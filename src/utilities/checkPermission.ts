import type { Access } from 'payload'
import { hasPermission } from './hasPermission.js'

/**
 * A Higher-Order Function to drop into Payload Collection access control fields.
 * 
 * @param permissionName - The required permission name
 * @returns Access function
 */
export const checkPermission = (permissionName: string): Access => {
  return ({ req: { user } }) => {
    // We can just rely on the synchronous hasPermission check.
    // If relations are unpopulated, it will return false. Ensure your auth
    // collection is configured with adequate depth for saveToJWT or default depth.
    return hasPermission(user, permissionName)
  }
}
