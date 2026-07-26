import { createClient } from '@/lib/supabase/server'
import { type ProfileInput } from './schema'
import { type Profile } from './types'

export async function getProfile(userId: string): Promise<Profile | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return data
}

export async function upsertProfile(userId: string, input: ProfileInput): Promise<Profile> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profiles')
    .upsert({
      id: userId,
      ...input,
    })
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}
