import type { PayloadRequest } from 'payload'
import { describe, expect, it } from 'vitest'
import { getPermissionQuery } from './getPermissionQuery'

describe('getPermissionQuery', () => {
  it('should return false if user is null', () => {
    expect(getPermissionQuery(null, 'read:posts')).toBe(false)
  })

  it('should return false if user has no roles array', () => {
    const user = { id: '1' } as PayloadRequest['user']
    expect(getPermissionQuery(user, 'read:posts')).toBe(false)
  })

  it('should return false if user roles is unpopulated', () => {
    const user = {
      id: '1',
      roles: ['role-id-1'],
    } as unknown as PayloadRequest['user']
    expect(getPermissionQuery(user, 'read:posts')).toBe(false)
  })

  it('should return false if role has no permissions', () => {
    const user = {
      id: '1',
      roles: [{ id: 'role-1', name: 'admin' }],
    } as unknown as PayloadRequest['user']
    expect(getPermissionQuery(user, 'read:posts')).toBe(false)
  })

  it('should return true if permission is found without conditions', () => {
    const user = {
      id: '1',
      roles: [
        {
          id: 'role-1',
          name: 'admin',
          permissions: [
            { id: 'perm-1', name: 'read:posts' },
            { id: 'perm-2', name: 'write:posts' },
          ],
        },
      ],
    } as unknown as PayloadRequest['user']
    expect(getPermissionQuery(user, 'read:posts')).toBe(true)
  })

  it('should return a Where object if permission has conditions', () => {
    const user = {
      id: 'user-1',
      roles: [
        {
          id: 'role-1',
          name: 'editor',
          permissions: [
            {
              id: 'perm-1',
              name: 'read:posts',
              conditions: [
                { field: 'sender', operator: 'equals', value: '{{user.id}}' },
              ],
            },
          ],
        },
      ],
    } as unknown as PayloadRequest['user']

    const query = getPermissionQuery(user, 'read:posts')
    expect(query).toEqual({
      and: [
        {
          sender: { equals: 'user-1' },
        },
      ],
    })
  })

  it('should return true if one role has conditions but another role gives full access', () => {
    const user = {
      id: 'user-1',
      roles: [
        {
          id: 'role-1',
          name: 'editor',
          permissions: [
            {
              id: 'perm-1',
              name: 'read:posts',
              conditions: [
                { field: 'sender', operator: 'equals', value: '{{user.id}}' },
              ],
            },
          ],
        },
        {
          id: 'role-2',
          name: 'admin',
          permissions: [{ id: 'perm-2', name: 'read:posts' }],
        },
      ],
    } as unknown as PayloadRequest['user']

    // The user has full 'read:posts' from admin role, so they get full access (true)
    const query = getPermissionQuery(user, 'read:posts')
    expect(query).toBe(true)
  })

  it('should return an OR Where object if multiple roles have different conditions', () => {
    const user = {
      id: 'user-1',
      roles: [
        {
          id: 'role-1',
          name: 'editor',
          permissions: [
            {
              id: 'perm-1',
              name: 'read:posts',
              conditions: [
                { field: 'author', operator: 'equals', value: '{{user.id}}' },
              ],
            },
          ],
        },
        {
          id: 'role-2',
          name: 'manager',
          permissions: [
            {
              id: 'perm-2',
              name: 'read:posts',
              conditions: [
                { field: 'status', operator: 'equals', value: 'published' },
              ],
            },
          ],
        },
      ],
    } as unknown as PayloadRequest['user']

    const query = getPermissionQuery(user, 'read:posts')
    expect(query).toEqual({
      or: [
        {
          and: [
            { author: { equals: 'user-1' } },
          ],
        },
        {
          and: [
            { status: { equals: 'published' } },
          ],
        },
      ],
    })
  })

  it('should correctly map {{user.roles}} and boolean string values', () => {
    const user = {
      id: 'user-1',
      roles: [
        { 
          id: 'role-1', 
          name: 'editor',
          permissions: [
            {
              id: 'perm-1',
              name: 'read:posts',
              conditions: [
                { field: 'role', operator: 'in', value: '{{user.roles}}' },
                { field: 'isPublic', operator: 'equals', value: 'true' },
              ],
            },
          ]
        },
        { id: 'role-2', name: 'manager' }
      ],
    } as unknown as PayloadRequest['user']

    const query = getPermissionQuery(user, 'read:posts')
    expect(query).toEqual({
      and: [
        { role: { in: ['role-1', 'role-2'] } },
        { isPublic: { equals: true } },
      ],
    })
  })
})
