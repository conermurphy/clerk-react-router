import { data, redirect } from 'react-router'
import { getAuth } from '@clerk/react-router/ssr.server'
import { db } from '~/db/config.server'
import { notes } from '~/db/schema.server'
import { createNoteSchema } from '~/schemas'
import { eq } from 'drizzle-orm'
import type { Route } from './+types/:id'
import { parseWithZod } from '@conform-to/zod'
import { NoteForm } from '~/components/note-form'
import { format } from 'date-fns'
import { createClerkClient } from '@clerk/react-router/api.server'

export function meta({ data: { note } }: Route.MetaArgs) {
  return [
    { title: `Notify | ${note.title.slice(0, 30)}...` },
    { name: 'description', content: 'View and edit your note with Notify' },
  ]
}

export async function action(args: Route.ActionArgs) {
  const { userId } = await getAuth(args)

  if (!userId) return redirect('/sign-in?redirect_url=' + args.request.url)

  const noteId = args.params.id

  if (!noteId) {
    throw data('Note ID cannot be undefined or null', { status: 400 })
  }

  const formData = await args.request.formData()
  const submission = parseWithZod(formData, { schema: createNoteSchema })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  const { title, content } = submission.value

  await db
    .update(notes)
    .set({ title, content })
    .where(eq(notes.id, noteId))
    .returning()

  return redirect(`/${noteId}`)
}

export async function loader(args: Route.LoaderArgs) {
  const { userId } = await getAuth(args)

  if (!userId) return redirect('/sign-in?redirect_url=' + args.request.url)

  const noteId = args.params.id

  if (!noteId) {
    throw data('Note ID cannot be undefined or null', { status: 400 })
  }

  const [note] = await db.select().from(notes).where(eq(notes.id, noteId))

  if (!note) {
    throw data('Note not found', { status: 404 })
  }

  const user = await createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  }).users.getUser(userId)

  return { note: { ...note, author: user.fullName } }
}

export default function UpdateNote({
  actionData,
  loaderData,
}: Route.ComponentProps) {
  const { note } = loaderData

  return (
    <div className="flex h-full flex-col">
      <div className="flex justify-between px-10 pt-6 text-sm italic">
        <p>
          Last updated:{' '}
          <time className="font-bold" dateTime={note.updatedAt.toISOString()}>
            {format(new Date(note.updatedAt), 'do MMM yyyy pp')}
          </time>
        </p>
        <p>
          Author: <span className="font-bold">{note.author}</span>
        </p>
      </div>
      <NoteForm note={note} lastResult={actionData} />
    </div>
  )
}
