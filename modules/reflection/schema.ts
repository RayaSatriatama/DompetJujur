import { z } from 'zod'

export const reflectionSchema = z.object({
  reflectionCode: z.enum([
    'calmer',
    'same',
    'stronger',
    'urge_too_strong',
    'stress',
    'chasing_loss',
    'avoid_thinking',
    'skipped',
  ]),
  note: z.string().max(240, 'Catatan terlalu panjang (maks 240 karakter)').optional(),
})

export type ReflectionInput = z.infer<typeof reflectionSchema>
