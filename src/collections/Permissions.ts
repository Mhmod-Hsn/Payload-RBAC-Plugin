import type { CollectionConfig } from 'payload'

import type { PluginOptions } from '../types'

import { createBeforePermissionChangeHook } from '../hooks/beforePermissionChange'

export const createPermissionsCollection = (options: PluginOptions): CollectionConfig => {
  const slug = options.permissionsCollectionSlug || 'permissions'
  const customFields = options.permissionsFields || []

  return {
    slug,
    access: options.permissionsAccess || {
      create: () => true,
      delete: () => true,
      read: () => true,
      update: () => true,
    },
    admin: {
      group: 'Access Control',
      hidden: options.hidePermissions ?? false,
      useAsTitle: 'name',
    },
    fields: [
      {
        name: 'type',
        type: 'select',
        admin: {
          condition: (data) => !data?.id && !data?._id && !data?.createdAt,
          description:
            'Choose whether to create a single custom permission or generate multiple CRUD permissions at once.',
          disableListColumn: true,
          disableListFilter: true,
        },
        defaultValue: 'single',
        options: [
          { label: 'Single Permission', value: 'single' },
          { label: 'Bulk CRUD Generator', value: 'bulk' },
        ],
      },
      {
        name: 'name',
        type: 'text',
        admin: {
          condition: (data) => data?.type === 'single',
          description: 'The unique name of the permission (e.g., "access:admin", "posts:create").',
        },
        unique: true,
        validate: (value: null | string | undefined, { data }: { data?: any }) => {
          if (data?.type === 'single' && !value) {
            return 'Name is required for single permissions.'
          }
          return true
        },
      },
      {
        name: 'conditions',
        type: 'array',
        admin: {
          condition: (data) => data?.type === 'single',
          description:
            'Add dynamic row-level security constraints to this permission. If specified, this permission will only grant access to documents matching these conditions.',
        },
        fields: [
          {
            name: 'field',
            type: 'text',
            required: true,
            admin: {
              description: 'The document field to check (e.g. "sender" or "status").',
            },
          },
          {
            name: 'operator',
            type: 'select',
            required: true,
            defaultValue: 'equals',
            options: [
              { label: 'Equals', value: 'equals' },
              { label: 'Not Equals', value: 'not_equals' },
              { label: 'In', value: 'in' },
              { label: 'Not In', value: 'not_in' },
              { label: 'Exists', value: 'exists' },
              { label: 'Greater Than', value: 'greater_than' },
              { label: 'Less Than', value: 'less_than' },
              { label: 'Like', value: 'like' },
              { label: 'Contains', value: 'contains' },
            ],
          },
          {
            name: 'value',
            type: 'text',
            admin: {
              description:
                'Value to compare against. Supports {{user.id}}, {{user.roles}}, {{user.role}} variables.',
            },
          },
        ],
      },
      {
        name: 'collectionName',
        type: 'text',
        admin: {
          condition: (data) => data?.type === 'bulk',
          description: 'Enter a collection slug (e.g., "posts") to auto-generate permissions.',
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
            admin: {
              condition: (data) => data?.type === 'bulk',
              disableListColumn: true,
              disableListFilter: true,
              width: '25%',
            },
            defaultValue: false,
          },
          {
            name: 'read',
            type: 'checkbox',
            admin: {
              condition: (data) => data?.type === 'bulk',
              disableListColumn: true,
              disableListFilter: true,
              width: '25%',
            },
            defaultValue: false,
          },
          {
            name: 'update',
            type: 'checkbox',
            admin: {
              condition: (data) => data?.type === 'bulk',
              disableListColumn: true,
              disableListFilter: true,
              width: '25%',
            },
            defaultValue: false,
          },
          {
            name: 'delete',
            type: 'checkbox',
            admin: {
              condition: (data) => data?.type === 'bulk',
              disableListColumn: true,
              disableListFilter: true,
              width: '25%',
            },
            defaultValue: false,
          },
        ],
      },
      ...customFields,
    ],
    hooks: {
      beforeChange: [createBeforePermissionChangeHook(slug)],
    },
  }
}
