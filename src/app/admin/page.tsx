import AdminDashboard from '@/components/admin/AdminDashboard'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Admin Dashboard - Exit Exam Ethiopia' }

export default function Admin() {
  return <AdminDashboard />
}
