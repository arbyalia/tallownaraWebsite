import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { id } from '@payloadcms/translations/languages/id'
import { buildConfig } from 'payload'
import sharp from 'sharp'

import { Achievements } from './collections/Achievements'
import { Faqs } from './collections/Faqs'
import { LegalPages } from './collections/LegalPages'
import { Media } from './collections/Media'
import { Orders } from './collections/Orders'
import { OtpCodes } from './collections/OtpCodes'
import { Products } from './collections/Products'
import { Reviews } from './collections/Reviews'
import { Users } from './collections/Users'
import { WebhookEvents } from './collections/WebhookEvents'
import { About } from './globals/About'
import { SiteSettings } from './globals/SiteSettings'
import { serverEnv } from './lib/env'

const dirname = path.dirname(fileURLToPath(import.meta.url))

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: { baseDir: dirname },
    meta: { titleSuffix: ' · Tallownara' },
  },
  collections: [
    Products,
    Orders,
    Reviews,
    Achievements,
    LegalPages,
    Faqs,
    Media,
    Users,
    OtpCodes,
    WebhookEvents,
  ],
  globals: [SiteSettings, About],
  db: postgresAdapter({
    pool: { connectionString: serverEnv.DATABASE_URL },
  }),
  editor: lexicalEditor(),
  i18n: {
    fallbackLanguage: 'id',
    supportedLanguages: { id },
  },
  secret: serverEnv.PAYLOAD_SECRET,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
})
