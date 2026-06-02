import type { CollectionBeforeChangeHook } from 'payload'

export const createBeforePermissionChangeHook = (slug: string): CollectionBeforeChangeHook => {
  return async ({ data, req }) => {
    // Only run generator logic on create/update if type is bulk
    if (data.type === 'bulk' && data.collectionName) {
      const actions = ['create', 'read', 'update', 'delete'].filter(
        (action) => data[action] === true,
      )

      if (actions.length === 0) {
        throw new Error('You must select at least one CRUD operation when using the Bulk Generator.')
      }

      // e.g. ["posts:create", "posts:read"]
      const generatedNames = actions.map((action) => `${data.collectionName}:${action}`)

      // Filter out names that already exist
      const uniqueNames: string[] = []
      for (const name of generatedNames) {
        const existing = await req.payload.find({
          collection: slug,
          where: {
            name: { equals: name },
          },
        })
        if (existing.docs.length === 0) {
          uniqueNames.push(name)
        }
      }

      if (uniqueNames.length === 0) {
        throw new Error('All selected CRUD permissions already exist.')
      }

      // Mutate current document to save the first unique generated name
      data.name = uniqueNames[0]

      // Create the remaining unique permissions in the background
      const remainingNames = uniqueNames.slice(1)
      for (const name of remainingNames) {
        await req.payload.create({
          collection: slug,
          data: {
            name,
          },
        })
      }
    }

    // Ensure UI-only fields are never saved to the database
    delete data.type
    delete data.collectionName
    delete data.create
    delete data.read
    delete data.update
    delete data.delete

    return data
  }
}
