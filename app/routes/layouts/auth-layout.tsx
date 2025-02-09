import { Outlet, redirect } from 'react-router'
import { getAuth } from '@clerk/react-router/ssr.server'
import type { Route } from './+types/auth-layout'

export async function loader(args: Route.LoaderArgs) {
  const { userId } = await getAuth(args)

  if (userId) return redirect('/')
  return null
}

export default function AuthLayout() {
  return (
    <main className="grid h-screen w-full grid-cols-3">
      <div className="bg-brand" />
      <div className="col-span-2 self-center justify-self-center">
        <Outlet />
      </div>
    </main>
  )
}
