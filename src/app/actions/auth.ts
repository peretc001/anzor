'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

import { createClient } from '@/lib/supabaseServer'

export async function signup(
  _prevState: { error?: string; status?: boolean } | undefined,
  values: { email: string; password: string }
) {
  const supabase = await createClient()

  const { email, password } = values

  const {
    data: { user },
    error
  } = await supabase.auth.signUp({ email, password })

  if (user?.id) {
    revalidatePath('/')
    return { id: user.id }
  }

  return { error: error?.status }
}

// При регистрации отправляется supabase Auth before create hook
// на krasovsky23.ru/webhooks/planirovochka_auth.php
export async function signin(
  _prevState: { error?: string; status?: boolean } | undefined,
  values: { email: string; password: string }
) {
  const supabase = await createClient()

  const { email, password } = values

  const {
    data: { user },
    error
  } = await supabase.auth.signInWithPassword({ email, password })

  if (user?.id) {
    revalidatePath('/')
    return { id: user.id }
  }

  return { error: error?.status }
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  revalidatePath('/')
  redirect('/')
}

export async function changePassword(
  _prevState: { error?: string; status?: boolean } | undefined,
  values: { password: string; password_repeat: string }
) {
  const supabase = await createClient()

  const { password, password_repeat } = values

  if (password !== password_repeat) return { error: 'incorrect' }

  const {
    data: { user },
    error
  } = await supabase.auth.updateUser({ password })

  if (!error && user?.id) {
    revalidatePath('/')
    return { id: user.id }
  }

  return { error: error?.status }
}
