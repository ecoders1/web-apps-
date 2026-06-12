'use client'

import { ReactNode } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { Home, BookOpen, ClipboardList, User, GraduationCap, Bell, FileText } from 'lucide-react'
import { cn } from '@/lib/utils'
import ThemeToggle from '@/components/ui/ThemeToggle'
import Avatar from '@/components/ui/Avatar'
import { useAuth } from '@/context/AuthContext'

const navItems = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/dashboard/practice', icon: BookOpen, label: 'Practice' },
  { href: '/dashboard/mock-test', icon: ClipboardList, label: 'Mock Test' },
  { href: '/dashboard/profile', icon: User, label: 'Profile' },
]

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname()
  const { profile } = useAuth()

  const fullName = profile
    ? `${profile.first_name} ${profile.last_name}`
    : 'Student'

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Top Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-md">
              <GraduationCap size={18} className="text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white hidden sm:block">
              Exit Exam <span className="gradient-text">Ethiopia</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <button className="relative p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <Bell size={18} />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
            </button>
            <ThemeToggle />
            <Link href="/dashboard/profile">
              <Avatar name={fullName} src={profile?.avatar_url} size="sm" />
            </Link>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="pt-16 pb-20 min-h-screen">
        <div className="max-w-6xl mx-auto px-4 py-6">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl border-t border-gray-200/50 dark:border-gray-800/50 safe-area-bottom">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-around h-16">
            {navItems.map(item => {
              const isActive = pathname === item.href || 
                (item.href !== '/dashboard' && pathname.startsWith(item.href))
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex flex-col items-center gap-1 px-4 py-1.5 rounded-xl transition-all duration-200',
                    isActive
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                  )}
                >
                  <div className={cn(
                    'p-1.5 rounded-xl transition-all duration-200',
                    isActive && 'bg-blue-100 dark:bg-blue-900/30'
                  )}>
                    <item.icon size={20} />
                  </div>
                  <span className="text-xs font-medium">{item.label}</span>
                </Link>
              )
            })}
          </div>
        </div>
      </nav>
    </div>
  )
}
