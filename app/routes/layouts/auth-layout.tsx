import { Outlet } from 'react-router'

export async function loader() {
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
