import AdminUsers from '@/components/admin/AdminUsers'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Manage Users - Admin' }

export default function UsersPage() {
  return <AdminUsers />
}
