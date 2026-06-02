import { describe, it, expect } from 'vitest'
import { hasPermission } from './hasPermission.js'
import type { PayloadRequest } from 'payload'

describe('hasPermission', () => {
  it('should return false if user is null', () => {
    expect(hasPermission(null, 'read:posts')).toBe(false)
  })

  it('should return false if user has no roles array', () => {
    const user = { id: '1' } as PayloadRequest['user']
    expect(hasPermission(user, 'read:posts')).toBe(false)
  })

  it('should return false if user roles is unpopulated (array of strings)', () => {
    const user = {
      id: '1',
      roles: ['role-id-1'],
    } as unknown as PayloadRequest['user']
    expect(hasPermission(user, 'read:posts')).toBe(false)
  })

  it('should return false if role has no permissions', () => {
    const user = {
      id: '1',
      roles: [{ id: 'role-1', name: 'admin' }],
    } as unknown as PayloadRequest['user']
    expect(hasPermission(user, 'read:posts')).toBe(false)
  })

  it('should return false if role permissions are unpopulated (array of strings)', () => {
    const user = {
      id: '1',
      roles: [{ id: 'role-1', name: 'admin', permissions: ['perm-id-1'] }],
    } as unknown as PayloadRequest['user']
    expect(hasPermission(user, 'read:posts')).toBe(false)
  })

  it('should return true if permission is found in populated roles', () => {
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
    expect(hasPermission(user, 'write:posts')).toBe(true)
  })

  it('should return false if permission is not found in populated roles', () => {
    const user = {
      id: '1',
      roles: [
        {
          id: 'role-1',
          name: 'editor',
          permissions: [{ id: 'perm-1', name: 'read:posts' }],
        },
      ],
    } as unknown as PayloadRequest['user']
    expect(hasPermission(user, 'delete:posts')).toBe(false)
  })

  it('should correctly search through multiple roles', () => {
    const user = {
      id: '1',
      roles: [
        {
          id: 'role-1',
          name: 'editor',
          permissions: [{ id: 'perm-1', name: 'read:posts' }],
        },
        {
          id: 'role-2',
          name: 'manager',
          permissions: [{ id: 'perm-2', name: 'delete:posts' }],
        },
      ],
    } as unknown as PayloadRequest['user']
    expect(hasPermission(user, 'delete:posts')).toBe(true)
    expect(hasPermission(user, 'read:posts')).toBe(true)
    expect(hasPermission(user, 'create:users')).toBe(false)
  })
})
