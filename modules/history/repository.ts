import { createClient } from '@/lib/supabase/server'
import { type PauseSession } from '@/modules/pause/types'
import { type ReflectionEntry } from '@/modules/reflection/types'

export type HistoryItem = PauseSession & {
  reflection: Pick<ReflectionEntry, 'reflection_code' | 'note'> | null
}

export async function getHistory(userId: string): Promise<HistoryItem[]> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const supabase = await createClient() as any

  // Ambil sesi yang sudah completed atau minimal punya outcome
  const { data, error } = await supabase
    .from('pause_sessions')
    .select(`
      *,
      reflection:reflection_entries(reflection_code, note)
    `)
    .eq('user_id', userId)
    .not('outcome', 'is', null)
    .order('created_at', { ascending: false }) as { data: any[] | null, error: any }

  if (error || !data) {
    console.error('Get history error:', error)
    return []
  }

  // Transform postgrest array return to single object
  return data.map((item) => ({
    ...item,
    reflection: item.reflection ? (item.reflection as any)[0] || null : null,
  })) as HistoryItem[]
}
