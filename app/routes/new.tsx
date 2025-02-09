import { redirect } from 'react-router'
import type { Route } from './+types/new'
import { db } from '~/db/config.server'
import { notes } from '~/db/schema.server'
import { createNoteSchema } from '~/schemas'
import { NoteForm } from '~/components/note-form'
import { parseWithZod } from '@conform-to/zod'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Noted | Create New Note' },
    { name: 'description', content: 'Create a new note with Noted' },
  ]
}

export async function action(args: Route.ActionArgs) {
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
      authorId: 'CLERK_USER_ID',
    })
    .returning()

  return redirect(`/${createdNote.id}`)
}

export default function CreateNote() {
  return <NoteForm />
}
