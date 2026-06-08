import type { CollectionConfig, Field } from 'payload'

export interface PluginOptions {
  /**
   * The collection slug for the authentication collection (typically 'users')
   * @default 'users'
   */
  authCollectionSlug?: string

  /**
   * Enable or disable plugin
   * @default false
   */
  enabled?: boolean

  /**
   * Hide the Permissions collection from the Admin panel sidebar/dashboard
   * Can be a boolean or a function based on the logged-in user
   * @default false
   */
  hidePermissions?: ((args: { user: any }) => boolean) | boolean

  /**
   * Hide the Roles collection from the Admin panel sidebar/dashboard
   * Can be a boolean or a function based on the logged-in user
   * @default false
   */
  hideRoles?: ((args: { user: any }) => boolean) | boolean

  /**
   * Access control functions for the Permissions collection
   */
  permissionsAccess?: any

  /**
   * Override the default collection slug for Permissions
   * @default 'permissions'
   */
  permissionsCollectionSlug?: string

  /**
   * Inject additional custom fields into the generated Permissions collection
   */
  permissionsFields?: Field[]

  /**
   * Access control functions for the Roles collection
   */
  rolesAccess?: any

  /**
   * Override the default collection slug for Roles
   * @default 'roles'
   */
  rolesCollectionSlug?: string

  /**
   * Inject additional custom fields into the generated Roles collection
   */
  rolesFields?: Field[]
}
