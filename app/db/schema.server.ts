import { randomUUID } from 'crypto'
import { sql } from 'drizzle-orm'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

const timestamps = {
  createdAt: integer('created_at', { mode: 'timestamp' })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
  updatedAt: integer('updated_at', { mode: 'timestamp' })
    .default(sql`(strftime('%s', 'now'))`)
    .notNull(),
}

const id = {
  id: text('id')
    .primaryKey()
    .$defaultFn(() => randomUUID())
    .notNull(),
}

export const notes = sqliteTable('notes', {
  ...id,
  ...timestamps,
  title: text('title').notNull(),
  content: text('content').notNull(),
  authorId: text('author_id').notNull(),
})
