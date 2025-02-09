import { getAuth } from '@clerk/react-router/ssr.server'
import { redirect } from 'react-router'
import type { Route } from './+types/new'
import { db } from '~/db/config.server'
import { notes } from '~/db/schema.server'
import { createNoteSchema } from '~/schemas'
import { NoteForm } from '~/components/note-form'
import { parseWithZod } from '@conform-to/zod'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Notify | Create New Note' },
    { name: 'description', content: 'Create a new note with Notify' },
  ]
}

export async function action(args: Route.ActionArgs) {
  const { userId } = await getAuth(args)

  if (!userId) return redirect('/sign-in?redirect_url=' + args.request.url)

  const formData = await args.request.formData()
  const submission = parseWithZod(formData, { schema: createNoteSchema })

  if (submission.status !== 'success') {
    return submission.reply()
  }

  const { title, content } = submission.value

  const [createdNote] = await db
    .insert(notes)
    .values({
      title,
      content,
      authorId: userId,
    })
    .returning()

  return redirect(`/${createdNote.id}`)
}

export default function CreateNote() {
  return <NoteForm />
}
