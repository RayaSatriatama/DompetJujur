import { getAuthUser } from '../../../lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { getHistory } from '@/modules/history/repository'
import { formatRupiah, formatTriggerLabel } from '@/lib/formatters'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ChevronRight, FileText } from 'lucide-react'

// Helper to format date like "24 Jul · 23:14"
function formatMockupDate(dateString: string) {
  const d = new Date(dateString)
  const day = d.getDate()
  const month = d.toLocaleString('id-ID', { month: 'short' })
  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')
  return `${day} ${month} · ${hours}:${minutes}`
}

export default async function HistoryPage(props: { searchParams: Promise<{ filter?: string }> }) {
  const searchParams = await props.searchParams;
  const filter = searchParams.filter || 'all';
  const supabase = await createClient()
  const { data: { user } } = await getAuthUser()
  if (!user) redirect('/login')

  const history = await getHistory(user.id)
  
  // Calculate stats
  const totalSessions = history.length
  const delayedSessions = history.filter(h => h.outcome === 'delayed' || h.outcome === 'redirected')
  const totalDelayedCount = delayedSessions.length
  const totalDelayedAmount = delayedSessions.reduce((acc, curr) => acc + Number(curr.amount), 0)

  // Filter items
  const filteredHistory = history.filter(item => {
    if (filter === 'delayed') return item.outcome === 'delayed'
    if (filter === 'proceeded') return item.outcome === 'proceeded'
    if (filter === 'redirected') return item.outcome === 'redirected'
    return true
  })

  return (
    <div className="flex flex-col lg:flex-row lg:gap-8 flex-1 min-h-screen bg-[#F9FAFB] lg:p-8 w-full max-w-6xl mx-auto">
      
      {/* Left Column (List) */}
      <div className="flex flex-col flex-1 lg:w-1/2 lg:flex-none p-6 lg:p-0 bg-white lg:bg-transparent pb-24 lg:pb-0 animate-in fade-in space-y-6">
        <header className="pt-2 lg:pt-4">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">Riwayat Jeda</h1>
        </header>

        {/* 3 Stat Boxes */}
        <div className="grid grid-cols-3 gap-3">
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl border border-border/50 shadow-soft-card bg-white">
            <span className="text-2xl font-bold">{totalSessions}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mt-1">sesi</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl border border-border/50 shadow-soft-card bg-white">
            <span className="text-2xl font-bold">{totalDelayedCount}</span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mt-1">ditunda</span>
          </div>
          <div className="flex flex-col items-center justify-center p-3 rounded-2xl border border-border/50 shadow-soft-card bg-white">
            <span className="text-sm font-bold truncate w-full text-center px-1">
              {formatRupiah(totalDelayedAmount).replace('Rp', 'Rp ')}
            </span>
            <span className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mt-1">nominal ditunda</span>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <Link 
            href="/history?filter=all" 
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'all' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'border border-border/60 text-muted-foreground hover:bg-muted/50 bg-white'
            }`}
          >
            Semua
          </Link>
          <Link 
            href="/history?filter=delayed" 
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'delayed' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'border border-border/60 text-muted-foreground hover:bg-muted/50 bg-white'
            }`}
          >
            Ditunda
          </Link>
          <Link 
            href="/history?filter=proceeded" 
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'proceeded' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'border border-border/60 text-muted-foreground hover:bg-muted/50 bg-white'
            }`}
          >
            Tetap lanjut
          </Link>
          <Link 
            href="/history?filter=redirected" 
            className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors whitespace-nowrap ${
              filter === 'redirected' 
                ? 'bg-primary text-primary-foreground shadow-sm' 
                : 'border border-border/60 text-muted-foreground hover:bg-muted/50 bg-white'
            }`}
          >
            Alihkan fokus
          </Link>
        </div>

        {/* History List */}
        <div className="space-y-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-3xl border border-border/50 lg:bg-transparent lg:border-none">
              <div className="w-24 h-24 mb-6 text-muted-foreground/30">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <h2 className="text-xl font-bold tracking-tight mb-2">Belum ada riwayat.</h2>
              <p className="text-sm text-muted-foreground mb-8">Sesi Jeda pertamamu akan muncul di sini.</p>
              <Link href="/pause/new" className="w-full">
                <div className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 transition-colors text-center shadow-sm">
                  Mulai Jeda
                </div>
              </Link>
            </div>
          ) : filteredHistory.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm bg-white rounded-3xl border border-border/50 lg:bg-transparent lg:border-none">
              Tidak ada riwayat di kategori ini.
            </div>
          ) : (
            filteredHistory.map((item) => {
              const isDelayed = item.outcome === 'delayed' || item.outcome === 'redirected'
              const isProceeded = item.outcome === 'proceeded'
              
              return (
                <Link 
                  key={item.id} 
                  href={`/history/${item.id}`}
                  className="flex items-center justify-between p-4 rounded-2xl bg-white border border-border/40 shadow-sm hover:shadow-soft-card transition-shadow cursor-pointer group"
                >
                  <div className="flex flex-col space-y-1">
                    <span className="text-lg font-bold text-foreground tracking-tight">
                      {formatRupiah(item.amount)}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {formatTriggerLabel(item.trigger_type)}
                    </span>
                    <span className="text-[11px] text-muted-foreground/70 font-medium">
                      {formatMockupDate(item.created_at)}
                    </span>
                  </div>

                  <div className="flex items-center gap-3">
                    {isDelayed && (
                      <div className="px-3 py-1 rounded-full bg-[#E7F2EC] text-[#265C4B] text-xs font-semibold">
                        Ditunda
                      </div>
                    )}
                    {isProceeded && (
                      <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                        Tetap lanjut
                      </div>
                    )}
                    {!item.outcome && (
                      <div className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
                        Terbengkalai
                      </div>
                    )}
                    <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>

      {/* Right Column (Placeholder for Desktop) */}
      <div className="hidden lg:flex flex-col flex-1 items-center justify-center bg-white rounded-3xl border border-border/50 shadow-soft-card my-4 sticky top-8 h-[calc(100vh-4rem)]">
        <div className="text-center space-y-4 max-w-xs px-4">
          <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center mx-auto mb-2">
            <FileText className="w-10 h-10 text-primary/40" strokeWidth={1.5} />
          </div>
          <h3 className="font-bold text-xl text-foreground tracking-tight">Pilih catatan riwayat</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Klik salah satu catatan di sebelah kiri untuk melihat detail sesi Jeda kamu.
          </p>
        </div>
      </div>
      
    </div>
  )
}
