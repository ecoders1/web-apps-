import ProfilePage from '@/components/profile/ProfilePage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile - Exit Exam Ethiopia',
}

export default function Profile() {
  return <ProfilePage />
}
