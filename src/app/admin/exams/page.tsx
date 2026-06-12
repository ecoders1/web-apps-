import AdminExams from '@/components/admin/AdminExams'
import { Metadata } from 'next'

export const metadata: Metadata = { title: 'Manage Exams - Admin' }

export default function ExamsPage() {
  return <AdminExams />
}
