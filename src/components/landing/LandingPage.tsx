'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { 
  BookOpen, Trophy, Clock, Users, Star, ArrowRight, 
  CheckCircle, GraduationCap, BarChart3, Shield, Zap
} from 'lucide-react'
import ThemeToggle from '@/components/ui/ThemeToggle'
import Button from '@/components/ui/Button'

const stats = [
  { value: '50K+', label: 'Students', icon: Users },
  { value: '10K+', label: 'Questions', icon: BookOpen },
  { value: '95%', label: 'Pass Rate', icon: Trophy },
  { value: '15+', label: 'Departments', icon: GraduationCap },
]

const features = [
  {
    icon: BookOpen,
    title: 'Practice Questions',
    description: 'Access thousands of exam questions across all departments with detailed explanations.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: Clock,
    title: 'Mock Exams',
    description: 'Simulate real exam conditions with timed tests and randomized questions.',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: BarChart3,
    title: 'Progress Tracking',
    description: 'Monitor your performance with detailed analytics and progress reports.',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Shield,
    title: 'Exam Security',
    description: 'Anti-cheat features ensure fair and authentic exam practice experience.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Zap,
    title: 'Instant Results',
    description: 'Get immediate feedback on your answers with step-by-step solutions.',
    color: 'from-yellow-500 to-yellow-600',
  },
  {
    icon: Star,
    title: 'Study Resources',
    description: 'Download PDFs, presentations, and study materials for all subjects.',
    color: 'from-pink-500 to-pink-600',
  },
]

const departments = [
  'Computer Science', 'Software Engineering', 'Information Technology',
  'Nursing', 'Midwifery', 'Civil Engineering', 'Mechanical Engineering',
  'Electrical Engineering', 'Accounting & Finance', 'Economics', 
  'Management', 'Public Health', 'Law', 'English', 'Mathematics'
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-gray-200/50 dark:border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2.5"
            >
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center shadow-lg">
                <GraduationCap size={20} className="text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white text-lg">
                Exit Exam <span className="gradient-text">Ethiopia</span>
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <ThemeToggle />
              <Link href="/auth/signin">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
              <Link href="/auth/signup">
                <Button size="sm">Sign Up</Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-24 pb-20 lg:pt-32 lg:pb-28 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950" />
        
        {/* Animated blobs */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-10 right-10 w-96 h-96 bg-green-400/20 dark:bg-green-600/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '1.5s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-400/10 dark:bg-orange-600/5 rounded-full blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-medium mb-6">
                <Star size={14} className="fill-current" />
                Ethiopia&apos;s #1 Exit Exam Platform
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-4xl sm:text-5xl lg:text-7xl font-extrabold text-gray-900 dark:text-white leading-tight mb-6"
            >
              Welcome to{' '}
              <span className="gradient-text block sm:inline">Exit Exam Ethiopia</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-10 max-w-2xl mx-auto leading-relaxed"
            >
              Practice, Prepare, and Pass Your Exit Examination. Join thousands of Ethiopian university students mastering their exit exams.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/auth/signup">
                <Button size="lg" className="w-full sm:w-auto group">
                  Get Started Free
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/auth/signin">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </motion.div>

            {/* Trust badges */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="mt-8 flex items-center justify-center gap-6 text-sm text-gray-500 dark:text-gray-400"
            >
              {['Free to start', 'No credit card', '50,000+ students'].map((item) => (
                <span key={item} className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-green-500" />
                  {item}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-sm"
              >
                <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center mx-auto mb-3">
                  <stat.icon size={22} className="text-blue-600 dark:text-blue-400" />
                </div>
                <div className="text-3xl font-extrabold text-gray-900 dark:text-white">{stat.value}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 dark:text-white mb-4">
              Everything You Need to Succeed
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-lg max-w-2xl mx-auto">
              Our platform provides all the tools you need to ace your exit examination
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group p-6 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:shadow-lg hover:shadow-blue-500/5 dark:hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-1"
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 shadow-lg`}>
                  <feature.icon size={22} className="text-white" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Departments Section */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-4">
              All Departments Covered
            </h2>
            <p className="text-gray-500 dark:text-gray-400">Supporting all Ethiopian university departments</p>
          </motion.div>

          <div className="flex flex-wrap justify-center gap-3">
            {departments.map((dept, i) => (
              <motion.span
                key={dept}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="px-4 py-2 rounded-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-default"
              >
                {dept}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-blue-600 to-green-600 p-12 text-center text-white shadow-2xl"
          >
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
            <div className="relative">
              <h2 className="text-3xl sm:text-4xl font-extrabold mb-4">
                Ready to Pass Your Exit Exam?
              </h2>
              <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
                Join over 50,000 students who have already started their journey to success.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/auth/signup">
                  <Button 
                    className="bg-white text-blue-600 hover:bg-blue-50 shadow-xl w-full sm:w-auto"
                    size="lg"
                  >
                    Create Free Account
                  </Button>
                </Link>
                <Link href="/auth/signin">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white text-white hover:bg-white hover:text-blue-600 w-full sm:w-auto"
                  >
                    Sign In
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-800 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center">
                <GraduationCap size={16} className="text-white" />
              </div>
              <span className="font-bold text-gray-900 dark:text-white">Exit Exam Ethiopia</span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © {new Date().getFullYear()} Exit Exam Ethiopia. Empowering Ethiopian students.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
