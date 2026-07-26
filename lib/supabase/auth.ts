import { createClient } from './server'
import { cookies } from 'next/headers'
import { User } from '@supabase/supabase-js'

export async function getAuthUser(): Promise<{ data: { user: User | null }, error: any }> {
  // E2E Mocking for TDD
  if (process.env.NODE_ENV === 'development') {
    const cookieStore = await cookies()
    if (cookieStore.get('e2e-bypass-auth')?.value === 'true') {
      return {
        data: {
          user: {
            id: '00000000-0000-0000-0000-000000000001', // ID from seed.sql
            email: 'demo@example.com',
            app_metadata: {},
            user_metadata: {},
            aud: 'authenticated',
            created_at: new Date().toISOString(),
          } as User
        },
        error: null
      }
    }
  }

  const supabase = await createClient()
  return supabase.auth.getUser()
}
