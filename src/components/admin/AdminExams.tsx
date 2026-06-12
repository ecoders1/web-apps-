'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ClipboardList, Plus, Edit2, Trash2, Save, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils'

interface Department { id: string; name: string }
interface Subject { id: string; name: string; department_id: string }
interface MockTest {
  id: string; title: string; duration_minutes: number; total_questions: number;
  passing_score: number; is_active: boolean; department?: { name: string }; department_id: string
}
interface Question {
  id: string; question_text: string; question_type: string;
  difficulty: string; topic?: string; subject?: { name: string }
}

const TYPES = [
  { value: 'multiple_choice', label: 'Multiple Choice' },
  { value: 'true_false', label: 'True / False' },
  { value: 'fill_blank', label: 'Fill in Blank' },
]
const DIFF = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
]

const emptyMock = { title: '', department_id: '', duration_minutes: 120, total_questions: 50, passing_score: 50, is_active: true }
const emptyQ = { subject_id: '', topic: '', question_text: '', question_type: 'multiple_choice', options: { a: '', b: '', c: '', d: '' }, correct_answer: '', explanation: '', difficulty: 'medium' }

export default function AdminExams() {
  const [tab, setTab] = useState<'mock' | 'questions'>('mock')
  const [mockTests, setMockTests] = useState<MockTest[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [departments, setDepartments] = useState<Department[]>([])
  const [subjects, setSubjects] = useState<Subject[]>([])
  const [loading, setLoading] = useState(true)
  const [mockModal, setMockModal] = useState(false)
  const [qModal, setQModal] = useState(false)
  const [editMock, setEditMock] = useState<MockTest | null>(null)
  const [editQ, setEditQ] = useState<Question | null>(null)
  const [mockForm, setMockForm] = useState<typeof emptyMock>({ ...emptyMock })
  const [qForm, setQForm] = useState<typeof emptyQ & { options: Record<string, string> }>({ ...emptyQ, options: { a: '', b: '', c: '', d: '' } })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const load = async () => {
    const [mocks, qs, depts, subs] = await Promise.all([
      supabase.from('mock_tests').select('*, department:departments(name)').order('created_at', { ascending: false }),
      supabase.from('practice_questions').select('id, question_text, question_type, difficulty, topic, subject:subjects(name)').order('created_at', { ascending: false }).limit(50),
      supabase.from('departments').select('id, name').order('name'),
      supabase.from('subjects').select('id, name, department_id').order('name'),
    ])
    setMockTests(mocks.data || [])
    setQuestions(qs.data || [])
    setDepartments(depts.data || [])
    setSubjects(subs.data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const saveMock = async () => {
    if (!mockForm.title || !mockForm.department_id) { setError('Title and department are required'); return }
    setSaving(true); setError('')
    if (editMock) {
      const { error } = await supabase.from('mock_tests').update(mockForm).eq('id', editMock.id)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase.from('mock_tests').insert({ ...mockForm, created_by: user?.id })
      if (error) { setError(error.message); setSaving(false); return }
    }
    await load(); setMockModal(false); setSaving(false)
  }

  const deleteMock = async (id: string) => {
    if (!confirm('Delete this mock test?')) return
    await supabase.from('mock_tests').delete().eq('id', id)
    await load()
  }

  const saveQuestion = async () => {
    if (!qForm.subject_id || !qForm.question_text || !qForm.correct_answer) { setError('Subject, question, and correct answer are required'); return }
    setSaving(true); setError('')
    const payload = {
      subject_id: qForm.subject_id,
      topic: qForm.topic || null,
      question_text: qForm.question_text,
      question_type: qForm.question_type,
      options: qForm.question_type === 'multiple_choice' ? qForm.options : null,
      correct_answer: qForm.correct_answer,
      explanation: qForm.explanation || null,
      difficulty: qForm.difficulty,
    }
    if (editQ) {
      const { error } = await supabase.from('practice_questions').update(payload).eq('id', editQ.id)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      const { error } = await supabase.from('practice_questions').insert({ ...payload, created_by: user?.id })
      if (error) { setError(error.message); setSaving(false); return }
    }
    await load(); setQModal(false); setSaving(false)
  }

  const deleteQ = async (id: string) => {
    if (!confirm('Delete this question?')) return
    await supabase.from('practice_questions').delete().eq('id', id)
    await load()
  }

  const diffColor: Record<string, string> = {
    easy: 'success', medium: 'warning', hard: 'danger'
  }

  return (
    <div className="space-y-5 max-w-5xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <ClipboardList size={20} className="text-purple-600 dark:text-purple-400" />
            </div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Exams & Questions</h1>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-5">
          <button
            onClick={() => setTab('mock')}
            className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all', tab === 'mock' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400')}
          >
            Mock Tests ({mockTests.length})
          </button>
          <button
            onClick={() => setTab('questions')}
            className={cn('px-4 py-2 rounded-xl text-sm font-medium transition-all', tab === 'questions' ? 'bg-blue-600 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400')}
          >
            Questions ({questions.length})
          </button>
        </div>
      </motion.div>

      {/* Mock Tests Tab */}
      {tab === 'mock' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => { setEditMock(null); setMockForm({ ...emptyMock }); setError(''); setMockModal(true) }}>
              <Plus size={16} /> New Mock Test
            </Button>
          </div>
          {loading ? (
            <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />)}</div>
          ) : mockTests.length === 0 ? (
            <Card><CardContent className="text-center py-10 text-gray-500">No mock tests yet.</CardContent></Card>
          ) : (
            <div className="space-y-3">
              {mockTests.map(test => (
                <Card key={test.id} hover>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{test.title}</h4>
                          <Badge variant={test.is_active ? 'success' : 'outline'} className="text-xs">
                            {test.is_active ? 'Active' : 'Inactive'}
                          </Badge>
                        </div>
                        <div className="flex gap-3 mt-1 text-xs text-gray-400 flex-wrap">
                          {test.department && <span>{(test.department as Record<string, string>).name}</span>}
                          <span>{test.duration_minutes}min</span>
                          <span>{test.total_questions} questions</span>
                          <span>Pass: {test.passing_score}%</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <button onClick={() => { setEditMock(test); setMockForm({ title: test.title, department_id: test.department_id, duration_minutes: test.duration_minutes, total_questions: test.total_questions, passing_score: test.passing_score, is_active: test.is_active }); setError(''); setMockModal(true) }}
                          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                          <Edit2 size={14} />
                        </button>
                        <button onClick={() => deleteMock(test.id)}
                          className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Questions Tab */}
      {tab === 'questions' && (
        <div className="space-y-4">
          <div className="flex justify-end">
            <Button size="sm" onClick={() => { setEditQ(null); setQForm({ ...emptyQ, options: { a: '', b: '', c: '', d: '' } }); setError(''); setQModal(true) }}>
              <Plus size={16} /> Add Question
            </Button>
          </div>
          {loading ? (
            <div className="space-y-3">{[1, 2, 3, 4].map(i => <div key={i} className="h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />)}</div>
          ) : questions.length === 0 ? (
            <Card><CardContent className="text-center py-10 text-gray-500">No questions yet.</CardContent></Card>
          ) : (
            <div className="space-y-2">
              {questions.map((q, i) => (
                <motion.div key={q.id} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.02 }}>
                  <Card hover>
                    <CardContent className="p-3">
                      <div className="flex items-start gap-3">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-white line-clamp-2">{q.question_text}</p>
                          <div className="flex gap-2 mt-1.5 flex-wrap">
                            <Badge variant="outline" className="text-xs">{q.question_type.replace('_', ' ')}</Badge>
                            <Badge variant={diffColor[q.difficulty] as 'success' | 'warning' | 'danger'} className="text-xs">{q.difficulty}</Badge>
                            {q.subject && <Badge variant="info" className="text-xs">{(q.subject as Record<string, string>).name}</Badge>}
                            {q.topic && <span className="text-xs text-gray-400">{q.topic}</span>}
                          </div>
                        </div>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <button
                            onClick={() => {
                              setEditQ(q)
                              setQForm({
                                subject_id: '',
                                topic: q.topic || '',
                                question_text: q.question_text,
                                question_type: q.question_type,
                                options: { a: '', b: '', c: '', d: '' },
                                correct_answer: '',
                                explanation: '',
                                difficulty: q.difficulty,
                              })
                              setError('')
                              setQModal(true)
                            }}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all">
                            <Edit2 size={13} />
                          </button>
                          <button onClick={() => deleteQ(q.id)}
                            className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Mock Test Modal */}
      <Modal isOpen={mockModal} onClose={() => setMockModal(false)} title={editMock ? 'Edit Mock Test' : 'New Mock Test'} size="sm">
        <div className="p-1 space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Input label="Title" value={mockForm.title} onChange={e => setMockForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. CS Final Exam 2024" />
          <Select label="Department" options={departments.map(d => ({ value: d.id, label: d.name }))} placeholder="Select department" value={mockForm.department_id} onChange={e => setMockForm(f => ({ ...f, department_id: e.target.value }))} />
          <div className="grid grid-cols-3 gap-3">
            <Input label="Duration (min)" type="number" value={mockForm.duration_minutes} onChange={e => setMockForm(f => ({ ...f, duration_minutes: +e.target.value }))} />
            <Input label="Questions" type="number" value={mockForm.total_questions} onChange={e => setMockForm(f => ({ ...f, total_questions: +e.target.value }))} />
            <Input label="Pass Score %" type="number" value={mockForm.passing_score} onChange={e => setMockForm(f => ({ ...f, passing_score: +e.target.value }))} />
          </div>
          <Select label="Status" options={[{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }]} value={String(mockForm.is_active)} onChange={e => setMockForm(f => ({ ...f, is_active: e.target.value === 'true' }))} />
          <div className="flex gap-3 pt-1">
            <Button variant="outline" fullWidth onClick={() => setMockModal(false)}>Cancel</Button>
            <Button fullWidth loading={saving} onClick={saveMock}><Save size={15} /> Save</Button>
          </div>
        </div>
      </Modal>

      {/* Question Modal */}
      <Modal isOpen={qModal} onClose={() => setQModal(false)} title={editQ ? 'Edit Question' : 'Add Question'}>
        <div className="p-1 space-y-4 overflow-y-auto max-h-[70vh]">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Select label="Subject" options={subjects.map(s => ({ value: s.id, label: s.name }))} placeholder="Select subject" value={qForm.subject_id} onChange={e => setQForm(f => ({ ...f, subject_id: e.target.value }))} />
          <Input label="Topic (optional)" value={qForm.topic} onChange={e => setQForm(f => ({ ...f, topic: e.target.value }))} placeholder="e.g. Data Structures" />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Question Text</label>
            <textarea
              value={qForm.question_text}
              onChange={e => setQForm(f => ({ ...f, question_text: e.target.value }))}
              rows={3}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              placeholder="Enter the question..."
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Select label="Type" options={TYPES} value={qForm.question_type} onChange={e => setQForm(f => ({ ...f, question_type: e.target.value }))} />
            <Select label="Difficulty" options={DIFF} value={qForm.difficulty} onChange={e => setQForm(f => ({ ...f, difficulty: e.target.value }))} />
          </div>
          {qForm.question_type === 'multiple_choice' && (
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Options</label>
              {['a', 'b', 'c', 'd'].map(k => (
                <div key={k} className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-400 flex-shrink-0">{k.toUpperCase()}</span>
                  <input
                    value={qForm.options[k] || ''}
                    onChange={e => setQForm(f => ({ ...f, options: { ...f.options, [k]: e.target.value } }))}
                    placeholder={`Option ${k.toUpperCase()}`}
                    className="flex-1 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-gray-100"
                  />
                </div>
              ))}
              <Input label="Correct Answer Key (a/b/c/d)" value={qForm.correct_answer} onChange={e => setQForm(f => ({ ...f, correct_answer: e.target.value.toLowerCase() }))} placeholder="a" />
            </div>
          )}
          {qForm.question_type === 'true_false' && (
            <Select label="Correct Answer" options={[{ value: 'True', label: 'True' }, { value: 'False', label: 'False' }]} placeholder="Select" value={qForm.correct_answer} onChange={e => setQForm(f => ({ ...f, correct_answer: e.target.value }))} />
          )}
          {qForm.question_type === 'fill_blank' && (
            <Input label="Correct Answer" value={qForm.correct_answer} onChange={e => setQForm(f => ({ ...f, correct_answer: e.target.value }))} placeholder="Exact answer text" />
          )}
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Explanation (optional)</label>
            <textarea
              value={qForm.explanation}
              onChange={e => setQForm(f => ({ ...f, explanation: e.target.value }))}
              rows={2}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              placeholder="Explain the correct answer..."
            />
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="outline" fullWidth onClick={() => setQModal(false)}>Cancel</Button>
            <Button fullWidth loading={saving} onClick={saveQuestion}><Save size={15} /> Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
