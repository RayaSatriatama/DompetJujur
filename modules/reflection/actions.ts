'use server'

import { requireAuth } from '@/modules/auth/guard'
import { reflectionSchema, type ReflectionInput } from './schema'
import { createReflection } from './repository'
import { getPauseSession } from '@/modules/pause/repository'
import { err, ok, type Result, isErr } from '@/lib/result'
import { APP_ERRORS, type AppErrorCode } from '@/lib/errors'
import { revalidatePath } from 'next/cache'

export async function submitReflectionAction(
  sessionId: string,
  input: ReflectionInput
): Promise<Result<void, AppErrorCode>> {
  const authResult = await requireAuth()
  if (isErr(authResult)) return authResult

  const parsed = reflectionSchema.safeParse(input)
  if (!parsed.success) {
    return err(APP_ERRORS.VALIDATION_ERROR)
  }

  try {
    const session = await getPauseSession(sessionId)
    if (!session) return err(APP_ERRORS.SESSION_NOT_FOUND)
    if (session.user_id !== authResult.data.id) return err(APP_ERRORS.SESSION_NOT_OWNED)

    await createReflection(sessionId, authResult.data.id, parsed.data)
    
    revalidatePath(`/pause/${sessionId}`)
    revalidatePath('/history')
    return ok(undefined)
  } catch (error: any) {
    console.error('Submit reflection error:', error)
    if (error.message === 'REFLECTION_ALREADY_EXISTS') {
      return err(APP_ERRORS.REFLECTION_ALREADY_EXISTS)
    }
    return err(APP_ERRORS.DATABASE_ERROR)
  }
}
