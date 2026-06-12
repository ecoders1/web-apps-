'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Clock, AlertTriangle, CheckCircle, XCircle, Trophy, ChevronLeft,
  ChevronRight, Shield, Monitor, RotateCcw, Home
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { cn, formatTime } from '@/lib/utils'

interface MockTest {
  id: string
  title: string
  duration_minutes: number
  total_questions: number
  passing_score: number
  department?: { name: string }
}

interface Question {
  id: string
  question_text: string
  question_type: 'multiple_choice' | 'true_false' | 'fill_blank'
  options?: Record<string, string>
  correct_answer: string
  explanation?: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic?: string
  order_number: number
}

type Phase = 'select' | 'instructions' | 'exam' | 'results'

export default function MockTestPage() {
  const { profile } = useAuth()
  const [phase, setPhase] = useState<Phase>('select')
  const [mockTests, setMockTests] = useState<MockTest[]>([])
  const [selectedMock, setSelectedMock] = useState<MockTest | null>(null)
  const [departments, setDepartments] = useState<{ id: string; name: string }[]>([])
  const [filterDept, setFilterDept] = useState('')
  const [loading, setLoading] = useState(true)

  // Exam state
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [tabWarnings, setTabWarnings] = useState(0)
  const [fillInput, setFillInput] = useState('')
  const [saving, setSaving] = useState(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const examRef = useRef<HTMLDivElement>(null)

  // Results state
  const [resultData, setResultData] = useState<{
    correct: number; wrong: number; total: number; score: number; passed: boolean; timeTaken: number
  } | null>(null)

  const supabase = createClient()

  useEffect(() => {
    Promise.all([
      supabase.from('departments').select('id, name').order('name'),
      supabase.from('mock_tests').select('*, department:departments(name)').eq('is_active', true).order('created_at', { ascending: false }),
    ]).then(([depts, tests]) => {
      setDepartments(depts.data || [])
      setMockTests(tests.data || [])
      if (profile?.department_id) setFilterDept(profile.department_id)
      setLoading(false)
    })
  }, [profile])

  const filteredTests = filterDept
    ? mockTests.filter(t => {
        const dept = departments.find(d => d.id === filterDept)
        return t.department?.name === dept?.name
      })
    : mockTests

  const startExam = async (mock: MockTest) => {
    setLoading(true)
    const { data } = await supabase
      .from('mock_test_questions')
      .select('order_number, question:practice_questions(*)')
      .eq('mock_test_id', mock.id)
      .order('order_number')
    const qs = (data || []).map((row: Record<string, unknown>) => ({
      ...(row.question as Record<string, unknown>),
      order_number: row.order_number as number,
    })) as Question[]
    const shuffled = qs.sort(() => Math.random() - 0.5)
    setQuestions(shuffled)
    setAnswers({})
    setCurrentIndex(0)
    setTimeLeft(mock.duration_minutes * 60)
    setTabWarnings(0)
    setFillInput('')
    setLoading(false)
    setPhase('exam')
  }

  // Timer countdown
  useEffect(() => {
    if (phase !== 'exam') return
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) { finishExam(); return 0 }
        return prev - 1
      })
    }, 1000)
    return () => { if (timerRef.current) clearInterval(timerRef.current) }
  }, [phase])

  // Anti-cheat: tab switch warning
  useEffect(() => {
    if (phase !== 'exam') return
    const handleVisibility = () => {
      if (document.hidden) setTabWarnings(w => w + 1)
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [phase])

  // Anti-cheat: disable right-click, copy, paste in exam
  useEffect(() => {
    if (phase !== 'exam') return
    const block = (e: Event) => e.preventDefault()
    document.addEventListener('contextmenu', block)
    document.addEventListener('copy', block)
    document.addEventListener('paste', block)
    document.addEventListener('cut', block)
    return () => {
      document.removeEventListener('contextmenu', block)
      document.removeEventListener('copy', block)
      document.removeEventListener('paste', block)
      document.removeEventListener('cut', block)
    }
  }, [phase])

  const finishExam = useCallback(async () => {
    if (timerRef.current) clearInterval(timerRef.current)
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    const correct = questions.filter(q => answers[q.id] === q.correct_answer).length
    const total = questions.length
    const score = total > 0 ? Math.round((correct / total) * 100) : 0
    const passed = score >= (selectedMock?.passing_score || 50)
    const timeTaken = selectedMock ? selectedMock.duration_minutes - Math.floor(timeLeft / 60) : 0

    if (user && total > 0) {
      await supabase.from('results').insert({
        user_id: user.id,
        mock_test_id: selectedMock?.id,
        test_type: 'mock',
        total_questions: total,
        correct_answers: correct,
        wrong_answers: total - correct,
        score_percentage: score,
        time_taken_minutes: timeTaken,
        passed,
        answers,
      })
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: 'mock_test_completed',
        details: { mock_test_id: selectedMock?.id, score, passed },
      })
    }
    setResultData({ correct, wrong: total - correct, total, score, passed, timeTaken })
    setSaving(false)
    setPhase('results')
  }, [questions, answers, selectedMock, timeLeft, supabase])

  const currentQ = questions[currentIndex]
  const answeredCount = Object.keys(answers).length
  const timerColor = timeLeft < 300 ? 'text-red-500' : timeLeft < 600 ? 'text-orange-500' : 'text-green-500'

  // ─── SELECT PHASE ──────────────────────────────────────────────
  if (phase === 'select') {
    return (
      <div className="max-w-2xl mx-auto space-y-5">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <Shield size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Mock Exam</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Real exam simulation</p>
            </div>
          </div>

          <Select
            label="Filter by Department"
            options={departments.map(d => ({ value: d.id, label: d.name }))}
            placeholder="All Departments"
            value={filterDept}
            onChange={e => setFilterDept(e.target.value)}
            className="mb-5"
          />

          {loading ? (
            <div className="grid gap-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
              ))}
            </div>
          ) : filteredTests.length === 0 ? (
            <Card>
              <CardContent className="text-center py-10">
                <Monitor size={48} className="text-gray-300 mx-auto mb-3" />
                <p className="text-gray-500">No mock tests available yet.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-3">
              {filteredTests.map(test => (
                <motion.div key={test.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
                  <Card hover>
                    <CardContent className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{test.title}</h3>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {test.department && (
                              <Badge variant="info" className="text-xs">{test.department.name}</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              <Clock size={11} className="mr-1" />{test.duration_minutes} min
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {test.total_questions} questions
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              Pass: {test.passing_score}%
                            </Badge>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => { setSelectedMock(test); setPhase('instructions') }}
                        >
                          Start
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    )
  }

  // ─── INSTRUCTIONS PHASE ────────────────────────────────────────
  if (phase === 'instructions' && selectedMock) {
    return (
      <div className="max-w-xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card>
            <CardContent className="space-y-5">
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-2xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center mx-auto mb-3">
                  <AlertTriangle size={32} className="text-orange-500" />
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{selectedMock.title}</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Read the instructions carefully</p>
              </div>

              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20">
                  <div className="text-xl font-bold text-blue-600">{selectedMock.duration_minutes}</div>
                  <div className="text-xs text-gray-500">Minutes</div>
                </div>
                <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                  <div className="text-xl font-bold text-green-600">{selectedMock.total_questions}</div>
                  <div className="text-xs text-gray-500">Questions</div>
                </div>
                <div className="p-3 rounded-xl bg-orange-50 dark:bg-orange-900/20">
                  <div className="text-xl font-bold text-orange-600">{selectedMock.passing_score}%</div>
                  <div className="text-xs text-gray-500">Pass Score</div>
                </div>
              </div>

              <div className="space-y-2">
                <h3 className="font-semibold text-gray-900 dark:text-white text-sm">Exam Rules:</h3>
                {[
                  'Once started, the timer cannot be paused',
                  'Switching tabs will be recorded as a warning',
                  'Right-click, copy, and paste are disabled',
                  'Your answers are saved automatically',
                  'You can navigate between questions freely',
                  'Submit before the timer runs out',
                ].map(rule => (
                  <div key={rule} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-gray-50 dark:bg-gray-800">
                    <AlertTriangle size={14} className="text-orange-400 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{rule}</span>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <Button variant="outline" fullWidth onClick={() => setPhase('select')}>
                  Cancel
                </Button>
                <Button fullWidth onClick={() => startExam(selectedMock)} loading={loading}>
                  Begin Exam
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // ─── EXAM PHASE ────────────────────────────────────────────────
  if (phase === 'exam' && currentQ) {
    const optionKeys = currentQ.options ? Object.keys(currentQ.options) : []
    return (
      <div ref={examRef} className="exam-mode max-w-2xl mx-auto space-y-4">
        {/* Exam header */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
            {currentIndex + 1} / {questions.length}
          </span>
          <div className={cn('flex items-center gap-2 font-mono text-lg font-bold', timerColor)}>
            <Clock size={18} />
            {formatTime(timeLeft)}
          </div>
          <span className="text-sm text-gray-500">{answeredCount}/{questions.length} answered</span>
        </div>

        {/* Tab warning */}
        {tabWarnings > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 flex items-center gap-2"
          >
            <AlertTriangle size={16} className="text-red-500" />
            <span className="text-sm text-red-600 dark:text-red-400">
              Tab switch warning #{tabWarnings} — stay on this page!
            </span>
          </motion.div>
        )}

        {/* Progress */}
        <div className="h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-green-500 transition-all duration-300"
            style={{ width: `${(answeredCount / questions.length) * 100}%` }}
          />
        </div>

        {/* Question card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQ.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Card>
              <CardContent>
                {currentQ.topic && (
                  <p className="text-xs text-blue-600 dark:text-blue-400 font-medium mb-3 uppercase tracking-wide">
                    {currentQ.topic}
                  </p>
                )}
                <p className="text-base font-medium text-gray-900 dark:text-white leading-relaxed mb-5">
                  {currentQ.question_text}
                </p>

                {currentQ.question_type === 'multiple_choice' && (
                  <div className="space-y-2.5">
                    {optionKeys.map(key => {
                      const selected = answers[currentQ.id] === key
                      return (
                        <button
                          key={key}
                          onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: key }))}
                          className={cn(
                            'w-full text-left px-4 py-3 rounded-xl border-2 transition-all flex items-center gap-3',
                            selected
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                              : 'border-gray-200 dark:border-gray-700 hover:border-blue-300'
                          )}
                        >
                          <span className={cn(
                            'w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0',
                            selected ? 'bg-blue-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                          )}>
                            {key.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-800 dark:text-gray-200">{currentQ.options![key]}</span>
                        </button>
                      )
                    })}
                  </div>
                )}

                {currentQ.question_type === 'true_false' && (
                  <div className="grid grid-cols-2 gap-3">
                    {['True', 'False'].map(opt => {
                      const selected = answers[currentQ.id] === opt
                      return (
                        <button
                          key={opt}
                          onClick={() => setAnswers(prev => ({ ...prev, [currentQ.id]: opt }))}
                          className={cn(
                            'py-4 rounded-xl border-2 font-semibold text-sm transition-all',
                            selected
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-600'
                              : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-blue-300'
                          )}
                        >
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                )}

                {currentQ.question_type === 'fill_blank' && (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={answers[currentQ.id] ?? fillInput}
                      onChange={e => {
                        setFillInput(e.target.value)
                        setAnswers(prev => ({ ...prev, [currentQ.id]: e.target.value.toLowerCase() }))
                      }}
                      placeholder="Type your answer..."
                      className="flex-1 rounded-xl border-2 px-4 py-3 text-sm border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-blue-500 outline-none transition-all"
                    />
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setCurrentIndex(i => Math.max(0, i - 1))} disabled={currentIndex === 0} className="flex-1">
            <ChevronLeft size={18} /> Prev
          </Button>
          {currentIndex < questions.length - 1 ? (
            <Button onClick={() => setCurrentIndex(i => i + 1)} className="flex-1">
              Next <ChevronRight size={18} />
            </Button>
          ) : (
            <Button variant="success" onClick={finishExam} loading={saving} className="flex-1">
              Submit <CheckCircle size={18} />
            </Button>
          )}
        </div>

        {/* Question grid navigator */}
        <Card>
          <CardContent className="p-4">
            <p className="text-xs text-gray-500 mb-3">Question Navigator</p>
            <div className="flex flex-wrap gap-1.5">
              {questions.map((q, i) => (
                <button
                  key={q.id}
                  onClick={() => setCurrentIndex(i)}
                  className={cn(
                    'w-8 h-8 rounded-lg text-xs font-semibold transition-all',
                    i === currentIndex
                      ? 'bg-blue-500 text-white'
                      : answers[q.id]
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                  )}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // ─── RESULTS PHASE ─────────────────────────────────────────────
  if (phase === 'results' && resultData) {
    return (
      <div className="max-w-xl mx-auto space-y-5">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card>
            <CardContent className="text-center py-8">
              <div className={cn(
                'w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4',
                resultData.passed ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
              )}>
                {resultData.passed
                  ? <Trophy size={44} className="text-green-500" />
                  : <XCircle size={44} className="text-red-500" />}
              </div>

              <div className={cn(
                'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-bold mb-4',
                resultData.passed
                  ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                  : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
              )}>
                {resultData.passed ? <CheckCircle size={16} /> : <XCircle size={16} />}
                {resultData.passed ? 'PASSED' : 'FAILED'}
              </div>

              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {selectedMock?.title}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Exam completed</p>

              <div className="text-5xl font-extrabold mb-6">
                <span className={resultData.passed ? 'text-green-500' : 'text-red-500'}>
                  {resultData.score}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-6">
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{resultData.total}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Total Questions</div>
                </div>
                <div className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{resultData.timeTaken}m</div>
                  <div className="text-xs text-gray-500 mt-0.5">Time Taken</div>
                </div>
                <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20">
                  <div className="text-2xl font-bold text-green-600">{resultData.correct}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Correct</div>
                </div>
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20">
                  <div className="text-2xl font-bold text-red-500">{resultData.wrong}</div>
                  <div className="text-xs text-gray-500 mt-0.5">Wrong</div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" fullWidth onClick={() => setPhase('select')}>
                  <RotateCcw size={16} /> Try Again
                </Button>
                <Button fullWidth onClick={() => window.location.href = '/dashboard'}>
                  <Home size={16} /> Dashboard
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  return null
}
