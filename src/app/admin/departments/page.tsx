import AdminDepartments from '@/components/admin/AdminDepartments'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Manage Departments - Admin' }

export default function DepartmentsPage() {
  return <AdminDepartments />
}
