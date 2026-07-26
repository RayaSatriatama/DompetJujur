'use server'

import { createClient } from '@/lib/supabase/server'
import { err, ok, type Result } from '@/lib/result'
import { type AppErrorCode, APP_ERRORS } from '@/lib/errors'
import { redirect } from 'next/navigation'

export async function signInInstantly(email: string): Promise<Result<void, string>> {
  const supabase = await createClient()
  const dummyPassword = 'DompetJujurBypass123!' // Dummy password for 1-click login

  // Try to sign in first (in case they already registered with this dummy password)
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password: dummyPassword,
  })

  if (!signInError) {
    return ok(null as any) // Success
  }

  // If sign in fails, try to sign up
  const { data, error: signUpError } = await supabase.auth.signUp({
    email,
    password: dummyPassword,
  })

  if (signUpError) {
    console.error('Insta-Login Error:', signUpError)
    return err(signUpError.message)
  }

  // If signUp succeeds but there is no session, it means "Confirm Email" is still enabled in Supabase!
  if (!data.session) {
    return err('Anda harus mematikan "Confirm Email" di Supabase Dashboard (Authentication > Providers > Email) agar fitur ini berfungsi.')
  }

  return ok(null as any)
}

export async function signInWithOtp(email: string): Promise<Result<void, string>> {
  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithOtp({
    email,
  })

  if (error) {
    console.error('Sign In Error:', error)
    return err(error.message)
  }

  return ok(null as any)
}

export async function verifyOtp(email: string, token: string): Promise<Result<void, string>> {
  const supabase = await createClient()
  const { error } = await supabase.auth.verifyOtp({
    email,
    token,
    type: 'email',
  })

  if (error) {
    console.error('Verify OTP Error:', error)
    return err(error.message)
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
