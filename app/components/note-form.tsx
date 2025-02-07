import {
  useForm,
  getInputProps,
  getTextareaProps,
  type SubmissionResult,
} from '@conform-to/react'
import { getZodConstraint, parseWithZod } from '@conform-to/zod'
import { Form } from 'react-router'
import { createNoteSchema } from '~/schemas'

type Props = {
  note?: { title: string; content: string }
  lastResult?: SubmissionResult<string[]>
}

export function NoteForm({ note, lastResult }: Props) {
  const [form, fields] = useForm({
    constraint: getZodConstraint(createNoteSchema),
    defaultValue: {
      title: note?.title,
      content: note?.content,
    },
    lastResult,
    onValidate({ formData }) {
      return parseWithZod(formData, { schema: createNoteSchema })
    },
  })

  return (
    <Form
      method="POST"
      className="flex h-full flex-col items-start gap-6 px-10 py-6"
      id={form.id}
    >
      <div className="flex w-full flex-col gap-1">
        <label htmlFor="title" className="text-lg font-bold">
          Title
        </label>
        <input
          {...getInputProps(fields.title, { type: 'text' })}
          className="rounded-md border-2 border-gray-400 px-1 py-2"
        />
        <div id={fields.title.errorId}>{fields.title.errors}</div>
      </div>
      <div className="flex w-full grow flex-col gap-1">
        <label htmlFor="content" className="text-lg font-bold">
          Content
        </label>
        <textarea
          {...getTextareaProps(fields.content)}
          className="h-full resize-none rounded-md border-2 border-gray-400 px-1 py-2"
        />
        <div id={fields.content.errorId}>{fields.content.errors}</div>
      </div>
      <div className="flex items-center space-x-2">
        <button
          type="submit"
          className="bg-light/50 hover:bg-light border-brand cursor-pointer rounded-md border-2 px-4 py-2 text-sm font-bold transition-colors duration-150 ease-in-out"
        >
          Save Note
        </button>
      </div>
    </Form>
  )
}
