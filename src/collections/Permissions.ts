import type { CollectionConfig } from 'payload'
import type { PluginOptions } from '../types.js'

export const createPermissionsCollection = (options: PluginOptions): CollectionConfig => {
  const slug = options.permissionsCollectionSlug || 'permissions'
  const customFields = options.permissionsFields || []

  return {
    slug,
    admin: {
      useAsTitle: 'name',
      group: 'Access Control',
    },
    access: {
      read: () => true, // Access logic can be customized or injected later
    },
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
        unique: true,
        admin: {
          description: 'The unique name of the permission (e.g., "create:users", "read:posts").',
        },
      },
      ...customFields,
    ],
  }
}
