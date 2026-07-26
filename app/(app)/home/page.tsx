import { getAuthUser } from '../../../lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { getGreeting, getMonthKey } from '@/lib/utils'
import { formatRupiah } from '@/lib/formatters'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Shield, Wallet, LineChart, ChevronRight, Sparkles, Clock, Download } from 'lucide-react'
import { NotificationTrigger } from '@/components/notification-trigger'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await getAuthUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('nickname, primary_risk_window')
    .eq('id', user.id)
    .single() as { data: any }
  
  const monthKey = getMonthKey()
  const { data: monthlyPlan } = await supabase
    .from('monthly_plans')
    .select('*')
    .eq('user_id', user.id)
    .eq('month_key', monthKey)
    .maybeSingle() as { data: any }

  // Calculate stats for Ruang Uang & Jeda summary
  const { data: pauseSessions } = await supabase
    .from('pause_sessions')
    .select('id, amount, outcome')
    .eq('user_id', user.id)

  const totalPausesCount = pauseSessions?.length || 0
  const delayedSessions = pauseSessions?.filter((s: any) => s.outcome === 'delayed' || s.outcome === 'redirected') || []
  const totalDelayedCount = delayedSessions.length
  const totalDelayedAmount = delayedSessions.reduce((acc: number, s: any) => acc + (Number(s.amount) || 0), 0)

  // Compute flexible money room
  const income = Number(monthlyPlan?.income) || 6000000
  const mandatory = Number(monthlyPlan?.mandatory) || 3600000
  const debt = Number(monthlyPlan?.debt) || 800000
  const buffer = Number(monthlyPlan?.safety_buffer) || 0
  const flexibleRoom = Math.max(0, income - (mandatory + debt + buffer))

  return (
    <div className="flex flex-col flex-1 p-5 lg:p-12 pb-28 lg:pb-12 space-y-6 lg:space-y-8 animate-in fade-in duration-500 bg-[#F8FAF8] min-h-screen max-w-4xl mx-auto w-full">
      
      {/* Top App Bar (Header matching Poster) */}
      <header className="flex items-center justify-between pt-2">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-[#265C4B] flex items-center justify-center text-white shadow-sm">
            <Shield className="w-5 h-5" strokeWidth={2.5} />
          </div>
          <span className="text-xl font-extrabold text-[#16211D] tracking-tight">DompetJujur</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-[#E7F2EC] text-[#265C4B] rounded-full text-xs font-semibold border border-[#265C4B]/20">
            <Download className="w-3.5 h-3.5" />
            <span>Pasang aplikasi</span>
          </div>
          <NotificationTrigger riskWindowLabel={profile?.primary_risk_window} />
        </div>
      </header>

      {/* Greeting Banner */}
      <div className="space-y-1">
        <h2 className="text-2xl lg:text-3xl font-extrabold text-[#16211D] tracking-tight">
          {getGreeting()}, {profile?.nickname || 'Kawan'}.
        </h2>
        <p className="text-sm text-muted-foreground">
          Kamu tidak perlu menunggu sampai keputusan terjadi.
        </p>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6 pt-1">
        
        {/* 1. Main Action Card ("Jeda") */}
        <div className="relative overflow-hidden rounded-3xl bg-[#E7F2EC] border border-[#265C4B]/20 p-6 lg:p-8 flex flex-col justify-between shadow-sm group min-h-[220px]">
          
          {/* Botanical Leaf Branch Svg in Background matching Poster */}
          <div className="absolute right-2 bottom-1 pointer-events-none text-[#265C4B]/25">
            <svg className="w-28 h-32 lg:w-36 lg:h-40" viewBox="0 0 120 140" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M60 135C58 90 95 30 110 10" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>
              <path d="M60 110C40 105 25 85 30 65C45 65 60 85 60 110Z" fill="currentColor"/>
              <path d="M65 85C85 75 100 55 95 35C80 38 65 60 65 85Z" fill="currentColor"/>
              <path d="M55 60C38 52 28 35 32 18C48 20 56 38 55 60Z" fill="currentColor"/>
              <path d="M75 40C92 30 102 15 98 2C83 6 74 22 75 40Z" fill="currentColor"/>
            </svg>
          </div>

          <div className="space-y-2 z-10">
            <span className="text-xs font-semibold text-[#265C4B]/90 uppercase tracking-wider">Lagi ada dorongan?</span>
            <h3 className="text-2xl lg:text-3xl font-extrabold text-[#16211D] leading-tight">
              Buat jarak<br />90 detik.
            </h3>
          </div>

          <div className="pt-6 z-10">
            <Link href="/pause/new" className="inline-block w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-[#265C4B] hover:bg-[#265C4B]/90 text-white rounded-xl text-sm font-bold px-6 py-3 shadow-md transition-all active:scale-98 flex items-center justify-center gap-2">
                <span>Saya lagi kepikiran</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* 2. Ruang Uang Bulan Ini Card */}
        <div className="rounded-3xl bg-white border border-[#D6DBD7] p-6 lg:p-8 flex flex-col justify-between shadow-soft-card">
          <div className="flex items-start justify-between">
            <div>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Ruang Uang Bulan Ini</span>
              <h3 className="text-3xl lg:text-4xl font-extrabold text-[#16211D] tabular-nums mt-1 tracking-tight">
                {formatRupiah(flexibleRoom)}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Setelah kebutuhan wajib & cicilan</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-muted/40 flex items-center justify-center text-[#265C4B]">
              <Wallet className="w-5 h-5" />
            </div>
          </div>

          {/* Impact Stats Pill */}
          <div className="pt-4 border-t border-border/40 mt-4">
            <div className="inline-flex items-center gap-2 bg-[#E7F2EC] text-[#265C4B] text-xs font-semibold px-3.5 py-2 rounded-full border border-[#265C4B]/20 max-w-full truncate">
              <Clock className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">
                {totalDelayedCount} jeda • {formatRupiah(totalDelayedAmount)} nominal ditunda
              </span>
            </div>
          </div>
        </div>

        {/* 3. Dampak Jeda Card */}
        <Link 
          href="/dashboard"
          className="rounded-3xl bg-white border border-[#D6DBD7] p-5 lg:p-6 flex items-center justify-between shadow-sm hover:shadow-soft-card transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-muted/40 flex items-center justify-center text-primary shrink-0 group-hover:bg-[#E7F2EC] transition-colors">
              <LineChart className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-base font-bold text-[#16211D]">Dampak jeda bulan ini</h4>
              <p className="text-xs text-muted-foreground mt-0.5">Lihat pengaruh keputusan kecil ({totalPausesCount} total sesi)</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
        </Link>

        {/* 4. Teman AI Jujur Card */}
        <Link 
          href="/chat"
          className="rounded-3xl bg-[#E7F2EC] border border-[#265C4B]/20 p-5 lg:p-6 flex items-center justify-between shadow-sm hover:shadow-soft-card transition-all group"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-primary shrink-0 shadow-sm">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h4 className="text-base font-bold text-[#16211D]">Teman AI Jujur</h4>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-[#265C4B] text-white px-2 py-0.5 rounded-full">AI Support</span>
              </div>
              <p className="text-xs text-[#265C4B]/80 mt-0.5">Diskusi privat & tanpa menghakimi</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-[#265C4B] group-hover:translate-x-1 transition-all" />
        </Link>

      </div>
    </div>
  )
}
