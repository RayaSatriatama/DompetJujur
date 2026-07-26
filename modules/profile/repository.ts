import { createClient } from '@/lib/supabase/server'
import { type ProfileInput } from './schema'
import { type Profile } from './types'

export async function getProfile(userId: string): Promise<Profile | null> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = await createClient() as any
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error || !data) return null
  return data as Profile
}

export async function upsertProfile(userId: string, input: ProfileInput): Promise<Profile> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = await createClient() as any
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

  return data as Profile
}
