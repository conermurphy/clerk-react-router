import { getAuth } from '@clerk/react-router/ssr.server'
import { redirect } from 'react-router'
import type { Route } from './+types/home'
import { db } from '~/db/config.server'
import { notes } from '~/db/schema.server'
import { createNoteSchema } from '~/schemas'
import { NoteForm } from '~/components/note-form'

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

  const { title, content } = createNoteSchema.parse({
    title: formData.get('title')?.toString(),
    content: formData.get('content')?.toString(),
  })

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
