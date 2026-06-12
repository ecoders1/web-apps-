import AdminResources from '@/components/admin/AdminResources'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Manage Resources - Admin' }

export default function ResourcesPage() {
  return <AdminResources />
}
