import { z } from 'zod'

export const profileSchema = z.object({
  nickname: z.string().max(60, 'Nama terlalu panjang').optional().nullable(),
  payday_day: z.number().int().min(1, 'Minimal tanggal 1').max(31, 'Maksimal tanggal 31').optional().nullable(),
  primary_risk_window: z
    .enum(['after_work', 'late_night', 'after_payday', 'after_loss', 'paylater_available', 'other'])
    .optional()
    .nullable(),
})

export type ProfileInput = z.infer<typeof profileSchema>
