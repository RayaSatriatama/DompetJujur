import { type Tables } from '@/lib/supabase/database.types'

export type PauseSession = Tables<'pause_sessions'>

export type PauseState =
  | 'snapshot' // Baru dibuat, melihat kondisi keuangan
  | 'timer' // Sedang menunggu 90 detik
  | 'decision' // Waktu tunggu selesai, diminta mengambil keputusan
  | 'outcome' // Keputusan sudah diambil (completed)
