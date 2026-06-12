'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  BookOpen, ChevronRight, ChevronLeft, CheckCircle, XCircle,
  RotateCcw, Target, Lightbulb, AlertCircle, Trophy, Home
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface Department { id: string; name: string }
interface Subject { id: string; name: string; department_id: string }
interface Question {
  id: string
  question_text: string
  question_type: 'multiple_choice' | 'true_false' | 'fill_blank'
  options?: Record<string, string>
  correct_answer: string
  explanation?: string
  difficulty: 'easy' | 'medium' | 'hard'
  topic?: string
}

type Phase = 'setup' | 'quiz' | 'results'

const difficultyColor = {
  easy: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  medium: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  hard: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
}

export default function PracticePage() {
  const { profile } = useAuth()
  const [phase, setPhase] = useState<Phase>('setup')

  // Setup state
  const [departments, setDepartments] = useState<Department[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [topics, setTopics] = useState<string[]>([])
  const [selectedDept, setSelectedDept] = useState('')
  const [selectedSubject, setSelectedSubject] = useState('')
  const [selectedTopic, setSelectedTopic] = useState('')
  const [questionType, setQuestionType] = useState('')
  const [loadingSetup, setLoadingSetup] = useState(true)

  // Quiz state
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [showExplanation, setShowExplanation] = useState(false)
  const [fillInput, setFillInput] = useState('')
  const [loadingQuiz, setLoadingQuiz] = useState(false)
  const [saving, setSaving] = useState(false)

  const supabase = createClient()

  // Load departments
  useEffect(() => {
    supabase.from('departments').select('id, name').order('name')
      .then(({ data }) => {
        setDepartments(data || [])
        if (profile?.department_id) setSelectedDept(profile.department_id)
        setLoadingSetup(false)
      })
  }, [profile])

  // Load subjects when dept changes
  useEffect(() => {
    if (!selectedDept) { setSubjects([]); setSelectedSubject(''); return }
    supabase.from('subjects').select('id, name, department_id').eq('department_id', selectedDept).order('name')
      .then(({ data }) => setSubjects(data || []))
    setSelectedSubject('')
    setSelectedTopic('')
    setTopics([])
  }, [selectedDept])

  // Load topics when subject changes
  useEffect(() => {
    if (!selectedSubject) { setTopics([]); setSelectedTopic(''); return }
    supabase.from('practice_questions').select('topic').eq('subject_id', selectedSubject).not('topic', 'is', null)
      .then(({ data }) => {
        const unique = [...new Set((data || []).map(q => q.topic).filter(Boolean))] as string[]
        setTopics(unique)
      })
    setSelectedTopic('')
  }, [selectedSubject])

  const startPractice = async () => {
    setLoadingQuiz(true)
    let query = supabase.from('practice_questions').select('*')
    if (selectedSubject) query = query.eq('subject_id', selectedSubject)
    else if (selectedDept) {
      const { data: subs } = await supabase.from('subjects').select('id').eq('department_id', selectedDept)
      const ids = (subs || []).map(s => s.id)
      if (ids.length) query = query.in('subject_id', ids)
    }
    if (selectedTopic) query = query.eq('topic', selectedTopic)
    if (questionType) query = query.eq('question_type', questionType)
    const { data } = await query.limit(20)
    const shuffled = (data || []).sort(() => Math.random() - 0.5)
    setQuestions(shuffled)
    setCurrentIndex(0)
    setAnswers({})
    setShowExplanation(false)
    setFillInput('')
    setLoadingQuiz(false)
    setPhase('quiz')
  }

  const currentQ = questions[currentIndex]
  const isAnswered = currentQ ? answers[currentQ.id] !== undefined : false
  const isCorrect = currentQ ? answers[currentQ.id] === currentQ.correct_answer : false

  const handleAnswer = (answer: string) => {
    if (isAnswered) return
    setAnswers(prev => ({ ...prev, [currentQ.id]: answer }))
    setShowExplanation(false)
  }

  const handleFillSubmit = () => {
    if (!fillInput.trim() || isAnswered) return
    handleAnswer(fillInput.trim().toLowerCase())
    setFillInput('')
  }

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(i => i + 1)
      setShowExplanation(false)
      setFillInput('')
    } else {
      finishPractice()
    }
  }

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(i => i - 1)
      setShowExplanation(false)
    }
  }

  const finishPractice = async () => {
    setSaving(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (user && questions.length > 0) {
      const correct = questions.filter(q => answers[q.id] === q.correct_answer).length
      await supabase.from('results').insert({
        user_id: user.id,
        test_type: 'practice',
        total_questions: questions.length,
        correct_answers: correct,
        wrong_answers: questions.length - correct,
        score_percentage: Math.round((correct / questions.length) * 100),
        answers,
      })
      await supabase.from('activity_logs').insert({
        user_id: user.id,
        action: 'practice_completed',
        details: { total: questions.length, correct, score: Math.round((correct / questions.length) * 100) },
      })
    }
    setSaving(false)
    setPhase('results')
  }

  const correct = questions.filter(q => answers[q.id] === q.correct_answer).length
  const scorePercent = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0

  // ─── SETUP PHASE ───────────────────────────────────────────────
  if (phase === 'setup') {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <BookOpen size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Practice Session</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">Customize your practice</p>
            </div>
          </div>

          <Card>
            <CardContent className="space-y-5">
              <Select
                label="Department"
                options={departments.map(d => ({ value: d.id, label: d.name }))}
                placeholder="All Departments"
                value={selectedDept}
                onChange={e => setSelectedDept(e.target.value)}
                disabled={loadingSetup}
              />
              <Select
                label="Subject"
                options={subjects.map(s => ({ value: s.id, label: s.name }))}
                placeholder="All Subjects"
                value={selectedSubject}
                onChange={e => setSelectedSubject(e.target.value)}
                disabled={!selectedDept}
              />
              <Select
                label="Topic (optional)"
                options={topics.map(t => ({ value: t, label: t }))}
                placeholder="All Topics"
                value={selectedTopic}
                onChange={e => setSelectedTopic(e.target.value)}
                disabled={!selectedSubject || topics.length === 0}
              />
              <Select
                label="Question Type"
                options={[
                  { value: 'multiple_choice', label: 'Multiple Choice' },
                  { value: 'true_false', label: 'True / False' },
                  { value: 'fill_blank', label: 'Fill in the Blank' },
                ]}
                placeholder="All Types"
                value={questionType}
                onChange={e => setQuestionType(e.target.value)}
              />

              <Button
                fullWidth
                size="lg"
                onClick={startPractice}
                loading={loadingQuiz}
                disabled={loadingSetup}
                className="mt-2"
              >
                <Target size={18} />
                Start Practice
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // ─── RESULTS PHASE ─────────────────────────────────────────────
  if (phase === 'results') {
    return (
      <div className="max-w-xl mx-auto space-y-6">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <Card>
            <CardContent className="text-center py-8">
              <div className={cn(
                'w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-4',
                scorePercent >= 50 ? 'bg-green-100 dark:bg-green-900/30' : 'bg-red-100 dark:bg-red-900/30'
              )}>
                {scorePercent >= 50
                  ? <Trophy size={44} className="text-green-500" />
                  : <Target size={44} className="text-red-500" />}
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {scorePercent >= 50 ? 'Great Job!' : 'Keep Practicing!'}
              </h2>
              <p className="text-gray-500 dark:text-gray-400 mb-6">Practice session complete</p>

              <div className="text-5xl font-extrabold mb-2">
                <span className={scorePercent >= 50 ? 'text-green-500' : 'text-red-500'}>
                  {scorePercent}%
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-6 mb-8">
                <div className="p-4 rounded-2xl bg-gray-50 dark:bg-gray-800">
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{questions.length}</div>
                  <div className="text-xs text-gray-500 mt-1">Total</div>
                </div>
                <div className="p-4 rounded-2xl bg-green-50 dark:bg-green-900/20">
                  <div className="text-2xl font-bold text-green-600">{correct}</div>
                  <div className="text-xs text-gray-500 mt-1">Correct</div>
                </div>
                <div className="p-4 rounded-2xl bg-red-50 dark:bg-red-900/20">
                  <div className="text-2xl font-bold text-red-500">{questions.length - correct}</div>
                  <div className="text-xs text-gray-500 mt-1">Wrong</div>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" fullWidth onClick={() => setPhase('setup')}>
                  <RotateCcw size={16} />
                  New Session
                </Button>
                <Button fullWidth onClick={() => { setPhase('quiz'); setCurrentIndex(0); setAnswers({}); setShowExplanation(false) }}>
                  <Home size={16} />
                  Review
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Question breakdown */}
          <div className="space-y-2 mt-4">
            {questions.map((q, i) => {
              const userAns = answers[q.id]
              const correct = userAns === q.correct_answer
              return (
                <div key={q.id} className={cn(
                  'flex items-center justify-between p-3 rounded-xl border',
                  correct
                    ? 'bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-800'
                )}>
                  <div className="flex items-center gap-3">
                    {correct
                      ? <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      : <XCircle size={16} className="text-red-500 flex-shrink-0" />}
                    <span className="text-sm text-gray-700 dark:text-gray-300 line-clamp-1">
                      Q{i + 1}: {q.question_text}
                    </span>
                  </div>
                  <Badge className={difficultyColor[q.difficulty]}>{q.difficulty}</Badge>
                </div>
              )
            })}
          </div>
        </motion.div>
      </div>
    )
  }

  // ─── QUIZ PHASE ────────────────────────────────────────────────
  if (!currentQ) {
    return (
      <div className="text-center py-20">
        <AlertCircle size={48} className="text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300 mb-2">No Questions Found</h3>
        <p className="text-gray-500 text-sm mb-6">Try different filter settings.</p>
        <Button onClick={() => setPhase('setup')} variant="outline">
          <ChevronLeft size={16} /> Back to Setup
        </Button>
      </div>
    )
  }

  const optionKeys = currentQ.options ? Object.keys(currentQ.options) : []

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => setPhase('setup')}>
          <ChevronLeft size={16} /> Exit
        </Button>
        <div className="text-sm font-medium text-gray-600 dark:text-gray-400">
          {currentIndex + 1} / {questions.length}
        </div>
        <Badge className={difficultyColor[currentQ.difficulty]}>{currentQ.difficulty}</Badge>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-green-500 rounded-full"
          animate={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ.id}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
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

              {/* Multiple Choice */}
              {currentQ.question_type === 'multiple_choice' && (
                <div className="space-y-2.5">
                  {optionKeys.map(key => {
                    const val = currentQ.options![key]
                    const selected = answers[currentQ.id] === key
                    const isRight = key === currentQ.correct_answer
                    let cls = 'border-gray-200 dark:border-gray-700 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                    if (isAnswered) {
                      if (isRight) cls = 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      else if (selected) cls = 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      else cls = 'border-gray-200 dark:border-gray-700 opacity-60'
                    }
                    return (
                      <button
                        key={key}
                        onClick={() => handleAnswer(key)}
                        disabled={isAnswered}
                        className={cn(
                          'w-full text-left px-4 py-3 rounded-xl border-2 transition-all duration-200 flex items-center justify-between gap-3',
                          cls
                        )}
                      >
                        <span className="flex items-center gap-3">
                          <span className={cn(
                            'w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0',
                            isAnswered && isRight ? 'bg-green-500 text-white' :
                            isAnswered && selected && !isRight ? 'bg-red-500 text-white' :
                            'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                          )}>
                            {key.toUpperCase()}
                          </span>
                          <span className="text-sm text-gray-800 dark:text-gray-200">{val}</span>
                        </span>
                        {isAnswered && isRight && <CheckCircle size={18} className="text-green-500 flex-shrink-0" />}
                        {isAnswered && selected && !isRight && <XCircle size={18} className="text-red-500 flex-shrink-0" />}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* True/False */}
              {currentQ.question_type === 'true_false' && (
                <div className="grid grid-cols-2 gap-3">
                  {['True', 'False'].map(opt => {
                    const selected = answers[currentQ.id] === opt
                    const isRight = opt === currentQ.correct_answer
                    let cls = 'border-gray-200 dark:border-gray-700 hover:border-blue-400'
                    if (isAnswered) {
                      if (isRight) cls = 'border-green-500 bg-green-50 dark:bg-green-900/20'
                      else if (selected) cls = 'border-red-500 bg-red-50 dark:bg-red-900/20'
                      else cls = 'border-gray-200 dark:border-gray-700 opacity-60'
                    }
                    return (
                      <button
                        key={opt}
                        onClick={() => handleAnswer(opt)}
                        disabled={isAnswered}
                        className={cn(
                          'py-4 rounded-xl border-2 font-semibold text-sm transition-all duration-200',
                          opt === 'True' ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400',
                          cls
                        )}
                      >
                        {opt}
                      </button>
                    )
                  })}
                </div>
              )}

              {/* Fill in the Blank */}
              {currentQ.question_type === 'fill_blank' && (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={fillInput}
                      onChange={e => setFillInput(e.target.value)}
                      onKeyDown={e => e.key === 'Enter' && handleFillSubmit()}
                      disabled={isAnswered}
                      placeholder="Type your answer..."
                      className={cn(
                        'flex-1 rounded-xl border-2 px-4 py-3 text-sm outline-none transition-all',
                        'bg-white dark:bg-gray-900 text-gray-900 dark:text-white',
                        'placeholder:text-gray-400',
                        isAnswered
                          ? isCorrect
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                            : 'border-red-500 bg-red-50 dark:bg-red-900/20'
                          : 'border-gray-200 dark:border-gray-700 focus:border-blue-500'
                      )}
                    />
                    {!isAnswered && (
                      <Button onClick={handleFillSubmit} disabled={!fillInput.trim()}>Submit</Button>
                    )}
                  </div>
                  {isAnswered && !isCorrect && (
                    <p className="text-sm text-green-600 dark:text-green-400">
                      Correct answer: <strong>{currentQ.correct_answer}</strong>
                    </p>
                  )}
                </div>
              )}

              {/* Explanation */}
              {isAnswered && currentQ.explanation && (
                <div className="mt-4">
                  <button
                    onClick={() => setShowExplanation(!showExplanation)}
                    className="flex items-center gap-1.5 text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    <Lightbulb size={15} />
                    {showExplanation ? 'Hide' : 'Show'} Explanation
                  </button>
                  <AnimatePresence>
                    {showExplanation && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mt-2 p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-sm text-gray-700 dark:text-gray-300 border border-blue-200 dark:border-blue-800"
                      >
                        {currentQ.explanation}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3">
        <Button variant="outline" onClick={goPrev} disabled={currentIndex === 0} className="flex-1">
          <ChevronLeft size={18} /> Previous
        </Button>
        {currentIndex < questions.length - 1 ? (
          <Button onClick={goNext} disabled={!isAnswered} className="flex-1">
            Next <ChevronRight size={18} />
          </Button>
        ) : (
          <Button variant="success" onClick={finishPractice} loading={saving} disabled={!isAnswered} className="flex-1">
            Finish <Trophy size={18} />
          </Button>
        )}
      </div>

      {/* Dot navigator */}
      <div className="flex items-center justify-center gap-1 pt-1 flex-wrap">
        {questions.map((q, i) => {
          const answered = answers[q.id] !== undefined
          const correct = answers[q.id] === q.correct_answer
          return (
            <button
              key={q.id}
              onClick={() => { setCurrentIndex(i); setShowExplanation(false) }}
              className={cn(
                'w-2.5 h-2.5 rounded-full transition-all duration-200',
                i === currentIndex ? 'w-5 bg-blue-500' :
                answered ? (correct ? 'bg-green-400' : 'bg-red-400') :
                'bg-gray-300 dark:bg-gray-600'
              )}
            />
          )
        })}
      </div>
    </div>
  )
}
