'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, GraduationCap, ClipboardList, BarChart3,
  TrendingUp, CheckCircle, XCircle, BookOpen
} from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { Card, CardContent } from '@/components/ui/Card'
import { createClient } from '@/lib/supabase/client'

interface Stats {
  totalUsers: number
  activeUsers: number
  totalDepartments: number
  totalQuestions: number
  totalMockTests: number
  totalResults: number
  passRate: number
  avgScore: number
}

interface DeptStat { name: string; users: number; results: number }

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0, activeUsers: 0, totalDepartments: 0, totalQuestions: 0,
    totalMockTests: 0, totalResults: 0, passRate: 0, avgScore: 0,
  })
  const [deptStats, setDeptStats] = useState<DeptStat[]>([])
  const [recentUsers, setRecentUsers] = useState<{ id: string; first_name: string; last_name: string; email: string; created_at: string; department?: { name: string } }[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      const [
        usersRes, deptsRes, questionsRes, mockRes, resultsRes, recentUsersRes
      ] = await Promise.all([
        supabase.from('profiles').select('id, is_active', { count: 'exact' }),
        supabase.from('departments').select('id, name', { count: 'exact' }),
        supabase.from('practice_questions').select('id', { count: 'exact' }),
        supabase.from('mock_tests').select('id', { count: 'exact' }),
        supabase.from('results').select('score_percentage, passed'),
        supabase.from('profiles').select('id, first_name, last_name, email, created_at, department:departments(name)').order('created_at', { ascending: false }).limit(5),
      ])

      const allResults = resultsRes.data || []
      const passedCount = allResults.filter(r => r.passed).length
      const passRate = allResults.length ? Math.round((passedCount / allResults.length) * 100) : 0
      const avgScore = allResults.length ? Math.round(allResults.reduce((s, r) => s + r.score_percentage, 0) / allResults.length) : 0

      setStats({
        totalUsers: usersRes.count || 0,
        activeUsers: (usersRes.data || []).filter(u => u.is_active).length,
        totalDepartments: deptsRes.count || 0,
        totalQuestions: questionsRes.count || 0,
        totalMockTests: mockRes.count || 0,
        totalResults: allResults.length,
        passRate,
        avgScore,
      })
      setRecentUsers(recentUsersRes.data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  const statCards = [
    { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
    { label: 'Departments', value: stats.totalDepartments, icon: GraduationCap, color: 'from-green-500 to-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
    { label: 'Questions', value: stats.totalQuestions, icon: BookOpen, color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
    { label: 'Mock Tests', value: stats.totalMockTests, icon: ClipboardList, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
    { label: 'Exam Results', value: stats.totalResults, icon: BarChart3, color: 'from-pink-500 to-pink-600', bg: 'bg-pink-50 dark:bg-pink-900/20' },
    { label: 'Pass Rate', value: `${stats.passRate}%`, icon: TrendingUp, color: 'from-teal-500 to-teal-600', bg: 'bg-teal-50 dark:bg-teal-900/20' },
    { label: 'Avg Score', value: `${stats.avgScore}%`, icon: CheckCircle, color: 'from-cyan-500 to-cyan-600', bg: 'bg-cyan-50 dark:bg-cyan-900/20' },
    { label: 'Active Users', value: stats.activeUsers, icon: Users, color: 'from-indigo-500 to-indigo-600', bg: 'bg-indigo-50 dark:bg-indigo-900/20' },
  ]

  const chartData = [
    { name: 'Users', value: stats.totalUsers, color: '#3b82f6' },
    { name: 'Questions', value: stats.totalQuestions, color: '#10b981' },
    { name: 'Mock Tests', value: stats.totalMockTests, color: '#f59e0b' },
    { name: 'Results', value: stats.totalResults, color: '#8b5cf6' },
  ]

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Overview of platform activity</p>
      </motion.div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {statCards.map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
            <Card hover>
              <CardContent className="p-4">
                <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center mb-3`}>
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                    <stat.icon size={16} className="text-white" />
                  </div>
                </div>
                <div className="text-2xl font-extrabold text-gray-900 dark:text-white">
                  {loading ? '—' : stat.value}
                </div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{stat.label}</div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-5">
        {/* Chart */}
        {!loading && (
          <Card>
            <CardContent>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Platform Overview</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <Tooltip />
                  <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                    {chartData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        )}

        {/* Recent Users */}
        <Card>
          <CardContent>
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Registrations</h3>
            {recentUsers.length === 0 ? (
              <p className="text-gray-400 text-sm py-4 text-center">No users yet</p>
            ) : (
              <div className="space-y-3">
                {recentUsers.map(user => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                      {user.first_name[0]}{user.last_name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {user.first_name} {user.last_name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">{user.email}</p>
                    </div>
                    {user.department && (
                      <span className="text-xs text-gray-400 hidden sm:block">
                        {(user.department as Record<string, string>).name}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
