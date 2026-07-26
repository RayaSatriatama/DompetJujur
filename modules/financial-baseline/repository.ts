import { createClient } from '@/lib/supabase/server'
import { type FinancialBaselineInput } from './schema'
import { type FinancialBaseline } from './types'

export async function getLatestBaseline(userId: string): Promise<FinancialBaseline | null> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('financial_profiles')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single() as { data: any, error: any }

  if (error || !data) return null
  return data
}

export async function insertBaseline(
  userId: string,
  input: FinancialBaselineInput
): Promise<FinancialBaseline> {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('financial_profiles')
    .insert({
      user_id: userId,
      ...input,
    } as any)
    .select()
    .single()

  if (error) {
    throw error
  }

  return data
}
