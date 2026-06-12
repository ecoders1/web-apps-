'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { GraduationCap, Mail, Lock, BookOpen, Trophy, Clock } from 'lucide-react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'
import ThemeToggle from '@/components/ui/ThemeToggle'
import { signIn } from '@/lib/auth/actions'

const schema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

export default function SignInForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormData) => {
    setLoading(true)
    setError('')

    const result = await signIn(data.email, data.password)

    if (result.error) {
      setError(result.error)
      setLoading(false)
    } else {
      router.push(result.redirectTo || '/dashboard')
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
      {/* Left side - illustration */}
      <div className="hidden lg:flex w-1/2 bg-gradient-to-br from-blue-600 to-green-600 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="absolute top-10 right-10 w-40 h-40 bg-white/10 rounded-full blur-xl" />
        <div className="absolute bottom-20 left-10 w-56 h-56 bg-white/10 rounded-full blur-xl" />
        
        <div className="relative text-white text-center">
          <div className="w-24 h-24 rounded-3xl bg-white/20 backdrop-blur flex items-center justify-center mx-auto mb-8">
            <GraduationCap size={48} />
          </div>
          <h1 className="text-4xl font-extrabold mb-4">Welcome Back!</h1>
          <p className="text-blue-100 text-lg max-w-xs mb-8">
            Continue your exam preparation journey
          </p>

          <div className="grid grid-cols-2 gap-4 max-w-xs mx-auto">
            {[
              { icon: BookOpen, label: 'Practice', value: '10K+ Questions' },
              { icon: Trophy, label: 'Pass Rate', value: '95%' },
              { icon: Clock, label: 'Mock Tests', value: '24/7 Access' },
              { icon: GraduationCap, label: 'Departments', value: '15+ Fields' },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-xl bg-white/10 backdrop-blur text-left">
                <item.icon size={16} className="text-blue-200 mb-1" />
                <div className="text-white font-semibold text-sm">{item.value}</div>
                <div className="text-blue-200 text-xs">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right side - form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
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
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Sign In</h2>
            <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Welcome back, enter your credentials to continue</p>

            {error && (
              <div className="mb-4 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <Input
                label="Email Address"
                type="email"
                placeholder="your@email.com"
                leftIcon={<Mail size={16} />}
                error={errors.email?.message}
                autoComplete="email"
                {...register('email')}
              />

              <Input
                label="Password"
                type="password"
                placeholder="Your password"
                leftIcon={<Lock size={16} />}
                error={errors.password?.message}
                autoComplete="current-password"
                {...register('password')}
              />

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    {...register('rememberMe')}
                  />
                  <span className="text-sm text-gray-600 dark:text-gray-400">Remember me</span>
                </label>
                <Link href="/auth/forgot-password" className="text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">
                  Forgot password?
                </Link>
              </div>

              <Button type="submit" fullWidth loading={loading} size="lg" className="mt-2">
                Sign In
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
              Don&apos;t have an account?{' '}
              <Link href="/auth/signup" className="font-medium text-blue-600 dark:text-blue-400 hover:underline">
                Sign up free
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
