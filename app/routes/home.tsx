import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Notify' },
    { name: 'description', content: 'Welcome to Notify!' },
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
