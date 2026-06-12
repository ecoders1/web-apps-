'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Users, Search, Trash2, UserCheck, UserX, Edit2,
  Plus, X, Save, Mail, Phone, Building, BookOpen, Lock
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import Modal from '@/components/ui/Modal'
import Avatar from '@/components/ui/Avatar'
import { createClient } from '@/lib/supabase/client'
import { formatDate, cn } from '@/lib/utils'

interface UserProfile {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  university?: string
  is_active: boolean
  role: string
  created_at: string
  department?: { name: string }
}

export default function AdminUsers() {
  const [users, setUsers] = useState<UserProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState('')
  const [editUser, setEditUser] = useState<UserProfile | null>(null)
  const [confirmDelete, setConfirmDelete] = useState<UserProfile | null>(null)
  const [saving, setSaving] = useState(false)
  const [editForm, setEditForm] = useState({ first_name: '', last_name: '', role: 'user', is_active: true })

  const supabase = createClient()

  const loadUsers = async () => {
    const { data } = await supabase
      .from('profiles')
      .select('*, department:departments(name)')
      .order('created_at', { ascending: false })
    setUsers(data || [])
    setLoading(false)
  }

  useEffect(() => { loadUsers() }, [])

  const filtered = users.filter(u => {
    const name = `${u.first_name} ${u.last_name} ${u.email}`.toLowerCase()
    const matchSearch = !search || name.includes(search.toLowerCase())
    const matchStatus = !filterStatus || (filterStatus === 'active' ? u.is_active : !u.is_active)
    return matchSearch && matchStatus
  })

  const openEdit = (user: UserProfile) => {
    setEditUser(user)
    setEditForm({ first_name: user.first_name, last_name: user.last_name, role: user.role, is_active: user.is_active })
  }

  const saveEdit = async () => {
    if (!editUser) return
    setSaving(true)
    await supabase.from('profiles').update(editForm).eq('id', editUser.id)
    await loadUsers()
    setEditUser(null)
    setSaving(false)
  }

  const toggleActive = async (user: UserProfile) => {
    await supabase.from('profiles').update({ is_active: !user.is_active }).eq('id', user.id)
    await loadUsers()
  }

  const deleteUser = async () => {
    if (!confirmDelete) return
    setSaving(true)
    await supabase.from('profiles').delete().eq('id', confirmDelete.id)
    await loadUsers()
    setConfirmDelete(null)
    setSaving(false)
  }

  return (
    <div className="space-y-5 max-w-6xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Users size={20} className="text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">User Management</h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">{users.length} registered users</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-3 flex-wrap mb-5">
          <div className="flex-1 min-w-48">
            <Input
              placeholder="Search users..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>
          <Select
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
            placeholder="All Users"
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="w-36"
          />
        </div>
      </motion.div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map(i => <div key={i} className="h-20 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />)}
        </div>
      ) : filtered.length === 0 ? (
        <Card><CardContent className="text-center py-12 text-gray-500">No users found.</CardContent></Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((user, i) => (
            <motion.div key={user.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
              <Card hover>
                <CardContent className="p-4">
                  <div className="flex items-center gap-4">
                    <Avatar name={`${user.first_name} ${user.last_name}`} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm">
                          {user.first_name} {user.last_name}
                        </h4>
                        <Badge variant={user.is_active ? 'success' : 'danger'} className="text-xs">
                          {user.is_active ? 'Active' : 'Inactive'}
                        </Badge>
                        {user.role === 'admin' && <Badge variant="warning" className="text-xs">Admin</Badge>}
                      </div>
                      <p className="text-xs text-gray-400">{user.email}</p>
                      <div className="flex gap-3 mt-1 text-xs text-gray-400">
                        {user.department && <span>{(user.department as Record<string, string>).name}</span>}
                        <span>{formatDate(user.created_at)}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      <button
                        onClick={() => openEdit(user)}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
                        title="Edit"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => toggleActive(user)}
                        className={cn(
                          'p-2 rounded-xl transition-all',
                          user.is_active
                            ? 'bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20'
                            : 'bg-green-50 dark:bg-green-900/20 text-green-500'
                        )}
                        title={user.is_active ? 'Suspend' : 'Activate'}
                      >
                        {user.is_active ? <UserX size={15} /> : <UserCheck size={15} />}
                      </button>
                      <button
                        onClick={() => setConfirmDelete(user)}
                        className="p-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                        title="Delete"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <Modal isOpen={!!editUser} onClose={() => setEditUser(null)} title="Edit User" size="sm">
        <div className="space-y-4 p-1">
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="First Name"
              value={editForm.first_name}
              onChange={e => setEditForm(f => ({ ...f, first_name: e.target.value }))}
              leftIcon={<Users size={15} />}
            />
            <Input
              label="Last Name"
              value={editForm.last_name}
              onChange={e => setEditForm(f => ({ ...f, last_name: e.target.value }))}
              leftIcon={<Users size={15} />}
            />
          </div>
          <Select
            label="Role"
            options={[{ value: 'user', label: 'Student' }, { value: 'admin', label: 'Admin' }]}
            value={editForm.role}
            onChange={e => setEditForm(f => ({ ...f, role: e.target.value }))}
          />
          <Select
            label="Status"
            options={[{ value: 'true', label: 'Active' }, { value: 'false', label: 'Inactive' }]}
            value={String(editForm.is_active)}
            onChange={e => setEditForm(f => ({ ...f, is_active: e.target.value === 'true' }))}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="outline" fullWidth onClick={() => setEditUser(null)}>Cancel</Button>
            <Button fullWidth loading={saving} onClick={saveEdit}>
              <Save size={15} /> Save
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirm Modal */}
      <Modal isOpen={!!confirmDelete} onClose={() => setConfirmDelete(null)} title="Confirm Delete" size="sm">
        <div className="p-1 space-y-4">
          <p className="text-gray-600 dark:text-gray-400 text-sm">
            Are you sure you want to delete <strong>{confirmDelete?.first_name} {confirmDelete?.last_name}</strong>? This action cannot be undone.
          </p>
          <div className="flex gap-3">
            <Button variant="outline" fullWidth onClick={() => setConfirmDelete(null)}>Cancel</Button>
            <Button variant="danger" fullWidth loading={saving} onClick={deleteUser}>
              <Trash2 size={15} /> Delete
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
