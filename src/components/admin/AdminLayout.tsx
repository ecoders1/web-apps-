'use client'

import { ReactNode, useState } from 'react'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Users, BookOpen, ClipboardList, FileText,
  Bell, GraduationCap, Menu, X, LogOut, ChevronRight, Settings
} from 'lucide-react'
import { cn } from '@/lib/utils'
import ThemeToggle from '@/components/ui/ThemeToggle'
import Avatar from '@/components/ui/Avatar'
import { useAuth } from '@/context/AuthContext'
import { signOut } from '@/lib/auth/actions'

const navItems = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { href: '/admin/users', icon: Users, label: 'Users' },
  { href: '/admin/departments', icon: GraduationCap, label: 'Departments' },
  { href: '/admin/exams', icon: ClipboardList, label: 'Exams & Questions' },
  { href: '/admin/resources', icon: FileText, label: 'Resources' },
  { href: '/admin/announcements', icon: Bell, label: 'Announcements' },
]

function NavLink({ item, mobile, onClose }: { item: typeof navItems[0]; mobile?: boolean; onClose?: () => void }) {
  const pathname = usePathname()
  const isActive = item.exact ? pathname === item.href : pathname.startsWith(item.href)

  return (
    <Link
      href={item.href}
      onClick={onClose}
      className={cn(
        'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200',
        isActive
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
      )}
    >
      <item.icon size={18} className="flex-shrink-0" />
      <span>{item.label}</span>
      {isActive && !mobile && <ChevronRight size={14} className="ml-auto opacity-60" />}
    </Link>
  )
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const { profile } = useAuth()
  const fullName = profile ? `${profile.first_name} ${profile.last_name}` : 'Admin'

  const sidebar = (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-gray-100 dark:border-gray-800">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-md">
          <GraduationCap size={18} className="text-white" />
        </div>
        <div>
          <div className="font-bold text-gray-900 dark:text-white text-sm">Exit Exam</div>
          <div className="text-xs text-blue-600 dark:text-blue-400 font-medium">Admin Panel</div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map(item => (
          <NavLink key={item.href} item={item} onClose={() => setMobileOpen(false)} />
        ))}
      </nav>

      {/* Bottom */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800 space-y-1">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
        >
          <Settings size={18} />
          Student View
        </Link>
        <button
          onClick={() => signOut()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
        >
          <LogOut size={18} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-col bg-white dark:bg-gray-900 border-r border-gray-100 dark:border-gray-800 fixed left-0 top-0 bottom-0 z-30">
        {sidebar}
      </aside>

      {/* Mobile sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 bottom-0 w-72 bg-white dark:bg-gray-900 z-50 lg:hidden shadow-2xl"
            >
              <div className="absolute top-3 right-3">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-2 rounded-xl text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              </div>
              {sidebar}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 lg:ml-60">
        {/* Top header */}
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-center justify-between px-4 h-16">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <Menu size={20} />
            </button>
            <div className="flex items-center gap-3 ml-auto">
              <ThemeToggle />
              <div className="flex items-center gap-2">
                <Avatar name={fullName} src={profile?.avatar_url} size="sm" />
                <span className="hidden sm:block text-sm font-medium text-gray-900 dark:text-white">{fullName}</span>
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
