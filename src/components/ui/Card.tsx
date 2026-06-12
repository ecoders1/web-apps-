import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  glass?: boolean
  hover?: boolean
}

export function Card({ children, className, glass, hover }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border',
        glass
          ? 'bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl border-white/20 dark:border-gray-700/50'
          : 'bg-white dark:bg-gray-900 border-gray-100 dark:border-gray-800',
        hover && 'hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 hover:-translate-y-0.5',
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('p-6 pb-0', className)}>
      {children}
    </div>
  )
}

export function CardContent({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('p-6', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <h3 className={cn('text-lg font-semibold text-gray-900 dark:text-white', className)}>
      {children}
    </h3>
  )
}
