import { getAuthUser } from '../../../lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { getHistory } from '@/modules/history/repository'
import { formatRupiah, formatTriggerLabel } from '@/lib/formatters'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Moon, BarChart3, TrendingUp, Calendar, AlertCircle } from 'lucide-react'

// --- E2E Mock Helper ---
function generateMockHistory(scenario: string) {
  const now = new Date()
  const currentMonth = now.toISOString()
  
  const createSession = (outcome: 'delayed' | 'proceeded', amount: number, trigger: string, hour = 14) => {
    const d = new Date(now)
    d.setHours(hour, 0, 0, 0)
    return {
      id: Math.random().toString(),
      user_id: 'e2e',
      amount: amount,
      outcome: outcome,
      trigger_type: trigger,
      delay_duration_minutes: outcome === 'delayed' ? 60 : 0,
      created_at: d.toISOString(),
    }
  }

  if (scenario === 'empty') return []
  
  if (scenario === 'dash-002') {
    // 8 current-month sessions, 5 delayed, specific nominals
    return [
      createSession('delayed', 300000, 'boredom_escape'),
      createSession('delayed', 300000, 'boredom_escape'),
      createSession('delayed', 300000, 'boredom_escape'), 
      createSession('delayed', 300000, 'stress'),
      createSession('delayed', 300000, 'stress'), // sum of delayed: 1.5m
      createSession('proceeded', 200000, 'stress'),
      createSession('proceeded', 200000, 'payday'),
      createSession('proceeded', 200000, 'other'),
    ]
  }

  if (scenario === 'dash-006') {
    // Top trigger is stress
    return [
      createSession('delayed', 100000, 'stress'),
      createSession('delayed', 100000, 'stress'),
      createSession('delayed', 100000, 'stress'),
      createSession('delayed', 100000, 'boredom'),
      createSession('delayed', 100000, 'boredom'),
    ]
  }
  
  if (scenario === 'dash-007') {
    // Tie breaker: 'stress' and 'boredom' both have 2. 
    return [
      createSession('delayed', 100000, 'stress'),
      createSession('delayed', 100000, 'stress'),
      createSession('delayed', 100000, 'boredom'),
      createSession('delayed', 100000, 'boredom'),
    ]
  }
  
  if (scenario === 'dash-011') {
    // Month boundary: 2 this month, 2 last month
    const s1 = createSession('delayed', 100000, 'stress')
    const s2 = createSession('delayed', 100000, 'stress')
    const s3 = createSession('delayed', 100000, 'stress')
    const s4 = createSession('delayed', 100000, 'stress')
    
    const lastMonth = new Date(now)
    lastMonth.setMonth(lastMonth.getMonth() - 1)
    s3.created_at = lastMonth.toISOString()
    s4.created_at = lastMonth.toISOString()
    
    return [s1, s2, s3, s4]
  }
  
  if (scenario === 'dash-008') {
    // 8 sessions, 4 late night (> 22:00)
    return [
      createSession('delayed', 100000, 'stress', 23),
      createSession('delayed', 100000, 'stress', 23),
      createSession('delayed', 100000, 'stress', 23),
      createSession('delayed', 100000, 'stress', 23),
      createSession('delayed', 100000, 'stress', 10),
      createSession('delayed', 100000, 'stress', 14),
      createSession('delayed', 100000, 'stress', 15),
      createSession('delayed', 100000, 'stress', 16),
    ]
  }

  return []
}
// -----------------------

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await getAuthUser()
  const cookieStore = await import('next/headers').then(m => m.cookies())
  const isE2E = process.env.NODE_ENV === 'development' && cookieStore.get('e2e-bypass-auth')?.value === 'true'

  if (!user && !isE2E) redirect('/login')

  const userId = user?.id || 'e2e-mock-user-id'
  let history = await getHistory(userId)
  
  if (isE2E) {
    const scenario = cookieStore.get('e2e-scenario')?.value
    if (scenario) {
      history = generateMockHistory(scenario)
    }
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col flex-1 p-6 lg:p-8 space-y-6 animate-in fade-in bg-[#F9FAFB] lg:bg-white min-h-screen w-full max-w-5xl mx-auto">
        <header className="relative flex items-center justify-center lg:justify-start pt-2 lg:pt-4 mb-4">
          <Link href="/history" className="absolute left-0 lg:static p-2 -ml-2 lg:ml-0 lg:mr-4 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Pola Jeda</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center py-16 px-4 text-center border border-border/50 lg:rounded-3xl lg:shadow-sm bg-white">
          <div className="w-32 h-32 mb-6 text-muted-foreground/20">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 3v18h18"/>
              <path d="m19 9-5 5-4-4-3 3"/>
            </svg>
          </div>
          <h2 className="text-xl font-bold tracking-tight mb-2">Belum cukup data untuk melihat pola.</h2>
          <p className="text-sm text-muted-foreground mb-8 max-w-[250px]">Kamu tetap bisa memakai Jeda kapan saja.</p>
          <Link href="/home" className="w-full max-w-xs">
            <div className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors text-center shadow-sm">
              Kembali ke beranda
            </div>
          </Link>
        </div>
      </div>
    )
  }

  // Filter by current month
  const now = new Date()
  const currentMonthHistory = history.filter(h => {
    const d = new Date(h.created_at)
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  })

  // Calculate stats for current month
  const totalSessions = currentMonthHistory.length
  const delayedSessions = currentMonthHistory.filter(h => h.outcome === 'delayed' || h.outcome === 'redirected')
  const totalDelayedCount = delayedSessions.length
  const totalDelayedAmount = delayedSessions.reduce((acc, curr) => acc + Number(curr.amount), 0)

  // Most frequent trigger
  const triggerCounts = currentMonthHistory.reduce((acc, curr) => {
    if (curr.trigger_type) {
      acc[curr.trigger_type] = (acc[curr.trigger_type] || 0) + 1
    }
    return acc
  }, {} as Record<string, number>)
  
  let mostFrequentTrigger = 'Belum ada'
  let maxTriggerCount = 0
  for (const [trigger, count] of Object.entries(triggerCounts)) {
    if (count > maxTriggerCount) {
      mostFrequentTrigger = formatTriggerLabel(trigger)
      maxTriggerCount = count
    }
  }

  // Calculate late night sessions
  const lateNightSessions = currentMonthHistory.filter(h => {
    const hour = new Date(h.created_at).getHours()
    return hour >= 22 || hour < 4 // 10 PM to 4 AM
  }).length

  return (
    <div className="flex flex-col flex-1 p-6 lg:p-8 pb-24 lg:pb-8 space-y-6 lg:space-y-8 animate-in fade-in bg-[#F9FAFB] lg:bg-white min-h-screen w-full max-w-5xl mx-auto">
      <header className="relative flex items-center justify-center lg:justify-start pt-2 lg:pt-4 mb-2 lg:mb-4">
        <Link href="/history" className="absolute left-0 lg:static p-2 -ml-2 lg:ml-0 lg:mr-4 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <div>
          <h1 className="text-xl lg:text-3xl font-bold tracking-tight">Pola Jeda</h1>
          <p className="text-sm text-muted-foreground hidden lg:block mt-1">Pantau perkembangan dan kebiasaan jedamu.</p>
        </div>
      </header>

      {/* 4 Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        <div className="flex flex-col p-4 lg:p-6 rounded-2xl border border-border/50 shadow-soft-card bg-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 lg:opacity-10 group-hover:scale-110 transition-transform">
            <Calendar className="w-12 h-12" />
          </div>
          <span className="text-[11px] lg:text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 z-10">Jeda bulan ini</span>
          <span className="text-2xl lg:text-4xl font-bold text-foreground z-10">{totalSessions}</span>
        </div>
        <div className="flex flex-col p-4 lg:p-6 rounded-2xl border border-border/50 shadow-soft-card bg-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 lg:opacity-10 group-hover:scale-110 transition-transform">
            <TrendingUp className="w-12 h-12 text-primary" />
          </div>
          <span className="text-[11px] lg:text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 z-10">Berhasil ditunda</span>
          <span className="text-2xl lg:text-4xl font-bold text-foreground z-10">{totalDelayedCount}</span>
        </div>
        <div className="flex flex-col p-4 lg:p-6 rounded-2xl border border-border/50 shadow-soft-card bg-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 lg:opacity-10 group-hover:scale-110 transition-transform">
            <BarChart3 className="w-12 h-12 text-blue-500" />
          </div>
          <span className="text-[11px] lg:text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 z-10">Nominal ditunda</span>
          <span className="text-lg lg:text-2xl font-bold text-foreground truncate w-full z-10 mt-auto">
            {formatRupiah(totalDelayedAmount).replace('Rp', 'Rp ')}
          </span>
        </div>
        <div className="flex flex-col p-4 lg:p-6 rounded-2xl border border-border/50 shadow-soft-card bg-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-5 lg:opacity-10 group-hover:scale-110 transition-transform">
            <AlertCircle className="w-12 h-12 text-orange-500" />
          </div>
          <span className="text-[11px] lg:text-xs text-muted-foreground font-semibold uppercase tracking-wider mb-2 z-10">Trigger dominan</span>
          <span className="text-sm lg:text-lg font-bold text-foreground line-clamp-2 z-10 mt-auto leading-tight">{mostFrequentTrigger}</span>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6 pt-2">
        
        {/* Chart */}
        <div className="flex-1 flex flex-col border border-border/50 rounded-2xl p-5 lg:p-8 shadow-soft-card bg-white">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="text-base lg:text-lg font-bold text-foreground tracking-tight">Jeda per hari</h3>
              <p className="text-xs lg:text-sm text-muted-foreground mt-1">Aktivitas dalam 7 hari terakhir</p>
            </div>
          </div>
          
          <div className="flex items-end justify-between h-40 lg:h-64 w-full px-2 lg:px-4 mt-auto">
            {/* Chart placeholder */}
            <div className="flex h-full w-full items-end justify-between gap-2 lg:gap-4 px-2">
              {[...Array(7)].map((_, i) => (
                <div key={i} className="flex flex-col items-center gap-2 group w-full h-full justify-end">
                  <div 
                    className={`w-full max-w-[40px] rounded-t-md transition-all duration-500 ease-out ${i === 6 ? 'bg-primary cursor-pointer h-1/2' : 'bg-primary/20 h-4'}`}
                  ></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Insight */}
        <div className="lg:w-1/3 flex flex-col gap-4 lg:gap-6">
          <div className="flex flex-row lg:flex-col items-center lg:items-start gap-4 p-4 lg:p-8 rounded-2xl bg-[#E7F2EC] border border-[#265C4B]/20">
            <div className="p-3 lg:p-4 bg-white rounded-2xl shrink-0 shadow-sm">
              <Moon className="w-6 h-6 lg:w-8 lg:h-8 text-[#265C4B]" />
            </div>
            <div className="flex flex-col">
              <h4 className="hidden lg:block text-lg font-bold text-[#265C4B] mb-2">Insight Mingguan</h4>
              <p className="text-sm lg:text-base text-[#265C4B] font-medium leading-relaxed">
                {lateNightSessions > 0 
                  ? `${lateNightSessions} dari ${totalSessions} sesi terjadi di waktu rawan larut malam (di atas jam 22:00). Cobalah untuk menjauhi aplikasi e-commerce pada jam tersebut.`
                  : `Pola belanjamu cukup baik bulan ini. Pertahankan!`
                }
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
