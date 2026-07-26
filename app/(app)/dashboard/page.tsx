import { createClient } from '@/lib/supabase/server'
import { getHistory } from '@/modules/history/repository'
import { formatRupiah, formatTriggerLabel } from '@/lib/formatters'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Moon, BarChart3, TrendingUp, Calendar, AlertCircle } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const history = await getHistory(user.id)

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

  // Calculate stats
  const totalSessions = history.length
  const delayedSessions = history.filter(h => h.outcome === 'delayed' || h.outcome === 'redirected')
  const totalDelayedCount = delayedSessions.length
  const totalDelayedAmount = delayedSessions.reduce((acc, curr) => acc + Number(curr.amount), 0)

  // Most frequent trigger
  const triggerCounts = history.reduce((acc, curr) => {
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
            {/* Mock Bar Chart */}
            {[
              { day: 'Sen', val: 0 },
              { day: 'Sel', val: 1 },
              { day: 'Rab', val: 2 },
              { day: 'Kam', val: 1 },
              { day: 'Jum', val: 2 },
              { day: 'Sab', val: 1 },
              { day: 'Min', val: 1 }
            ].map((item, i) => (
              <div key={i} className="flex flex-col items-center gap-2 group w-full">
                <span className="text-xs font-bold text-foreground opacity-0 group-hover:opacity-100 transition-opacity">
                  {item.val > 0 ? item.val : ''}
                </span>
                <div 
                  className={`w-8 lg:w-16 rounded-t-md transition-all duration-500 ease-out ${item.val > 0 ? 'bg-primary/80 group-hover:bg-primary cursor-pointer' : 'bg-transparent'}`} 
                  style={{ height: item.val > 0 ? `${item.val * (100 / 3)}%` : '4px' }}
                ></div>
                <span className="text-[10px] lg:text-sm font-medium text-muted-foreground mt-1">{item.day}</span>
              </div>
            ))}
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
                {maxTriggerCount} dari {totalSessions} sesi terjadi di waktu rawanmu. Cobalah untuk menjauhi aplikasi e-commerce pada jam tersebut.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
