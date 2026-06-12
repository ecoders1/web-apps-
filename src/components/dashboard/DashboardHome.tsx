'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import {
  BookOpen, ClipboardList, BarChart3, FileText,
  TrendingUp, CheckCircle, XCircle, Target,
  ArrowRight, Bell, Clock, Award
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'

interface DashboardStats {
  totalPractice: number
  mockTestsTaken: number
  avgScore: number
  progress: number
}

interface RecentResult {
  id: string
  test_type: string
  score_percentage: number
  total_questions: number
  correct_answers: number
  created_at: string
  mock_test?: { title: string }
}

interface Announcement {
  id: string
  title: string
  content: string
  created_at: string
}

export default function DashboardHome() {
  const { profile } = useAuth()
  const [stats, setStats] = useState<DashboardStats>({ totalPractice: 0, mockTestsTaken: 0, avgScore: 0, progress: 0 })
  const [recentResults, setRecentResults] = useState<RecentResult[]>([])
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)

  const fullName = profile ? `${profile.first_name} ${profile.last_name}` : 'Student'
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'

  useEffect(() => {
    const fetchData = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return

      const [resultsRes, announcementsRes] = await Promise.all([
        supabase
          .from('results')
          .select('*, mock_test:mock_tests(title)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(5),
        supabase
          .from('announcements')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(3),
      ])

      const results = resultsRes.data || []
      setRecentResults(results)
      setAnnouncements(announcementsRes.data || [])

      const mockTests = results.filter(r => r.test_type === 'mock')
      const avgScore = results.length > 0
        ? results.reduce((sum, r) => sum + r.score_percentage, 0) / results.length
        : 0

      setStats({
        totalPractice: results.filter(r => r.test_type === 'practice').length,
        mockTestsTaken: mockTests.length,
        avgScore: Math.round(avgScore),
        progress: Math.min(Math.round((results.length / 20) * 100), 100),
      })
      setLoading(false)
    }

    fetchData()
  }, [])

  const statsCards = [
    {
      label: 'Practice Sessions',
      value: stats.totalPractice,
      icon: BookOpen,
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Mock Tests Taken',
      value: stats.mockTestsTaken,
      icon: ClipboardList,
      color: 'from-green-500 to-green-600',
      bg: 'bg-green-50 dark:bg-green-900/20',
    },
    {
      label: 'Average Score',
      value: `${stats.avgScore}%`,
      icon: BarChart3,
      color: 'from-orange-500 to-orange-600',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      label: 'Progress',
      value: `${stats.progress}%`,
      icon: TrendingUp,
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50 dark:bg-purple-900/20',
    },
  ]

  const quickActions = [
    { href: '/dashboard/practice', icon: BookOpen, label: 'Start Practice', color: 'bg-blue-500 hover:bg-blue-600', desc: 'Topic-based practice' },
    { href: '/dashboard/mock-test', icon: ClipboardList, label: 'Mock Test', color: 'bg-green-500 hover:bg-green-600', desc: 'Simulate real exam' },
    { href: '/dashboard/results', icon: BarChart3, label: 'View Results', color: 'bg-orange-500 hover:bg-orange-600', desc: 'Your performance' },
    { href: '/dashboard/resources', icon: FileText, label: 'Resources', color: 'bg-purple-500 hover:bg-purple-600', desc: 'Study materials' },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 via-blue-700 to-green-600 p-6 text-white shadow-xl"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-28 h-28 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative flex items-start justify-between">
          <div className="flex items-center gap-4">
            <Avatar name={fullName} src={profile?.avatar_url} size="lg" className="ring-2 ring-white/30" />
            <div>
              <p className="text-blue-100 text-sm">{greeting},</p>
              <h2 className="text-xl font-bold">{fullName}</h2>
              <div className="flex items-center gap-2 mt-1">
                {profile?.department && (
                  <Badge className="bg-white/20 text-white border-none text-xs">
                    {profile.department.name}
                  </Badge>
                )}
                {profile?.university && (
                  <span className="text-blue-200 text-xs">{profile.university}</span>
                )}
              </div>
            </div>
          </div>
          <Award size={32} className="text-yellow-300 opacity-80" />
        </div>

        {/* Progress bar */}
        <div className="relative mt-5">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-blue-100">Overall Progress</span>
            <span className="font-semibold">{stats.progress}%</span>
          </div>
          <div className="h-2 bg-white/20 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${stats.progress}%` }}
              transition={{ duration: 1, delay: 0.5 }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {statsCards.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + i * 0.05 }}
          >
            <Card hover className="overflow-hidden">
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon size={16} className="text-white" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-gray-900 dark:text-white">{loading ? '—' : stat.value}</div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {quickActions.map(action => (
            <Link key={action.href} href={action.href}>
              <div className={`${action.color} rounded-2xl p-4 text-white transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:scale-95`}>
                <action.icon size={22} className="mb-2 opacity-90" />
                <div className="font-semibold text-sm">{action.label}</div>
                <div className="text-xs opacity-75 mt-0.5">{action.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </motion.div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Announcements */}
        {announcements.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <CardContent>
                <div className="flex items-center gap-2 mb-4">
                  <Bell size={18} className="text-orange-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Announcements</h3>
                </div>
                <div className="space-y-3">
                  {announcements.map(ann => (
                    <div key={ann.id} className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/10 border border-orange-100 dark:border-orange-900/30">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white">{ann.title}</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">{ann.content}</p>
                      <span className="text-xs text-gray-400 mt-1 block">{formatDate(ann.created_at)}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <Card>
            <CardContent>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-blue-500" />
                  <h3 className="font-semibold text-gray-900 dark:text-white">Recent Activity</h3>
                </div>
                <Link href="/dashboard/results">
                  <Button variant="ghost" size="sm" className="text-xs">
                    View all <ArrowRight size={12} />
                  </Button>
                </Link>
              </div>

              {recentResults.length === 0 ? (
                <div className="text-center py-8">
                  <Target size={40} className="text-gray-300 dark:text-gray-700 mx-auto mb-3" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">No activity yet</p>
                  <Link href="/dashboard/practice">
                    <Button size="sm" className="mt-3">Start Practicing</Button>
                  </Link>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentResults.map(result => (
                    <div key={result.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                      <div className="flex items-center gap-3">
                        {result.score_percentage >= 50 ? (
                          <CheckCircle size={18} className="text-green-500 flex-shrink-0" />
                        ) : (
                          <XCircle size={18} className="text-red-500 flex-shrink-0" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">
                            {result.test_type === 'mock' ? result.mock_test?.title || 'Mock Test' : 'Practice Session'}
                          </p>
                          <p className="text-xs text-gray-400">{formatDate(result.created_at)}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`text-sm font-bold ${result.score_percentage >= 50 ? 'text-green-600' : 'text-red-500'}`}>
                          {Math.round(result.score_percentage)}%
                        </span>
                        <p className="text-xs text-gray-400">{result.correct_answers}/{result.total_questions}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
