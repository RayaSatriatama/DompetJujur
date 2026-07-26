import { createClient } from '@/lib/supabase/server'
import { getHistory } from '@/modules/history/repository'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, User, Sparkles, Clock, Info, Lock, Trash2, MoreHorizontal, ChevronRight } from 'lucide-react'
import { formatRupiah, formatTriggerLabel } from '@/lib/formatters'
import { Button } from '@/components/ui/button'

function formatFullDate(dateString: string) {
  const d = new Date(dateString)
  const day = d.getDate()
  const month = d.toLocaleString('id-ID', { month: 'short' })
  const year = d.getFullYear()
  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')
  return `${day} ${month} ${year} - ${hours}:${minutes}`
}

function formatMockupDate(dateString: string) {
  const d = new Date(dateString)
  const day = d.getDate()
  const month = d.toLocaleString('id-ID', { month: 'short' })
  const hours = d.getHours().toString().padStart(2, '0')
  const minutes = d.getMinutes().toString().padStart(2, '0')
  return `${day} ${month} · ${hours}:${minutes}`
}

export default async function HistoryDetailPage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ filter?: string }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { id } = params
  const filter = searchParams.filter || 'all';

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Fetch session detail
  const { data: session } = await supabase
    .from('pause_sessions')
    .select(`
      *,
      reflection_entries (
        reflection_code
      )
    `)
    .eq('id', id)
    .single() as any

  if (!session) redirect('/history')

  // Fetch all history for the left list
  const history = await getHistory(user.id)
  
  // Calculate stats for left list
  const totalSessions = history.length
  const delayedSessions = history.filter(h => h.outcome === 'delayed' || h.outcome === 'redirected')
  const totalDelayedCount = delayedSessions.length
  const totalDelayedAmount = delayedSessions.reduce((acc, curr) => acc + Number(curr.amount), 0)

  // Filter items for left list
  const filteredHistory = history.filter(item => {
    if (filter === 'delayed') return item.outcome === 'delayed'
    if (filter === 'proceeded') return item.outcome === 'proceeded'
    if (filter === 'redirected') return item.outcome === 'redirected'
    return true
  })

  const isDelayed = session.outcome === 'delayed' || session.outcome === 'redirected'
  const isProceeded = session.outcome === 'proceeded'
  
  // Format reflection
  let reflectionText = 'Tidak ada catatan'
  const reflection = session.reflection_entries?.[0]
  if (reflection) {
    const code = reflection.reflection_code
    const mapping: Record<string, string> = {
      'calmer': 'Lebih tenang',
      'lighter': 'Lebih ringan',
      'same': 'Biasa saja',
      'heavy': 'Masih berat',
      'urge_too_strong': 'Dorongan terlalu kuat',
      'stress': 'Sedang stres',
      'chasing_loss': 'Merasa harus balik modal',
      'avoid_thinking': 'Tidak ingin berpikir panjang',
      'skipped': 'Dilewati'
    }
    reflectionText = mapping[code] || code
  }

  return (
    <div className="flex flex-col lg:flex-row lg:gap-8 flex-1 min-h-screen bg-[#F9FAFB] lg:p-8 w-full max-w-6xl mx-auto">
      
      {/* Left Column (List) - Hidden on Mobile */}
      <div className="hidden lg:flex flex-col w-1/2 flex-none pb-0 animate-in fade-in space-y-6">
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
              const isItemDelayed = item.outcome === 'delayed' || item.outcome === 'redirected'
              const isItemProceeded = item.outcome === 'proceeded'
              const isActive = item.id === id
              
              return (
                <Link 
                  key={item.id} 
                  href={`/history/${item.id}?filter=${filter}`}
                  className={`flex items-center justify-between p-4 rounded-2xl border shadow-sm transition-shadow cursor-pointer group ${
                    isActive ? 'bg-primary/5 border-primary/30 shadow-soft-card' : 'bg-white border-border/40 hover:shadow-soft-card'
                  }`}
                >
                  <div className="flex flex-col space-y-1">
                    <span className={`text-lg font-bold tracking-tight ${isActive ? 'text-primary' : 'text-foreground'}`}>
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
                    {isItemDelayed && (
                      <div className="px-3 py-1 rounded-full bg-[#E7F2EC] text-[#265C4B] text-xs font-semibold">
                        Ditunda
                      </div>
                    )}
                    {isItemProceeded && (
                      <div className="px-3 py-1 rounded-full bg-blue-50 text-blue-600 text-xs font-semibold">
                        Tetap lanjut
                      </div>
                    )}
                    {!item.outcome && (
                      <div className="px-3 py-1 rounded-full bg-muted text-muted-foreground text-xs font-semibold">
                        Terbengkalai
                      </div>
                    )}
                    <ChevronRight className={`w-5 h-5 transition-colors ${isActive ? 'text-primary' : 'text-muted-foreground/40 group-hover:text-primary'}`} />
                  </div>
                </Link>
              )
            })
          )}
        </div>
      </div>

      {/* Right Column (Detail) - Full width on mobile */}
      <div className="flex flex-col flex-1 lg:flex-none p-6 lg:p-10 space-y-8 bg-white lg:rounded-3xl lg:border lg:border-border/50 lg:shadow-soft-card my-0 lg:my-4 lg:w-1/2">
        <header className="relative flex items-center justify-between pt-2">
          <div className="flex items-center">
            <Link href="/history" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors lg:hidden">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
            <h1 className="text-xl font-bold tracking-tight ml-2 lg:ml-0">Detail Jeda</h1>
          </div>
          <button className="p-2 -mr-2 rounded-full hover:bg-muted transition-colors">
            <MoreHorizontal className="w-5 h-5 text-foreground" />
          </button>
        </header>

        <div className="flex flex-col items-center justify-center space-y-4 pt-4">
          <h2 className="text-4xl font-bold tracking-tight text-foreground">
            {formatRupiah(session.amount)}
          </h2>
          {isDelayed && (
            <div className="px-4 py-1.5 rounded-full bg-[#E7F2EC] text-[#265C4B] text-sm font-semibold">
              Ditunda
            </div>
          )}
          {isProceeded && (
            <div className="px-4 py-1.5 rounded-full bg-blue-50 text-blue-600 text-sm font-semibold">
              Tetap lanjut
            </div>
          )}
          {!session.outcome && (
            <div className="px-4 py-1.5 rounded-full bg-muted text-muted-foreground text-sm font-semibold">
              Terbengkalai
            </div>
          )}
        </div>

        <div className="border border-border/60 rounded-2xl bg-white shadow-sm divide-y divide-border/60">
          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors rounded-t-2xl">
            <div className="flex items-center gap-4 text-foreground">
              <User className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-sm">Trigger</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">{formatTriggerLabel(session.trigger_type)}</span>
              <ArrowLeft className="w-4 h-4 text-muted-foreground/50 rotate-180" />
            </div>
          </div>
          
          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-4 text-foreground">
              <Sparkles className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-sm">Dorongan awal</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">{session.initial_urge_level} dari 5</span>
              <ArrowLeft className="w-4 h-4 text-muted-foreground/50 rotate-180" />
            </div>
          </div>

          <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors">
            <div className="flex items-center gap-4 text-foreground">
              <Clock className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium text-sm">Waktu</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-muted-foreground">{formatFullDate(session.created_at)}</span>
              <ArrowLeft className="w-4 h-4 text-muted-foreground/50 rotate-180" />
            </div>
          </div>

          {session.outcome && (
            <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-muted/30 transition-colors rounded-b-2xl">
              <div className="flex items-center gap-4 text-foreground">
                <Info className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-sm">Setelah jeda</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-muted-foreground">{reflectionText}</span>
                <ArrowLeft className="w-4 h-4 text-muted-foreground/50 rotate-180" />
              </div>
            </div>
          )}
        </div>

        <div className="flex items-center justify-center gap-2 text-muted-foreground/70 pb-4 pt-2">
          <Lock className="w-4 h-4" />
          <span className="text-xs font-medium">Catatan ini hanya untukmu.</span>
        </div>

        <div className="mt-auto pb-8">
          <form action={async () => {
            'use server'
            const sb = await createClient()
            await sb.from('pause_sessions').delete().eq('id', session.id)
            redirect('/history')
          }}>
            <Button 
              type="submit"
              variant="outline" 
              className="w-full h-14 rounded-xl text-lg font-bold border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-5 h-5 mr-2" />
              Hapus catatan
            </Button>
          </form>
        </div>
      </div>
    </div>
  )
}
