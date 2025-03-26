'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/utils/supabase/server'

export async function login(formData) {
  const supabase = await createClient()

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email'),
    password: formData.get('password')
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/error')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData) {
  const supabase = await createClient()
  
  // Make sure we have email and password
  const email = formData.get('email')
  const password = formData.get('password')
  const name = formData.get('name')
  
  if (!email || !password) {
    console.log("Email and password are required")
    redirect('/error')
  }
  
  // The signUp method expects this specific structure
  const { data: authData, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: name
      }
    }
  })
  
  if (error) {
    console.log(error)
    redirect('/error')
  }
  

  revalidatePath('/', 'layout')
  redirect('/')
}

