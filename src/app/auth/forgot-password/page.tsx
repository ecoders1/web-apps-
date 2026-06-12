import ForgotPasswordForm from '@/components/auth/ForgotPasswordForm'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Forgot Password - Exit Exam Ethiopia',
}

export default function ForgotPassword() {
  return <ForgotPasswordForm />
}
