'use server'

import { requireAuth } from '@/modules/auth/guard'
import { financialBaselineSchema, type FinancialBaselineInput } from './schema'
import { insertBaseline } from './repository'
import { err, ok, type Result, isErr } from '@/lib/result'
import { APP_ERRORS, type AppErrorCode } from '@/lib/errors'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function submitFinancialBaselineAction(
  input: FinancialBaselineInput
): Promise<Result<void, AppErrorCode>> {
  const authResult = await requireAuth()
  if (isErr(authResult)) return authResult

  const parsed = financialBaselineSchema.safeParse(input)
  if (!parsed.success) {
    return err(APP_ERRORS.VALIDATION_ERROR)
  }

  try {
    await insertBaseline(authResult.data.id, parsed.data)
    revalidatePath('/home')
    revalidatePath('/plan')
    return ok(null as any)
  } catch (error) {
    console.error('Insert financial baseline error:', error)
    return err(APP_ERRORS.DATABASE_ERROR)
  }
}
