import type { Config } from 'payload';
import type { PluginOptions } from './types';

import { createPermissionsCollection } from './collections/Permissions';
import { createRolesCollection } from './collections/Roles';

export const rbac =
  (pluginOptions?: PluginOptions) =>
  (config: Config): Config => {
    const options = pluginOptions || {}
    
    if (options.enabled === false) {
      return config
    }

    if (!config.collections) {
      config.collections = []
    }

    // Add Roles and Permissions collections
    config.collections.push(createPermissionsCollection(options))
    config.collections.push(createRolesCollection(options))

    // Extend the target auth collection
    const authSlug = options.authCollectionSlug || 'users'
    const rolesSlug = options.rolesCollectionSlug || 'roles'

    const authCollection = config.collections.find(
      (collection) => collection.slug === authSlug,
    )

    if (authCollection) {
      authCollection.fields.push({
        name: 'roles',
        type: 'relationship',
        relationTo: rolesSlug,
        hasMany: true,
        saveToJWT: true,
        admin: {
          description: 'Roles assigned to this user.',
        },
      })
    } else {
      console.warn(`[rbac-plugin] Auth collection '${authSlug}' not found. Cannot inject roles field.`)
    }

    return config
  }

// Export utilities and types for consumers
export * from './types';
export * from './utilities/index';

