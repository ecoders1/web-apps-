'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function signUp(formData: {
  firstName: string
  lastName: string
  email: string
  phoneNumber: string
  university: string
  departmentId: string
  password: string
}) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({
    email: formData.email,
    password: formData.password,
    options: {
      data: {
        first_name: formData.firstName,
        last_name: formData.lastName,
        role: 'user',
      },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    const { error: profileError } = await supabase
      .from('profiles')
      .upsert({
        user_id: data.user.id,
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        phone_number: formData.phoneNumber,
        university: formData.university,
        department_id: formData.departmentId || null,
        role: 'user',
      })

    if (profileError) {
      return { error: profileError.message }
    }
  }

  return { success: true }
}

export async function signIn(email: string, password: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  // Get user profile to determine role
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('user_id', data.user.id)
    .single()

  revalidatePath('/', 'layout')
  
  return { 
    success: true, 
    role: profile?.role || 'user',
    redirectTo: profile?.role === 'admin' ? '/admin' : '/dashboard'
  }
}

export async function signOut() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/')
}

export async function getUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

export async function getUserProfile() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) return null

  const { data: profile } = await supabase
    .from('profiles')
    .select(`
      *,
      department:departments(*)
    `)
    .eq('user_id', user.id)
    .single()

  return profile
}
