'use server'

import { createAdminClient } from '@/lib/supabase/admin'
import { err, ok, type Result } from '@/lib/result'

export async function checkDemoUserStatus(): Promise<Result<boolean>> {
  try {
    const supabaseAdmin = createAdminClient()
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
    
    if (error) return err(error.message)
    
    // Asumsikan user dengan email 'demo@dompetjujur.com' adalah demo user
    const hasDemoUser = users.some(u => u.email === 'demo@dompetjujur.com')
    return ok(hasDemoUser)
  } catch (error: any) {
    return err(error.message)
  }
}
