import type { CollectionConfig } from 'payload'
import type { PluginOptions } from '../types.js'

export const createRolesCollection = (options: PluginOptions): CollectionConfig => {
  const slug = options.rolesCollectionSlug || 'roles'
  const permissionsSlug = options.permissionsCollectionSlug || 'permissions'
  const customFields = options.rolesFields || []

  return {
    slug,
    admin: {
      useAsTitle: 'name',
      group: 'Access Control',
    },
    access: {
      read: () => true,
    },
    fields: [
      {
        name: 'name',
        type: 'text',
        required: true,
        unique: true,
        admin: {
          description: 'The unique name of the role (e.g., "admin", "editor").',
        },
      },
      {
        name: 'permissions',
        type: 'relationship',
        relationTo: permissionsSlug,
        hasMany: true,
        admin: {
          description: 'The permissions assigned to this role.',
        },
      },
      ...customFields,
    ],
  }
}
