'use server'

import { requireAuth } from '@/modules/auth/guard'
import {
  createPauseSchema,
  completePauseSchema,
  type CreatePauseInput,
  type CompletePauseInput,
} from './schema'
import {
  createPauseSession,
  getPauseSession,
  updatePauseIntent,
  completePauseSession,
} from './repository'
import { err, ok, type Result, isErr } from '@/lib/result'
import { APP_ERRORS, type AppErrorCode } from '@/lib/errors'
import { determinePauseState } from './state-machine'
import { revalidatePath } from 'next/cache'

export async function createPauseAction(
  input: CreatePauseInput
): Promise<Result<{ id: string }, AppErrorCode>> {
  const authResult = await requireAuth()
  if (isErr(authResult)) return authResult

  const parsed = createPauseSchema.safeParse(input)
  if (!parsed.success) return err(APP_ERRORS.VALIDATION_ERROR)

  try {
    const session = await createPauseSession(authResult.data.id, parsed.data)
    revalidatePath('/dashboard')
    return ok({ id: session.id })
  } catch (error) {
    console.error('Create pause error:', error)
    return err(APP_ERRORS.DATABASE_ERROR)
  }
}



export async function completePauseAction(
  sessionId: string,
  input: CompletePauseInput
): Promise<Result<void, AppErrorCode>> {
  const authResult = await requireAuth()
  if (isErr(authResult)) return authResult

  const parsed = completePauseSchema.safeParse(input)
  if (!parsed.success) return err(APP_ERRORS.VALIDATION_ERROR)

  try {
    const session = await getPauseSession(sessionId)
    if (!session) return err(APP_ERRORS.SESSION_NOT_FOUND)
    if (session.user_id !== authResult.data.id) return err(APP_ERRORS.SESSION_NOT_OWNED)
    if (session.completed_at) return err(APP_ERRORS.SESSION_ALREADY_COMPLETED)

    const state = determinePauseState(session)
    if (state === 'timer') return err(APP_ERRORS.PAUSE_NOT_ELIGIBLE)

    await completePauseSession(sessionId, parsed.data)
    
    revalidatePath(`/pause/${sessionId}`)
    revalidatePath('/dashboard')
    revalidatePath('/history')
    return ok(null as any)
  } catch (error) {
    console.error('Complete pause error:', error)
    return err(APP_ERRORS.DATABASE_ERROR)
  }
}
