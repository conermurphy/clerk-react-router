import { SignUp } from '@clerk/react-router'
import type { Route } from './+types/home'

export function meta({}: Route.MetaArgs) {
  return [
    { title: 'Notify | Sign Up' },
    { name: 'description', content: 'Sign up to Notify!' },
  ]
}

export default function SignUpPage() {
  return <SignUp />
}
