import { SignUp } from '@clerk/react-router'
import type { Route } from './+types/sign-up'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Noted | Sign Up' },
    { name: 'description', content: 'Sign up to Noted!' },
  ]
}

export default function SignUpPage() {
  return <SignUp />
}
