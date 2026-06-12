import SignInForm from '@/components/auth/SignInForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Sign In - Exit Exam Ethiopia',
  description: 'Sign in to your Exit Exam Ethiopia account',
}

export default function SignInPage() {
  return <SignInForm />
}
