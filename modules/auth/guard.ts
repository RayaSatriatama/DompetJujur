import { getAuthUser } from '../../lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { APP_ERRORS } from '@/lib/errors'
import { err, ok, type Result } from '@/lib/result'
import { type AuthUser } from './types'

/**
 * Guard untuk Server Actions. Memastikan caller sudah terautentikasi.
 * Mengembalikan Result untuk menghindari throw.
 */
export async function requireAuth(): Promise<Result<AuthUser, typeof APP_ERRORS.UNAUTHORIZED>> {
  const supabase = await createClient()
  const {
    data: { user },
    error,
  } = await getAuthUser()

  if (error || !user) {
    return err(APP_ERRORS.UNAUTHORIZED)
  }

  return ok({ id: user.id, email: user.email })
}
