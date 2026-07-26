import { createClient } from '@/lib/supabase/server'
import { type CreatePauseInput, type CompletePauseInput } from './schema'
import { type PauseSession } from './types'
import { PAUSE_DURATION_SECONDS, DEMO_PAUSE_SECONDS } from './constants'
import { isDemoModeAllowed } from '@/lib/env'

import { cookies } from 'next/headers'

export async function createPauseSession(
  userId: string,
  input: CreatePauseInput
): Promise<PauseSession> {
  const supabase = await createClient()

  const isDemo = input.isDemo && isDemoModeAllowed()
  const cookieStore = await cookies()
  const isE2E = process.env.NODE_ENV === 'development' && cookieStore.get('e2e-bypass-auth')?.value === 'true'
  
  const duration = isE2E ? 1 : (isDemo ? DEMO_PAUSE_SECONDS : PAUSE_DURATION_SECONDS)

  const startedAt = new Date()
  const eligibleAt = new Date(startedAt.getTime() + duration * 1000)

  const { data, error } = await (supabase
    .from('pause_sessions')
    .insert({
      user_id: userId,
      amount: input.amount,
      trigger_type: input.triggerType,
      urge_before: input.urgeBefore,
      started_at: startedAt.toISOString(),
      pause_eligible_at: eligibleAt.toISOString(),
      is_demo: isDemo,
    } as any)
    .select()
    .single() as any)

  if (error) throw error
  return data as PauseSession
}

export async function getPauseSession(sessionId: string): Promise<PauseSession | null> {
  const supabase = await createClient()
  const { data, error } = await (supabase
    .from('pause_sessions')
    .select('*')
    .eq('id', sessionId)
    .single() as any)

  if (error || !data) return null
  return data as PauseSession
}

export async function updatePauseIntent(
  sessionId: string,
  intent: 'continue' | 'unsure'
): Promise<void> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('pause_sessions')
    .update({ intent_during_pause: intent })
    .eq('id', sessionId)

  if (error) throw error
}

export async function completePauseSession(
  sessionId: string,
  input: CompletePauseInput
): Promise<void> {
  const supabase = await createClient()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error } = await (supabase as any)
    .from('pause_sessions')
    .update({
      outcome: input.outcome,
      completed_at: new Date().toISOString(),
    })
    .eq('id', sessionId)

  if (error) throw error
}
