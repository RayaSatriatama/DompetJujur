import { z } from 'zod'

export const financialBaselineSchema = z.object({
  monthly_income: z.number().int().min(0, 'Pendapatan tidak boleh negatif'),
  mandatory_expenses: z.number().int().min(0, 'Pengeluaran wajib tidak boleh negatif'),
  debt_payments: z.number().int().min(0, 'Cicilan tidak boleh negatif'),
  income_variable: z.boolean().default(false),
})

export type FinancialBaselineInput = z.infer<typeof financialBaselineSchema>
