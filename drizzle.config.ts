import { type Config, defineConfig } from 'drizzle-kit'

if (!process.env.DATABASE_PATH) {
  throw new Error('Missing env: DATABASE_PATH')
}

export default defineConfig({
  schema: './app/db/schema.server.ts',
  out: './drizzle',
  dialect: 'sqlite',
  dbCredentials: {
    url: process.env.DATABASE_PATH,
  },
}) satisfies Config
