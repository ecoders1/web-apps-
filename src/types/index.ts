export interface User {
  id: string
  email: string
  role: 'admin' | 'user'
  created_at: string
}

export interface Profile {
  id: string
  user_id: string
  first_name: string
  last_name: string
  email: string
  phone_number?: string
  university?: string
  department_id?: string
  avatar_url?: string
  role: 'admin' | 'user'
  is_active: boolean
  created_at: string
  updated_at: string
  department?: Department
}

export interface Department {
  id: string
  name: string
  code: string
  description?: string
  created_at: string
}

export interface Subject {
  id: string
  name: string
  department_id: string
  description?: string
  created_at: string
}

export interface PracticeQuestion {
  id: string
  subject_id: string
  topic?: string
  question_text: string
  question_type: 'multiple_choice' | 'true_false' | 'fill_blank'
  options?: Record<string, string>
  correct_answer: string
  explanation?: string
  difficulty: 'easy' | 'medium' | 'hard'
  created_by: string
  created_at: string
  subject?: Subject
}

export interface MockTest {
  id: string
  title: string
  department_id: string
  duration_minutes: number
  total_questions: number
  passing_score: number
  is_active: boolean
  created_by: string
  created_at: string
  department?: Department
}

export interface MockTestQuestion {
  id: string
  mock_test_id: string
  question_id: string
  order_number: number
  question?: PracticeQuestion
}

export interface Result {
  id: string
  user_id: string
  mock_test_id?: string
  test_type: 'practice' | 'mock'
  total_questions: number
  correct_answers: number
  wrong_answers: number
  score_percentage: number
  time_taken_minutes?: number
  passed?: boolean
  answers?: Record<string, string>
  created_at: string
  mock_test?: MockTest
}

export interface Resource {
  id: string
  title: string
  description?: string
  file_url: string
  file_type: 'pdf' | 'docx' | 'pptx' | 'xlsx' | 'image'
  department_id?: string
  subject_id?: string
  uploaded_by: string
  created_at: string
}

export interface Announcement {
  id: string
  title: string
  content: string
  is_active: boolean
  created_by: string
  created_at: string
}

export interface ActivityLog {
  id: string
  user_id: string
  action: string
  details?: Record<string, unknown>
  created_at: string
}

export interface Stats {
  totalPracticeQuestions: number
  mockTestsTaken: number
  averageScore: number
  progressPercentage: number
}
