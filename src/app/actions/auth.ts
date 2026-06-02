'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createServerSupabase } from '@/lib/supabase/server'

type AuthResult = { error: string } | undefined

export async function login(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  const supabase = await createServerSupabase()

  const email = formData.get('email')
  const password = formData.get('password')

  if (!email || !password) {
    return { error: 'Email e senha são obrigatórios.' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email: email as string,
    password: password as string,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function register(_prev: AuthResult, formData: FormData): Promise<AuthResult> {
  const supabase = await createServerSupabase()

  const email = formData.get('email')
  const password = formData.get('password')
  const fullName = formData.get('full_name')

  if (!email || !password || !fullName) {
    return { error: 'Todos os campos são obrigatórios.' }
  }

  const { data, error } = await supabase.auth.signUp({
    email: email as string,
    password: password as string,
    options: {
      data: { full_name: fullName as string },
    },
  })

  if (error) {
    return { error: error.message }
  }

  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: fullName as string,
      role: 'customer',
    })

    if (profileError) {
      return { error: 'Erro ao criar perfil. Tente novamente.' }
    }
  }

  redirect('/')
}

export async function logout() {
  try {
    const supabase = await createServerSupabase()
    await supabase.auth.signOut()
  } catch (err) {
    console.error('Logout error:', err)
  }
  redirect('/login')
}
