import { SignIn } from '@clerk/react-router'
import type { Route } from './+types/sign-in'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Noted | Sign In' },
    { name: 'description', content: 'Sign in to Noted!' },
  ]
}

export default function SignInPage() {
  return <SignIn />
}
