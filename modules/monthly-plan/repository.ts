import { createClient } from '@/lib/supabase/server'
import { getMonthKey } from '@/lib/utils'
import { type MonthlyPlanInput } from './schema'
import { type MonthlyPlan } from './types'
import { calcMonthlyPlan } from './calculations'

export async function getCurrentMonthPlan(userId: string): Promise<MonthlyPlan | null> {
  const supabase = await createClient()
  const monthKey = getMonthKey()

  const { data, error } = await supabase
    .from('monthly_plans')
    .select('*')
    .eq('user_id', userId)
    .eq('month_key', monthKey)
    .single() as { data: any, error: any }

  if (error || !data) return null
  return data
}

export async function upsertMonthlyPlan(
  userId: string,
  input: MonthlyPlanInput
): Promise<MonthlyPlan> {
  const supabase = await createClient()
  const monthKey = getMonthKey()
  const { flexible } = calcMonthlyPlan(
    input.income,
    input.mandatory,
    input.debt,
    input.safety_buffer
  )

  const { data, error } = await supabase
    .from('monthly_plans')
    .upsert({
      user_id: userId,
      month_key: monthKey,
      income: input.income,
      mandatory: input.mandatory,
      debt: input.debt,
      safety_buffer: input.safety_buffer,
      flexible_amount: flexible,
    } as any)
    .select()
    .single() as { data: any, error: any }

  if (error) {
    throw error
  }

  return data
}
