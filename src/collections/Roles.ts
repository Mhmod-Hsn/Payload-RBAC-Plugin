import type { CollectionConfig } from 'payload'

import type { PluginOptions } from '../types'

export const createRolesCollection = (options: PluginOptions): CollectionConfig => {
  const slug = options.rolesCollectionSlug || 'roles'
  const permissionsSlug = options.permissionsCollectionSlug || 'permissions'
  const customFields = options.rolesFields || []

  return {
    slug,
    access: options.rolesAccess || {
      create: () => true,
      delete: () => true,
      read: () => true,
      update: () => true,
    },
    admin: {
      group: 'Access Control',
      hidden: options.hideRoles ?? false,
      useAsTitle: 'name',
    },
    fields: [
      {
        name: 'name',
        type: 'text',
        admin: {
          description: 'The unique name of the role (e.g., "admin", "editor").',
        },
        required: true,
        unique: true,
      },
      {
        name: 'permissions',
        type: 'relationship',
        admin: {
          description: 'The permissions assigned to this role.',
        },
        hasMany: true,
        relationTo: permissionsSlug,
      },
      ...customFields,
    ],
  }
}
