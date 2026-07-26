'use server'

import { createClient } from '@/lib/supabase/server'
import { err, ok, type Result } from '@/lib/result'
import { type AppErrorCode, APP_ERRORS } from '@/lib/errors'
import { redirect } from 'next/navigation'

export async function loginWithPassword(email: string, password: string): Promise<Result<void, string>> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Sign In Error:', error)
    return err(error.message)
  }

  return ok(null as any)
}

export async function registerWithPassword(email: string, password: string): Promise<Result<void, string>> {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    console.error('Sign Up Error:', error)
    return err(error.message)
  }

  if (!data.session) {
    return err('Registrasi berhasil, tetapi fitur "Confirm Email" di Supabase masih aktif. Silakan matikan terlebih dahulu agar Anda bisa langsung masuk.')
  }

  return ok(null as any)
}

export async function signOut(): Promise<Result<void, string>> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signOut()

  if (error) {
    console.error('Sign Out Error:', error)
    return err(error.message)
  }

  redirect('/login')
}
