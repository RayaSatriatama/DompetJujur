'use server'

import { createClient } from '@/lib/supabase/server'
import { err, ok, type Result } from '@/lib/result'
import { type AppErrorCode, APP_ERRORS } from '@/lib/errors'
import { redirect } from 'next/navigation'

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
