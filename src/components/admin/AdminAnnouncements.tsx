'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Bell, Plus, Edit2, Trash2, Save, Eye, EyeOff } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/client'
import { formatDate } from '@/lib/utils'

interface Announcement {
  id: string; title: string; content: string; is_active: boolean; created_at: string
}

const empty = { title: '', content: '', is_active: true }

export default function AdminAnnouncements() {
  const [items, setItems] = useState<Announcement[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editItem, setEditItem] = useState<Announcement | null>(null)
  const [form, setForm] = useState(empty)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const supabase = createClient()

  const load = async () => {
    const { data } = await supabase.from('announcements').select('*').order('created_at', { ascending: false })
    setItems(data || [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openCreate = () => { setEditItem(null); setForm(empty); setError(''); setModalOpen(true) }
  const openEdit = (item: Announcement) => { setEditItem(item); setForm({ title: item.title, content: item.content, is_active: item.is_active }); setError(''); setModalOpen(true) }

  const handleSave = async () => {
    if (!form.title || !form.content) { setError('Title and content are required'); return }
    setSaving(true); setError('')
    if (editItem) {
      await supabase.from('announcements').update(form).eq('id', editItem.id)
    } else {
      const { data: { user } } = await supabase.auth.getUser()
      await supabase.from('announcements').insert({ ...form, created_by: user?.id })
    }
    await load(); setModalOpen(false); setSaving(false)
  }

  const toggleActive = async (item: Announcement) => {
    await supabase.from('announcements').update({ is_active: !item.is_active }).eq('id', item.id)
    await load()
  }

  const deleteItem = async (id: string) => {
    if (!confirm('Delete this announcement?')) return
    await supabase.from('announcements').delete().eq('id', id)
    await load()
  }

  return (
    <div className="space-y-5 max-w-3xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Bell size={20} className="text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Announcements</h1>
              <p className="text-sm text-gray-500">{items.length} total</p>
            </div>
          </div>
          <Button size="sm" onClick={openCreate}>
            <Plus size={16} /> New Announcement
          </Button>
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />)}</div>
      ) : items.length === 0 ? (
        <Card><CardContent className="text-center py-12 text-gray-500">No announcements yet.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {items.map((item, i) => (
            <motion.div key={item.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
              <Card hover>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h4 className="font-semibold text-sm text-gray-900 dark:text-white">{item.title}</h4>
                        <Badge variant={item.is_active ? 'success' : 'outline'} className="text-xs">
                          {item.is_active ? 'Active' : 'Hidden'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{item.content}</p>
                      <p className="text-xs text-gray-400 mt-2">{formatDate(item.created_at)}</p>
                    </div>
                    <div className="flex gap-1.5 flex-shrink-0">
                      <button onClick={() => toggleActive(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all" title={item.is_active ? 'Hide' : 'Show'}>
                        {item.is_active ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                      <button onClick={() => openEdit(item)} className="p-1.5 rounded-lg text-gray-400 hover:text-green-500 hover:bg-green-50 dark:hover:bg-green-900/20 transition-all">
                        <Edit2 size={14} />
                      </button>
                      <button onClick={() => deleteItem(item.id)} className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
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

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editItem ? 'Edit Announcement' : 'New Announcement'} size="sm">
        <div className="p-1 space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Input label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Announcement title" />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Content</label>
            <textarea
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={4}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
              placeholder="Write the announcement content..."
            />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className={`w-10 h-6 rounded-full transition-all duration-200 ${form.is_active ? 'bg-blue-500' : 'bg-gray-300 dark:bg-gray-600'}`}
              onClick={() => setForm(f => ({ ...f, is_active: !f.is_active }))}
            >
              <div className={`w-5 h-5 rounded-full bg-white shadow mt-0.5 transition-all duration-200 ${form.is_active ? 'ml-[18px]' : 'ml-0.5'}`} />
            </div>
            <span className="text-sm text-gray-700 dark:text-gray-300">{form.is_active ? 'Visible to students' : 'Hidden'}</span>
          </label>
          <div className="flex gap-3 pt-1">
            <Button variant="outline" fullWidth onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button fullWidth loading={saving} onClick={handleSave}><Save size={15} /> Save</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
