import { createClient } from '@supabase/supabase-js'
import type { Database } from './database.types'

/**
 * Admin client menggunakan Service Role Key.
 * HANYA untuk operasi server-side yang membutuhkan elevated privileges,
 * seperti deleteAccount. JANGAN import dari client components.
 */
export function createAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is not set')
  }

  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    serviceRoleKey,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  )
}
