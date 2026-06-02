import type { CollectionConfig } from 'payload';
import { createBeforePermissionChangeHook } from '../hooks/beforePermissionChange';
import type { PluginOptions } from '../types';

export const createPermissionsCollection = (options: PluginOptions): CollectionConfig => {
  const slug = options.permissionsCollectionSlug || 'permissions'
  const customFields = options.permissionsFields || []

  return {
    slug,
    admin: {
      useAsTitle: 'name',
      group: 'Access Control',
      hidden: options.hidePermissions ?? false,
    },
    access: {
      read: () => true,
    },
    hooks: {
      beforeChange: [createBeforePermissionChangeHook(slug)],
    },
    fields: [
      {
        name: 'type',
        type: 'select',
        defaultValue: 'single',
        options: [
          { label: 'Single Permission', value: 'single' },
          { label: 'Bulk CRUD Generator', value: 'bulk' },
        ],
        admin: {
          description: 'Choose whether to create a single custom permission or generate multiple CRUD permissions at once.',
          disableListColumn: true,
          disableListFilter: true,
          condition: (data) => !data.id,
        },
      },
      {
        name: 'name',
        type: 'text',
        unique: true,
        validate: (value: string | null | undefined, { data }: { data?: any }) => {
          if (data?.type === 'single' && !value) {
            return 'Name is required for single permissions.'
          }
          return true
        },
        admin: {
          description: 'The unique name of the permission (e.g., "access:admin", "posts:create").',
          condition: (data) => data?.type === 'single',
        },
      },
      {
        name: 'collectionName',
        type: 'text',
        admin: {
          description: 'Enter a collection slug (e.g., "posts") to auto-generate permissions.',
          condition: (data) => data?.type === 'bulk',
          disableListColumn: true,
          disableListFilter: true,
        },
      },
      {
        type: 'row',
        fields: [
          {
            name: 'create',
            type: 'checkbox',
            defaultValue: false,
            admin: {
              width: '25%',
              condition: (data) => data?.type === 'bulk',
              disableListColumn: true,
              disableListFilter: true,
            },
          },
          {
            name: 'read',
            type: 'checkbox',
            defaultValue: false,
            admin: {
              width: '25%',
              condition: (data) => data?.type === 'bulk',          
              disableListColumn: true,
              disableListFilter: true,
            },
          },
          {
            name: 'update',
            type: 'checkbox',
            defaultValue: false,
            admin: {
              width: '25%',
              condition: (data) => data?.type === 'bulk',
              disableListColumn: true,
              disableListFilter: true,
            },
          },
          {
            name: 'delete',
            type: 'checkbox',
            defaultValue: false,
            admin: {
              width: '25%',
              condition: (data) => data?.type === 'bulk',
              disableListColumn: true,
              disableListFilter: true,
            },
          },
        ],
      },
      ...customFields,
    ],
  }
}
