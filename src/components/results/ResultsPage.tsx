'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  BarChart3, CheckCircle, XCircle, Trophy, TrendingUp,
  ClipboardList, BookOpen, Calendar, Target
} from 'lucide-react'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import { Card, CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/client'
import { formatDate, cn } from '@/lib/utils'

interface Result {
  id: string
  test_type: 'practice' | 'mock'
  total_questions: number
  correct_answers: number
  wrong_answers: number
  score_percentage: number
  time_taken_minutes?: number
  passed?: boolean
  created_at: string
  mock_test?: { title: string }
}

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444']

export default function ResultsPage() {
  const [results, setResults] = useState<Result[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'practice' | 'mock'>('all')

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      const { data } = await supabase
        .from('results')
        .select('*, mock_test:mock_tests(title)')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(50)
      setResults(data || [])
      setLoading(false)
    }
    fetch()
  }, [])

  const filtered = filter === 'all' ? results : results.filter(r => r.test_type === filter)
  const totalSessions = results.length
  const mockTests = results.filter(r => r.test_type === 'mock')
  const avgScore = results.length ? Math.round(results.reduce((s, r) => s + r.score_percentage, 0) / results.length) : 0
  const passRate = mockTests.length ? Math.round((mockTests.filter(r => r.passed).length / mockTests.length) * 100) : 0

  // Chart data - last 7 results
  const chartData = [...results].reverse().slice(-10).map((r, i) => ({
    name: `#${i + 1}`,
    score: Math.round(r.score_percentage),
    type: r.test_type,
  }))

  const pieData = [
    { name: 'Practice', value: results.filter(r => r.test_type === 'practice').length },
    { name: 'Mock Tests', value: mockTests.length },
  ].filter(d => d.value > 0)

  const scoreDistribution = [
    { range: '0-49%', count: results.filter(r => r.score_percentage < 50).length, color: '#ef4444' },
    { range: '50-69%', count: results.filter(r => r.score_percentage >= 50 && r.score_percentage < 70).length, color: '#f59e0b' },
    { range: '70-89%', count: results.filter(r => r.score_percentage >= 70 && r.score_percentage < 90).length, color: '#3b82f6' },
    { range: '90-100%', count: results.filter(r => r.score_percentage >= 90).length, color: '#10b981' },
  ]

  return (
    <div className="space-y-6">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
            <BarChart3 size={20} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Results</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Track your performance</p>
          </div>
        </div>
      </motion.div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Sessions', value: totalSessions, icon: Target, color: 'from-blue-500 to-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20' },
          { label: 'Mock Tests', value: mockTests.length, icon: ClipboardList, color: 'from-green-500 to-green-600', bg: 'bg-green-50 dark:bg-green-900/20' },
          { label: 'Average Score', value: `${avgScore}%`, icon: TrendingUp, color: 'from-orange-500 to-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20' },
          { label: 'Pass Rate', value: `${passRate}%`, icon: Trophy, color: 'from-purple-500 to-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20' },
        ].map((stat, i) => (
          <motion.div key={stat.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <Card>
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

      {!loading && results.length > 0 && (
        <>
          {/* Charts */}
          <div className="grid lg:grid-cols-2 gap-5">
            {/* Score trend */}
            {chartData.length > 1 && (
              <Card>
                <CardContent>
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Score Trend</h3>
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} />
                      <Tooltip formatter={(v) => [`${v}%`, 'Score']} />
                      <Bar dataKey="score" radius={[4, 4, 0, 0]}>
                        {chartData.map((entry, i) => (
                          <Cell key={i} fill={entry.score >= 50 ? '#10b981' : '#ef4444'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}

            {/* Score distribution */}
            <Card>
              <CardContent>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Score Distribution</h3>
                <div className="space-y-3">
                  {scoreDistribution.map(d => (
                    <div key={d.range}>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="text-gray-600 dark:text-gray-400">{d.range}</span>
                        <span className="font-medium text-gray-900 dark:text-white">{d.count}</span>
                      </div>
                      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: results.length ? `${(d.count / results.length) * 100}%` : '0%',
                            backgroundColor: d.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                {pieData.length > 0 && (
                  <div className="mt-4 flex justify-center">
                    <PieChart width={120} height={120}>
                      <Pie data={pieData} cx={55} cy={55} innerRadius={30} outerRadius={50} dataKey="value">
                        {pieData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                    <div className="flex flex-col justify-center gap-2 ml-4">
                      {pieData.map((d, i) => (
                        <div key={d.name} className="flex items-center gap-2 text-sm">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                          <span className="text-gray-600 dark:text-gray-400">{d.name}: {d.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Filter tabs */}
      <div className="flex gap-2">
        {(['all', 'practice', 'mock'] as const).map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-4 py-2 rounded-xl text-sm font-medium transition-all',
              filter === f
                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/25'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            )}
          >
            {f === 'all' ? 'All' : f === 'practice' ? 'Practice' : 'Mock Tests'}
          </button>
        ))}
      </div>

      {/* Results list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Target size={48} className="text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">No results yet. Start practicing!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((result, i) => (
            <motion.div
              key={result.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.03 }}
            >
              <Card hover>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <div className={cn(
                      'w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0',
                      result.score_percentage >= 50 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
                    )}>
                      {result.score_percentage >= 50
                        ? <CheckCircle size={22} className="text-green-500" />
                        : <XCircle size={22} className="text-red-500" />}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-medium text-gray-900 dark:text-white text-sm">
                          {result.test_type === 'mock'
                            ? (result.mock_test?.title || 'Mock Test')
                            : 'Practice Session'}
                        </h4>
                        <Badge variant={result.test_type === 'mock' ? 'info' : 'default'} className="text-xs">
                          {result.test_type === 'mock'
                            ? <><ClipboardList size={10} className="mr-1" />Mock</>
                            : <><BookOpen size={10} className="mr-1" />Practice</>}
                        </Badge>
                        {result.passed !== undefined && (
                          <Badge variant={result.passed ? 'success' : 'danger'} className="text-xs">
                            {result.passed ? 'Passed' : 'Failed'}
                          </Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Calendar size={11} />{formatDate(result.created_at)}
                        </span>
                        <span className="text-xs text-gray-500">
                          {result.correct_answers}/{result.total_questions} correct
                        </span>
                        {result.time_taken_minutes && (
                          <span className="text-xs text-gray-400">{result.time_taken_minutes}m</span>
                        )}
                      </div>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className={cn(
                        'text-xl font-extrabold',
                        result.score_percentage >= 70 ? 'text-green-500' :
                        result.score_percentage >= 50 ? 'text-orange-500' : 'text-red-500'
                      )}>
                        {Math.round(result.score_percentage)}%
                      </span>
                    </div>
                  </div>

                  {/* Score bar */}
                  <div className="mt-3 h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={cn(
                        'h-full rounded-full transition-all duration-500',
                        result.score_percentage >= 70 ? 'bg-green-500' :
                        result.score_percentage >= 50 ? 'bg-orange-500' : 'bg-red-500'
                      )}
                      style={{ width: `${result.score_percentage}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
