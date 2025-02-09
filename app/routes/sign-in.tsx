import { SignIn } from '@clerk/react-router'
import type { Route } from './+types/sign-in'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Notify | Sign In' },
    { name: 'description', content: 'Sign in to Notify!' },
  ]
}

export default function SignInPage() {
  return <SignIn />
}
