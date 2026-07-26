'use server'

import { requireAuth } from '@/modules/auth/guard'
import { createAdminClient } from '@/lib/supabase/admin'
import { err, ok, type Result, isErr } from '@/lib/result'
import { APP_ERRORS, type AppErrorCode } from '@/lib/errors'
import { redirect } from 'next/navigation'

export async function deleteAccountAction(): Promise<Result<void, AppErrorCode>> {
  const authResult = await requireAuth()
  if (isErr(authResult)) return authResult

  try {
    const supabaseAdmin = createAdminClient()
    const { error } = await supabaseAdmin.auth.admin.deleteUser(authResult.data.id)
    
    if (error) {
      console.error('Delete account error:', error)
      return err(APP_ERRORS.ACCOUNT_DELETION_FAILED)
    }
  } catch (error) {
    console.error('Delete account error (admin client):', error)
    return err(APP_ERRORS.ACCOUNT_DELETION_FAILED)
  }

  redirect('/login')
}
