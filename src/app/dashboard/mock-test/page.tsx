import MockTestPage from '@/components/mock-test/MockTestPage'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Mock Test - Exit Exam Ethiopia',
}

export default function MockTest() {
  return <MockTestPage />
}
