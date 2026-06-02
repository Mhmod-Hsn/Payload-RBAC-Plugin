import type { Payload } from 'payload'

import config from '@payload-config'
import { getPayload } from 'payload'
import { afterAll, beforeAll, describe, expect, test } from 'vitest'

let payload: Payload

afterAll(async () => {
  await payload.destroy()
})

beforeAll(async () => {
  payload = await getPayload({ config })
})

describe('Plugin integration tests', () => {
  test('plugin creates roles and permissions collections', async () => {
    expect(payload.collections['roles']).toBeDefined()
    expect(payload.collections['permissions']).toBeDefined()
  })

  test('plugin injects roles field into users collection', async () => {
    const usersCollection = payload.collections['users'].config
    const rolesField = usersCollection.fields.find(
      (f) => 'name' in f && f.name === 'roles'
    )
    
    expect(rolesField).toBeDefined()
    if (rolesField && 'type' in rolesField) {
      expect(rolesField.type).toBe('relationship')
      expect(rolesField.relationTo).toBe('roles')
    }
  })
})
