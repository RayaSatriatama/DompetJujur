import { z } from 'zod'

export const createPauseSchema = z.object({
  amount: z.number().int().min(1, 'Masukkan nominal lebih dari Rp0.'),
  triggerType: z.enum([
    'stress',
    'payday',
    'chasing_loss',
    'boredom_escape',
    'paylater_limit',
    'other',
  ]),
  urgeBefore: z.number().int().min(1).max(5).optional(),
  isDemo: z.boolean().default(false),
})

export type CreatePauseInput = z.infer<typeof createPauseSchema>

export const completePauseSchema = z.object({
  outcome: z.enum(['delayed', 'proceeded', 'redirected']),
})

export type CompletePauseInput = z.infer<typeof completePauseSchema>
