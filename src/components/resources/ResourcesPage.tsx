'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  FileText, Download, Search, Filter,
  FileImage, BookOpen, TableIcon, Presentation
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/Card'
import Input from '@/components/ui/Input'
import Select from '@/components/ui/Select'
import Badge from '@/components/ui/Badge'
import { createClient } from '@/lib/supabase/client'
import { formatDate, cn } from '@/lib/utils'

interface Resource {
  id: string
  title: string
  description?: string
  file_url: string
  file_type: 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'image'
  created_at: string
  department?: { name: string }
  subject?: { name: string }
}

const fileTypeConfig = {
  pdf: { icon: FileText, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20', label: 'PDF' },
  docx: { icon: FileText, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20', label: 'DOCX' },
  pptx: { icon: Presentation, color: 'text-orange-500', bg: 'bg-orange-50 dark:bg-orange-900/20', label: 'PPTX' },
  xlsx: { icon: TableIcon, color: 'text-green-500', bg: 'bg-green-50 dark:bg-green-900/20', label: 'XLSX' },
  image: { icon: FileImage, color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-900/20', label: 'Image' },
}

export default function ResourcesPage() {
  const [resources, setResources] = useState<Resource[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [filterDept, setFilterDept] = useState('')
  const [filterType, setFilterType] = useState('')
  const [departments, setDepartments] = useState<{ value: string; label: string }[]>([])

  useEffect(() => {
    const fetch = async () => {
      const supabase = createClient()
      const [resourcesRes, deptsRes] = await Promise.all([
        supabase
          .from('resources')
          .select('*, department:departments(name), subject:subjects(name)')
          .order('created_at', { ascending: false }),
        supabase.from('departments').select('id, name').order('name'),
      ])
      setResources(resourcesRes.data || [])
      setDepartments((deptsRes.data || []).map(d => ({ value: d.id, label: d.name })))
      setLoading(false)
    }
    fetch()
  }, [])

  const filtered = resources.filter(r => {
    const matchSearch = !search || r.title.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase())
    const matchDept = !filterDept || (r.department as Record<string, string> | undefined)?.name === departments.find(d => d.value === filterDept)?.label
    const matchType = !filterType || r.file_type === filterType
    return matchSearch && matchDept && matchType
  })

  return (
    <div className="space-y-5">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
            <BookOpen size={20} className="text-indigo-600 dark:text-indigo-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Study Resources</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Download study materials</p>
          </div>
        </div>

        {/* Filters */}
        <div className="space-y-3">
          <Input
            placeholder="Search resources..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
          />
          <div className="grid grid-cols-2 gap-3">
            <Select
              options={departments}
              placeholder="All Departments"
              value={filterDept}
              onChange={e => setFilterDept(e.target.value)}
            />
            <Select
              options={[
                { value: 'pdf', label: 'PDF' },
                { value: 'docx', label: 'DOCX' },
                { value: 'pptx', label: 'PPTX' },
                { value: 'xlsx', label: 'XLSX' },
                { value: 'image', label: 'Image' },
              ]}
              placeholder="All Types"
              value={filterType}
              onChange={e => setFilterType(e.target.value)}
            />
          </div>
        </div>
      </motion.div>

      {loading ? (
        <div className="grid sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-28 rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <FileText size={48} className="text-gray-300 dark:text-gray-700 mx-auto mb-3" />
            <p className="text-gray-500 dark:text-gray-400">
              {resources.length === 0 ? 'No resources available yet.' : 'No resources match your search.'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid sm:grid-cols-2 gap-4">
          {filtered.map((resource, i) => {
            const config = fileTypeConfig[resource.file_type]
            const Icon = config.icon
            return (
              <motion.div
                key={resource.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.04 }}
              >
                <Card hover>
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className={cn('w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0', config.bg)}>
                        <Icon size={24} className={config.color} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 dark:text-white text-sm leading-tight line-clamp-2">
                          {resource.title}
                        </h4>
                        {resource.description && (
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{resource.description}</p>
                        )}
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          <Badge className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400">
                            {config.label}
                          </Badge>
                          {resource.department && (
                            <Badge variant="info" className="text-xs">
                              {(resource.department as Record<string, string>).name}
                            </Badge>
                          )}
                          {resource.subject && (
                            <Badge variant="outline" className="text-xs">
                              {(resource.subject as Record<string, string>).name}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{formatDate(resource.created_at)}</p>
                      </div>
                    </div>
                    <a
                      href={resource.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      download
                      className="mt-3 flex items-center justify-center gap-2 w-full py-2 rounded-xl bg-gray-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/20 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
                    >
                      <Download size={14} />
                      Download
                    </a>
                  </CardContent>
                </Card>
              </motion.div>
            )
          })}
        </div>
      )}
    </div>
  )
}
