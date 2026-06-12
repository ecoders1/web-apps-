import AdminAnnouncements from '@/components/admin/AdminAnnouncements'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Manage Announcements - Admin' }

export default function AnnouncementsPage() {
  return <AdminAnnouncements />
}
