import { z } from 'zod'

export const monthlyPlanSchema = z.object({
  income: z.number().int().min(0, 'Pendapatan tidak boleh negatif'),
  mandatory: z.number().int().min(0, 'Kebutuhan wajib tidak boleh negatif'),
  debt: z.number().int().min(0, 'Cicilan tidak boleh negatif'),
  safety_buffer: z.number().int().min(0, 'Buffer aman tidak boleh negatif').default(0),
})

export type MonthlyPlanInput = z.infer<typeof monthlyPlanSchema>
