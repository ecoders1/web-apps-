import SignUpForm from '@/components/auth/SignUpForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Create Account - Exit Exam Ethiopia',
  description: 'Join Exit Exam Ethiopia and start preparing for your exit examination',
}

export default function SignUpPage() {
  return <SignUpForm />
}
