import { createClient } from '@/lib/supabase/server'
import { getMonthKey } from '@/lib/utils'

export type DashboardStats = {
  totalDelayedAmount: number
  totalRedirectedAmount: number
  delayedCount: number
  proceededCount: number
  redirectedCount: number
  savedThisMonth: number
  recentSessions: any[] // We can type this later if needed, but it's just for display
}

export async function getDashboardStats(userId: string): Promise<DashboardStats> {
  const supabase = await createClient()
  const monthKey = getMonthKey()

  // Ambil semua sesi (bisa dilimit misal 30 hari terakhir, tapi untuk MVP ambil semua)
  const { data: allSessions, error } = await supabase
    .from('pause_sessions')
    .select('amount, outcome, created_at, trigger_type')
    .eq('user_id', userId)
    .not('outcome', 'is', null) as { data: any[] | null, error: any }

  if (error || !allSessions) {
    return {
      totalDelayedAmount: 0,
      totalRedirectedAmount: 0,
      delayedCount: 0,
      proceededCount: 0,
      redirectedCount: 0,
      savedThisMonth: 0,
      recentSessions: [],
    }
  }

  let totalDelayedAmount = 0
  let totalRedirectedAmount = 0
  let delayedCount = 0
  let proceededCount = 0
  let redirectedCount = 0
  let savedThisMonth = 0

  const currentMonthPrefix = monthKey.substring(0, 7) // "YYYY-MM"

  allSessions.forEach((session) => {
    if (session.outcome === 'delayed') {
      delayedCount++
      totalDelayedAmount += session.amount
      if (session.created_at.startsWith(currentMonthPrefix)) {
        savedThisMonth += session.amount
      }
    } else if (session.outcome === 'redirected') {
      redirectedCount++
      totalRedirectedAmount += session.amount
      if (session.created_at.startsWith(currentMonthPrefix)) {
        savedThisMonth += session.amount
      }
    } else if (session.outcome === 'proceeded') {
      proceededCount++
    }
  })

  // Sort descending and take top 3
  const recentSessions = [...allSessions]
    .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    .slice(0, 3)

  return {
    totalDelayedAmount,
    totalRedirectedAmount,
    delayedCount,
    proceededCount,
    redirectedCount,
    savedThisMonth,
    recentSessions,
  }
}
