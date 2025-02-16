import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Noted' },
    { name: 'description', content: 'Welcome to Noted!' },
  ]
}

export default function Home() {
  return (
    <div className="flex h-full w-full items-center justify-center">
      <p className="italic">
        Please select a note from the sidebar or create a new one to get
        started.
      </p>
    </div>
  )
}
