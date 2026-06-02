'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createServerSupabase()

  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    throw new Error(error.message)
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function register(formData: FormData) {
  const supabase = await createServerSupabase()

  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { full_name: fullName },
    },
  })

  if (error) {
    throw new Error(error.message)
  }

  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: fullName,
      role: 'customer',
    })
  }

  redirect('/')
}

export async function logout() {
  const supabase = await createServerSupabase()
  await supabase.auth.signOut()
  redirect('/login')
}
