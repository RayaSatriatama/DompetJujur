'use server'

import { requireAuth } from '@/modules/auth/guard'
import { profileSchema, type ProfileInput } from './schema'
import { upsertProfile } from './repository'
import { err, ok, type Result, isErr } from '@/lib/result'
import { APP_ERRORS, type AppErrorCode } from '@/lib/errors'
import { revalidatePath } from 'next/cache'

export async function updateProfileAction(
  input: ProfileInput
): Promise<Result<void, AppErrorCode>> {
  const authResult = await requireAuth()
  if (isErr(authResult)) return authResult

  const parsed = profileSchema.safeParse(input)
  if (!parsed.success) {
    return err(APP_ERRORS.VALIDATION_ERROR)
  }

  try {
    await upsertProfile(authResult.data.id, parsed.data)
    revalidatePath('/profile')
    revalidatePath('/home')
    return ok(null as any)
  } catch (error) {
    console.error('Update profile error:', error)
    return err(APP_ERRORS.DATABASE_ERROR)
  }
}
