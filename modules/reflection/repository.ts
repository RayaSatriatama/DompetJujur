import { createClient } from '@/lib/supabase/server'
import { type ReflectionInput } from './schema'
import { type ReflectionEntry } from './types'

export async function createReflection(
  sessionId: string,
  userId: string,
  input: ReflectionInput
): Promise<ReflectionEntry> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('reflection_entries')
    .insert({
      session_id: sessionId,
      user_id: userId,
      reflection_code: input.reflectionCode,
      note: input.note,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      // unique violation on session_id
      throw new Error('REFLECTION_ALREADY_EXISTS')
    }
    throw error
  }

  return data
}

export async function getReflection(sessionId: string): Promise<ReflectionEntry | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('reflection_entries')
    .select('*')
    .eq('session_id', sessionId)
    .single()

  if (error || !data) return null
  return data
}
