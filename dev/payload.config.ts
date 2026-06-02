import { mongooseAdapter } from '@payloadcms/db-mongodb';
import { lexicalEditor } from '@payloadcms/richtext-lexical';
import { MongoMemoryReplSet } from 'mongodb-memory-server';
import path from 'path';
import { buildConfig } from 'payload';
import { checkPermission, hasPermission, rbac } from 'rbac';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

import { testEmailAdapter } from './helpers/testEmailAdapter';
import { seed } from './seed';

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

if (!process.env.ROOT_DIR) {
  process.env.ROOT_DIR = dirname
}

const buildConfigWithMemoryDB = async () => {
  if (process.env.NODE_ENV === 'test') {
    const memoryDB = await MongoMemoryReplSet.create({
      replSet: {
        count: 3,
        dbName: 'payloadmemory',
      },
    })

    process.env.DATABASE_URL = `${memoryDB.getUri()}&retryWrites=true`
  }

  return buildConfig({
    admin: {
      importMap: {
        baseDir: path.resolve(dirname),
      },
    },
    collections: [
      {
        access: {
          read: checkPermission('posts:read'),
          create: checkPermission('posts:create'),
          update: checkPermission('posts:update'),
          delete: checkPermission('posts:delete'),
        },
        slug: 'posts',
        fields: [],
      },
      {
        slug: "media",
        access: {
          read: checkPermission('media:read'),
          create: checkPermission('media:create'),
          update: checkPermission('media:update'),
          delete: checkPermission('media:delete'),
        },
        fields: [],
        upload: {
          staticDir: path.resolve(dirname, 'media'),
        },
      },
      {
        slug:"users",
        access: {
          read: checkPermission('users:read'),
          create: checkPermission('users:create'),
          update: checkPermission('users:update'),
          delete: checkPermission('users:delete'),
        },
        auth: true,
        fields: [],
      },
    ],
    db: mongooseAdapter({
      ensureIndexes: true,
      url: process.env.DATABASE_URL || '',
    }),
    editor: lexicalEditor(),
    email: testEmailAdapter,
    onInit: async (payload) => {
      await seed(payload)
    },
    plugins: [
      rbac({
        enabled: true,
        hidePermissions: checkPermission('permissions'),
        hideRoles: checkPermission('roles'),
      }),
    ],
    secret: process.env.PAYLOAD_SECRET || 'test-secret_key',
    sharp,
    typescript: {
      outputFile: path.resolve(dirname, 'payload-types.ts'),
    },
  })
}

export default buildConfigWithMemoryDB()
