'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { GraduationCap, Plus, Edit2, Trash2, Save, X } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import { createClient } from '@/lib/supabase/client'

interface Department {
  id: string
  name: string
  code: string
  description?: string
  created_at: string
}

const emptyForm = { name: '', code: '', description: '' }

export default function AdminDepartments() {
  const [departments, setDepartments] = useState<Department[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editDept, setEditDept] = useState<Department | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<Department | null>(null)
  const [form, setForm] = useState(emptyForm)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const load = async () => {
    const { data } = await supabase.from('departments').select('*').order('name')
    setDepartments(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setForm(emptyForm); setEditDept(null); setError(''); setModalOpen(true) }
  const openEdit = (dept: Department) => { setForm({ name: dept.name, code: dept.code, description: dept.description || '' }); setEditDept(dept); setError(''); setModalOpen(true) }

  const handleSave = async () => {
    if (!form.name || !form.code) { setError('Name and code are required'); return }
    setSaving(true)
    setError('')
    if (editDept) {
      const { error } = await supabase.from('departments').update(form).eq('id', editDept.id)
      if (error) { setError(error.message); setSaving(false); return }
    } else {
      const { error } = await supabase.from('departments').insert(form)
      if (error) { setError(error.message); setSaving(false); return }
    }
    await load()
    setModalOpen(false)
    setSaving(false)
  }

  const handleDelete = async () => {
    if (!confirmDelete) return
    setSaving(true)
    await supabase.from('departments').delete().eq('id', confirmDelete.id)
    await load()
    setConfirmDelete(null)
    setSaving(false)
  }

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <GraduationCap size={20} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Departments</h1>
              <p className="text-sm text-gray-500">{departments.length} departments</p>
            </div>
          </div>
          <Button onClick={openCreate} size="sm">
            <Plus size={16} /> Add Department
          </Button>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />)}
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {departments.map((dept, i) => (
            <motion.div key={dept.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card hover>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-green-50 dark:bg-green-900/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-bold text-green-700 dark:text-green-400">{dept.code}</span>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">{dept.name}</h4>
                        {dept.description && (
                          <p className="text-xs text-gray-400 line-clamp-1">{dept.description}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => openEdit(dept)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button
                        onClick={() => setConfirmDelete(dept)}
                        className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Create/Edit Modal */}
      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editDept ? 'Edit Department' : 'Add Department'} size="sm">
        <div className="p-1 space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Input
            label="Department Name"
            placeholder="e.g. Computer Science"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
          <Input
            label="Code"
            placeholder="e.g. CS"
            value={form.code}
            onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))}
          />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (optional)</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Brief description..."
              rows={2}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            />
          </div>
          <div className="flex gap-3 pt-1">
            <Button variant="outline" fullWidth onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button fullWidth loading={saving} onClick={handleSave}>
              <Save size={15} /> {editDept ? 'Update' : 'Create'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm */}
      <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Delete Department" size="sm">
        <div className="p-1 space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Delete <strong>{confirmDelete?.name}</strong>? This may affect users and subjects linked to this department.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="danger" fullWidth loading={saving} onClick={handleDelete}>
              <Trash2 size={15} /> Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
