import { drizzle } from 'drizzle-orm/libsql'

if (!process.env.DATABASE_PATH) {
  throw new Error('Missing env: DATABASE_PATH')
}

export const db = drizzle(process.env.DATABASE_PATH)
