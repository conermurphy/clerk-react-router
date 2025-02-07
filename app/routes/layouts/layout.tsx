import { Link, NavLink, Outlet, redirect } from 'react-router'
import { SignOutButton } from '@clerk/react-router'
import { getAuth } from '@clerk/react-router/ssr.server'
import { createClerkClient } from '@clerk/react-router/api.server'
import { MdLogout } from 'react-icons/md'
import { db } from '~/db/config.server'
import { notes } from '~/db/schema.server'
import type { Route } from '../+types/layout'
import { desc, eq } from 'drizzle-orm'
import { formatDistanceToNow } from 'date-fns'

export async function loader(args: Route.LoaderArgs) {
  const { userId } = await getAuth(args)

  if (!userId) return redirect('/sign-in?redirect_url=' + args.request.url)

  const allNotes = await db
    .select()
    .from(notes)
    .where(eq(notes.authorId, userId))
    .orderBy(desc(notes.updatedAt))

  const user = await createClerkClient({
    secretKey: process.env.CLERK_SECRET_KEY,
  }).users.getUser(userId)

  return {
    userFullName: user.fullName,
    allNotes,
  }
}

export default function AppLayout({
  loaderData,
  params,
}: Route.ComponentProps) {
  const activeNoteId = params.id
  const { userFullName, allNotes } = loaderData

  return (
    <div className="grid h-screen w-full grid-cols-12 grid-rows-[max-content_1fr]">
      <div className="bg-light col-span-12 row-span-1 flex flex-row items-center justify-between border-b border-gray-300 p-4">
        <Link
          to="/"
          className="bg-brand h-max rounded-md px-2.5 py-1 text-lg font-bold transition-colors duration-150 ease-in-out hover:bg-blue-700"
        >
          N
        </Link>
        <SignOutButton>
          <button className="cursor-pointer rounded-md bg-red-300 p-2.5 text-gray-800">
            <MdLogout size={16} />
          </button>
        </SignOutButton>
      </div>

      <aside className="col-span-3 grid h-full grid-rows-12 overflow-hidden border-r border-gray-300 bg-gray-100">
        <div className="row-span-1 border-b border-gray-300 p-4 text-center">
          <p className="font-bold">Welcome, {userFullName}</p>
        </div>
        <div
          className={`row-span-10 row-start-2 ${!allNotes.length && 'flex items-center justify-center'}`}
        >
          {allNotes.length ? (
            <ul className="h-full overflow-scroll border-gray-300">
              {allNotes.map((note) => {
                return (
                  <li
                    key={note.id}
                    className={`border-t border-gray-300 bg-slate-100 px-4 py-3 transition-colors duration-150 ease-in-out first:border-t-0 hover:bg-slate-200 ${activeNoteId === note.id && 'bg-slate-200'}`}
                  >
                    <NavLink to={`/${note.id}`}>
                      <div className="flex items-center justify-between">
                        <p className="font-bold">{note.title}</p>
                        <time
                          dateTime={note.updatedAt.toISOString()}
                          className="text-xs italic"
                        >
                          {formatDistanceToNow(note.updatedAt, {
                            addSuffix: true,
                          })}
                        </time>
                      </div>
                      <p className="text-sm italic">
                        {note.content.slice(0, 20)}...
                      </p>
                    </NavLink>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-center text-sm italic">No notes found.</p>
          )}
        </div>
        <Link
          to="/new"
          className="bg-light/60 hover:bg-light row-span-1 border-t border-gray-300 p-4 text-center font-medium transition-colors duration-150 ease-in-out"
        >
          Create New +
        </Link>
      </aside>

      <main className="col-span-9 col-start-4 p-4">
        <Outlet key={activeNoteId} />
      </main>
    </div>
  )
}
