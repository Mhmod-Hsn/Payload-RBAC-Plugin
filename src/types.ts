import type { Field } from 'payload'

export interface PluginOptions {
  /**
   * Enable or disable plugin
   * @default false
   */
  enabled?: boolean

  /**
   * Override the default collection slug for Roles
   * @default 'roles'
   */
  rolesCollectionSlug?: string

  /**
   * Override the default collection slug for Permissions
   * @default 'permissions'
   */
  permissionsCollectionSlug?: string

  /**
   * The collection slug for the authentication collection (typically 'users')
   * @default 'users'
   */
  authCollectionSlug?: string

  /**
   * Inject additional custom fields into the generated Roles collection
   */
  rolesFields?: Field[]

  /**
   * Inject additional custom fields into the generated Permissions collection
   */
  permissionsFields?: Field[]

  /**
   * Hide the Roles collection from the Admin panel sidebar/dashboard
   * Can be a boolean or a function based on the logged-in user
   * @default false
   */
  hideRoles?: boolean | ((args: { user: any }) => boolean)

  /**
   * Hide the Permissions collection from the Admin panel sidebar/dashboard
   * Can be a boolean or a function based on the logged-in user
   * @default false
   */
  hidePermissions?: boolean | ((args: { user: any }) => boolean)
}
