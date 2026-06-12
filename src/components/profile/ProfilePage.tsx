'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { motion } from 'framer-motion'
import {
  User, Mail, Phone, Building, BookOpen, Lock, Camera,
  LogOut, CheckCircle, TrendingUp, Edit2, X, Save
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Avatar from '@/components/ui/Avatar'
import Badge from '@/components/ui/Badge'
import { useAuth } from '@/context/AuthContext'
import { createClient } from '@/lib/supabase/client'
import { signOut } from '@/lib/auth/actions'
import { cn } from '@/lib/utils'

const profileSchema = z.object({
  first_name: z.string().min(2, 'Required'),
  last_name: z.string().min(2, 'Required'),
  phone_number: z.string().optional(),
  university: z.string().optional(),
})

const passwordSchema = z.object({
  newPassword: z.string().min(8, 'Min 8 characters').regex(/[A-Z]/, 'One uppercase').regex(/[0-9]/, 'One number'),
  confirmPassword: z.string(),
}).refine(d => d.newPassword === d.confirmPassword, { message: 'Passwords do not match', path: ['confirmPassword'] })

type ProfileForm = z.infer<typeof profileSchema>
type PasswordForm = z.infer<typeof passwordSchema>

export default function ProfilePage() {
  const { profile, refreshProfile } = useAuth()
  const [editing, setEditing] = useState(false)
  const [changingPassword, setChangingPassword] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [saveMsg, setSaveMsg] = useState('')
  const [saveError, setSaveError] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const fullName = profile ? `${profile.first_name} ${profile.last_name}` : 'Student'

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset } = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      first_name: profile?.first_name || '',
      last_name: profile?.last_name || '',
      phone_number: profile?.phone_number || '',
      university: profile?.university || '',
    },
  })

  const { register: regPwd, handleSubmit: handlePwd, formState: { errors: pwdErrors, isSubmitting: pwdSubmitting }, reset: resetPwd } = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  const onSaveProfile = async (data: ProfileForm) => {
    setSaveError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const { error } = await supabase.from('profiles').update({
      first_name: data.first_name,
      last_name: data.last_name,
      phone_number: data.phone_number,
      university: data.university,
    }).eq('user_id', user.id)
    if (error) { setSaveError(error.message); return }
    await refreshProfile()
    setSaveMsg('Profile updated!')
    setEditing(false)
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const onChangePassword = async (data: PasswordForm) => {
    setSaveError('')
    const { error } = await supabase.auth.updateUser({ password: data.newPassword })
    if (error) { setSaveError(error.message); return }
    setSaveMsg('Password changed successfully!')
    setChangingPassword(false)
    resetPwd()
    setTimeout(() => setSaveMsg(''), 3000)
  }

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploadingAvatar(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setUploadingAvatar(false); return }

    const ext = file.name.split('.').pop()
    const path = `${user.id}/avatar.${ext}`
    const { error: uploadError } = await supabase.storage.from('avatars').upload(path, file, { upsert: true })
    if (!uploadError) {
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(path)
      await supabase.from('profiles').update({ avatar_url: urlData.publicUrl }).eq('user_id', user.id)
      await refreshProfile()
      setSaveMsg('Avatar updated!')
      setTimeout(() => setSaveMsg(''), 3000)
    }
    setUploadingAvatar(false)
  }

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <div className="max-w-xl mx-auto space-y-5">
      {/* Success/Error message */}
      {saveMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 flex items-center gap-2 text-green-700 dark:text-green-400 text-sm"
        >
          <CheckCircle size={16} />
          {saveMsg}
        </motion.div>
      )}
      {saveError && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
          {saveError}
        </div>
      )}

      {/* Profile header card */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Card>
          <CardContent className="text-center py-8">
            <div className="relative inline-block mb-4">
              <Avatar name={fullName} src={profile?.avatar_url} size="xl" />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingAvatar}
                className="absolute bottom-0 right-0 w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-lg transition-colors"
              >
                {uploadingAvatar ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Camera size={14} />
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </div>

            <h2 className="text-xl font-bold text-gray-900 dark:text-white">{fullName}</h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm mt-0.5">{profile?.email}</p>

            <div className="flex justify-center gap-2 mt-3 flex-wrap">
              {profile?.department && (
                <Badge variant="info" className="text-xs">{(profile.department as Record<string, string>).name}</Badge>
              )}
              {profile?.university && (
                <Badge variant="outline" className="text-xs">
                  <Building size={10} className="mr-1" />{profile.university}
                </Badge>
              )}
              <Badge variant="success" className="text-xs">Student</Badge>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Profile Details */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Personal Information</h3>
              {!editing ? (
                <Button variant="ghost" size="sm" onClick={() => { setEditing(true); reset({ first_name: profile?.first_name, last_name: profile?.last_name, phone_number: profile?.phone_number || '', university: profile?.university || '' }) }}>
                  <Edit2 size={15} /> Edit
                </Button>
              ) : (
                <Button variant="ghost" size="sm" onClick={() => setEditing(false)}>
                  <X size={15} /> Cancel
                </Button>
              )}
            </div>

            {!editing ? (
              <div className="space-y-3">
                {[
                  { icon: User, label: 'Full Name', value: fullName },
                  { icon: Mail, label: 'Email', value: profile?.email || '—' },
                  { icon: Phone, label: 'Phone', value: profile?.phone_number || '—' },
                  { icon: Building, label: 'University', value: profile?.university || '—' },
                  { icon: BookOpen, label: 'Department', value: (profile?.department as Record<string, string> | undefined)?.name || '—' },
                ].map(item => (
                  <div key={item.label} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
                    <div className="w-8 h-8 rounded-lg bg-white dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                      <item.icon size={15} className="text-gray-500 dark:text-gray-400" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs text-gray-400">{item.label}</p>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <form onSubmit={handleSubmit(onSaveProfile)} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="First Name"
                    {...register('first_name')}
                    error={errors.first_name?.message}
                    leftIcon={<User size={15} />}
                  />
                  <Input
                    label="Last Name"
                    {...register('last_name')}
                    error={errors.last_name?.message}
                    leftIcon={<User size={15} />}
                  />
                </div>
                <Input
                  label="Phone Number"
                  {...register('phone_number')}
                  leftIcon={<Phone size={15} />}
                />
                <Input
                  label="University"
                  {...register('university')}
                  leftIcon={<Building size={15} />}
                />
                <Button type="submit" fullWidth loading={isSubmitting}>
                  <Save size={16} /> Save Changes
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Change Password */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}>
        <Card>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Security</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setChangingPassword(!changingPassword)}
              >
                {changingPassword ? <><X size={15} /> Cancel</> : <><Lock size={15} /> Change Password</>}
              </Button>
            </div>

            {changingPassword ? (
              <form onSubmit={handlePwd(onChangePassword)} className="space-y-4">
                <Input
                  label="New Password"
                  type="password"
                  placeholder="Min 8 chars, uppercase, number"
                  {...regPwd('newPassword')}
                  error={pwdErrors.newPassword?.message}
                  leftIcon={<Lock size={15} />}
                />
                <Input
                  label="Confirm Password"
                  type="password"
                  placeholder="Repeat new password"
                  {...regPwd('confirmPassword')}
                  error={pwdErrors.confirmPassword?.message}
                  leftIcon={<Lock size={15} />}
                />
                <Button type="submit" fullWidth loading={pwdSubmitting}>
                  <Save size={16} /> Update Password
                </Button>
              </form>
            ) : (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Keep your account secure with a strong password.
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Performance */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
        <Card>
          <CardContent>
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-blue-500" />
              <h3 className="font-semibold text-gray-900 dark:text-white">Quick Stats</h3>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Practice Sessions', key: 'practice' },
                { label: 'Mock Tests', key: 'mock' },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center">
                  <div className="text-xl font-bold text-blue-600 dark:text-blue-400">—</div>
                  <div className="text-xs text-gray-500 mt-0.5">{item.label}</div>
                </div>
              ))}
            </div>
            <Button
              variant="outline"
              fullWidth
              className="mt-4"
              onClick={() => window.location.href = '/dashboard/results'}
            >
              <TrendingUp size={16} /> View All Results
            </Button>
          </CardContent>
        </Card>
      </motion.div>

      {/* Sign Out */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}>
        <Button
          variant="danger"
          fullWidth
          size="lg"
          onClick={handleSignOut}
          className="mb-2"
        >
          <LogOut size={18} /> Sign Out
        </Button>
      </motion.div>
    </div>
  )
}
