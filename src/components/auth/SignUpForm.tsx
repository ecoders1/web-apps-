'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { GraduationCap, User, Mail, Phone, Building, BookOpen, Lock, CheckCircle } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { createClient } from '@/lib/supabase/client'
import { signUp } from '@/lib/auth/actions'

const schema = z.object({
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phoneNumber: z.string().min(10, 'Phone number must be at least 10 digits').optional().or(z.literal('')),
  university: z.string().min(2, 'University name is required'),
  departmentId: z.string().optional(),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  confirmPassword: z.string(),
}).refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

type FormData = z.infer<typeof schema>

export default function SignUpForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [departments, setDepartments] = useState<{ value: string; label: string }[]>([])

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  useEffect(() => {
    const supabase = createClient()
    supabase.from('departments').select('id, name').order('name').then(({ data }) => {
      if (data) setDepartments(data.map(d => ({ value: d.id, label: d.name })))
    })
  }, [])

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')

    const result = await signUp({
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      phoneNumber: data.phoneNumber || '',
      university: data.university,
      departmentId: data.departmentId || '',
      password: data.password,
    })

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      setSuccess(true)
      setTimeout(() => router.push('/dashboard'), 2000)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-950 dark:to-gray-900 p-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="text-center"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={40} className="text-green-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Account Created!</h2>
          <p className="text-gray-500 dark:text-gray-400">Redirecting to your dashboard...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Left side - illustration */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-green-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-10 right-10 w-48 h-48 bg-white/10 rounded-full blur-xl" />
        <div className="relative text-white text-center">
          <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-8">
            <GraduationCap size={48} />
          </div>
          <h1 className="text-4xl font-extrabold mb-4">Join Us Today</h1>
          <p className="text-blue-100 text-lg max-w-xs">
            Start your journey to ace the Ethiopian university exit examination
          </p>
          <div className="mt-8 space-y-3 text-left">
            {['Free access to practice questions', 'Mock exams with real-time results', 'Track your progress', 'Study resources for all departments'].map(item => (
              <div key={item} className="flex items-center gap-3">
                <CheckCircle size={18} className="text-green-300 flex-shrink-0" />
                <span className="text-blue-100 text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex items-start justify-center p-6 overflow-y-auto">
        <div className="w-full max-w-md py-8">
          <div className="flex items-center justify-between mb-8">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                <GraduationCap size={18} className="text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">Exit Exam Ethiopia</span>
            </Link>
            <ThemeToggle />
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Create Account</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Fill in the details below to get started</p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="John"
                  leftIcon={<User size={16} />}
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  leftIcon={<User size={16} />}
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>

              <Input
                label="Email Address"
                type="email"
                placeholder="john@example.com"
                leftIcon={<Mail size={16} />}
                error={errors.email?.message}
                {...register('email')}
              />

              <Input
                label="Phone Number"
                type="tel"
                placeholder="+251 91 234 5678"
                leftIcon={<Phone size={16} />}
                error={errors.phoneNumber?.message}
                {...register('phoneNumber')}
              />

              <Input
                label="University"
                placeholder="Addis Ababa University"
                leftIcon={<Building size={16} />}
                error={errors.university?.message}
                {...register('university')}
              />

              <Select
                label="Department"
                options={departments}
                placeholder="Select your department"
                leftIcon={<BookOpen size={16} />}
                error={errors.departmentId?.message}
                {...register('departmentId')}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Min 8 chars with uppercase & number"
                leftIcon={<Lock size={16} />}
                error={errors.password?.message}
                hint="Min 8 characters, 1 uppercase, 1 number"
                {...register('password')}
              />

              <Input
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                leftIcon={<Lock size={16} />}
                error={errors.confirmPassword?.message}
                {...register('confirmPassword')}
              />

              <Button type="submit" fullWidth loading={loading} size="lg" className="mt-2">
                Create Account
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <Link href="/auth/signin" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Sign in
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
