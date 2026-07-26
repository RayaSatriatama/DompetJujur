'use server'

import { requireAuth } from '@/modules/auth/guard'
import { monthlyPlanSchema, type MonthlyPlanInput } from './schema'
import { upsertMonthlyPlan } from './repository'
import { err, ok, type Result, isErr } from '@/lib/result'
import { APP_ERRORS, type AppErrorCode } from '@/lib/errors'
import { revalidatePath } from 'next/cache'

export async function saveMonthlyPlanAction(
  input: MonthlyPlanInput
): Promise<Result<void, AppErrorCode>> {
  const authResult = await requireAuth()
  if (isErr(authResult)) return authResult

  const parsed = monthlyPlanSchema.safeParse(input)
  if (!parsed.success) {
    return err(APP_ERRORS.VALIDATION_ERROR)
  }

  try {
    await upsertMonthlyPlan(authResult.data.id, parsed.data)
    revalidatePath('/plan')
    revalidatePath('/home')
    return ok(null as any)
  } catch (error) {
    console.error('Save monthly plan error:', error)
    return err(APP_ERRORS.DATABASE_ERROR)
  }
}
