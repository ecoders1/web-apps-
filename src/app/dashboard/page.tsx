import DashboardHome from '@/components/dashboard/DashboardHome'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Dashboard - Exit Exam Ethiopia',
}

export default function DashboardPage() {
  return <DashboardHome />
}
