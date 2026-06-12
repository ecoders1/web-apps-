'use client'

import { useState, useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { FileText, Plus, Trash2, Upload, FileImage, BookOpen } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Modal from '@/components/ui/Modal'
import Badge from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/client'
import { formatDate, cn } from '@/lib/utils'

interface Resource {
  id: string; title: string; description?: string; file_url: string;
  file_type: string; created_at: string; department?: { name: string }
}

const FILE_TYPES = [
  { value: 'pdf', label: 'PDF' }, { value: 'docx', label: 'DOCX' },
  { value: 'pptx', label: 'PPTX' }, { value: 'xlsx', label: 'XLSX' },
  { value: 'image', label: 'Image' },
]

const typeColor: Record<string, string> = {
  pdf: 'text-red-500', docx: 'text-blue-500', pptx: 'text-orange-500',
  xlsx: 'text-green-500', image: 'text-purple-500',
}

export default function AdminResources() {
  const [resources, setResources] = useState<Resource[]>([])
  const [departments, setDepartments] = useState<{ value: string; label: string }[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [error, setError] = useState('')
  const [form, setForm] = useState({ title: '', description: '', file_type: 'pdf', department_id: '' })
  const [file, setFile] = useState<File | null>(null)
  const fileRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const load = async () => {
    const [res, depts] = await Promise.all([
      supabase.from('resources').select('*, department:departments(name)').order('created_at', { ascending: false }),
      supabase.from('departments').select('id, name').order('name'),
    ])
    setResources(res.data || [])
    setDepartments((depts.data || []).map(d => ({ value: d.id, label: d.name })))
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (!f) return
    setFile(f)
    const ext = f.name.split('.').pop()?.toLowerCase()
    if (ext === 'pdf' || ext === 'docx' || ext === 'pptx' || ext === 'xlsx') {
      setForm(prev => ({ ...prev, file_type: ext }))
    } else if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) {
      setForm(prev => ({ ...prev, file_type: 'image' }))
    }
  }

  const handleUpload = async () => {
    if (!form.title || !file) { setError('Title and file are required'); return }
    setSaving(true); setError(''); setUploadProgress(10)
    const { data: { user } } = await supabase.auth.getUser()
    const path = `${user?.id}/${Date.now()}_${file.name}`
    const { error: uploadErr, data } = await supabase.storage.from('resources').upload(path, file, { upsert: false })
    if (uploadErr) { setError(uploadErr.message); setSaving(false); setUploadProgress(0); return }
    setUploadProgress(80)
    const { data: urlData } = supabase.storage.from('resources').getPublicUrl(path)
    const { error: dbErr } = await supabase.from('resources').insert({
      title: form.title,
      description: form.description || null,
      file_url: urlData.publicUrl,
      file_type: form.file_type,
      department_id: form.department_id || null,
      uploaded_by: user?.id,
    })
    if (dbErr) { setError(dbErr.message); setSaving(false); setUploadProgress(0); return }
    setUploadProgress(100)
    await load()
    setModalOpen(false)
    setForm({ title: '', description: '', file_type: 'pdf', department_id: '' })
    setFile(null)
    setUploadProgress(0)
    setSaving(false)
  }

  const deleteResource = async (id: string, fileUrl: string) => {
    if (!confirm('Delete this resource?')) return
    await supabase.from('resources').delete().eq('id', id)
    // Try to remove from storage too
    const path = fileUrl.split('/resources/')[1]
    if (path) await supabase.storage.from('resources').remove([decodeURIComponent(path)])
    await load()
  }

  return (
    <div className="space-y-5 max-w-4xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
              <BookOpen size={20} className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">Resources</h1>
              <p className="text-sm text-gray-500">{resources.length} files uploaded</p>
            </div>
          </div>
          <Button size="sm" onClick={() => { setError(''); setForm({ title: '', description: '', file_type: 'pdf', department_id: '' }); setFile(null); setModalOpen(true) }}>
            <Upload size={16} /> Upload Resource
          </Button>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-24 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />)}
        </div>
      ) : resources.length === 0 ? (
        <Card><CardContent className="text-center py-12 text-gray-500">No resources uploaded yet.</CardContent></Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-3">
          {resources.map((r, i) => (
            <motion.div key={r.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card hover>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className={cn('w-10 h-10 rounded-xl bg-gray-50 dark:bg-gray-800 flex items-center justify-center flex-shrink-0', typeColor[r.file_type])}>
                      {r.file_type === 'image' ? <FileImage size={20} /> : <FileText size={20} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-sm text-gray-900 dark:text-white line-clamp-1">{r.title}</h4>
                      {r.description && <p className="text-xs text-gray-400 line-clamp-1 mt-0.5">{r.description}</p>}
                      <div className="flex gap-2 mt-1.5 flex-wrap">
                        <Badge className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500">{r.file_type.toUpperCase()}</Badge>
                        {r.department && <Badge variant="info" className="text-xs">{(r.department as Record<string, string>).name}</Badge>}
                      </div>
                      <p className="text-xs text-gray-400 mt-1">{formatDate(r.created_at)}</p>
                    </div>
                    <button
                      onClick={() => deleteResource(r.id, r.file_url)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all flex-shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title="Upload Resource" size="sm">
        <div className="p-1 space-y-4">
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <Input label="Title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Resource title" />
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description (optional)</label>
            <textarea
              value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-4 py-3 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 resize-none"
            />
          </div>
          <Select label="Department (optional)" options={departments} placeholder="All Departments" value={form.department_id} onChange={e => setForm(f => ({ ...f, department_id: e.target.value }))} />
          <Select label="File Type" options={FILE_TYPES} value={form.file_type} onChange={e => setForm(f => ({ ...f, file_type: e.target.value }))} />

          {/* File drop zone */}
          <div
            className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-xl p-6 text-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/10 transition-all"
            onClick={() => fileRef.current?.click()}
          >
            <Upload size={24} className="text-gray-400 mx-auto mb-2" />
            {file ? (
              <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{file.name}</p>
            ) : (
              <p className="text-sm text-gray-500">Click to choose a file (PDF, DOCX, PPTX, XLSX, Image)</p>
            )}
            <input ref={fileRef} type="file" className="hidden" accept=".pdf,.docx,.pptx,.xlsx,.jpg,.jpeg,.png,.gif,.webp" onChange={handleFileChange} />
          </div>

          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${uploadProgress}%` }} />
            </div>
          )}

          <div className="flex gap-3 pt-1">
            <Button variant="outline" fullWidth onClick={() => setModalOpen(false)}>Cancel</Button>
            <Button fullWidth loading={saving} onClick={handleUpload}>
              <Upload size={15} /> Upload
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
