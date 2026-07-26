import { getAuthUser } from '../../../lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { getGreeting, getMonthKey } from '@/lib/utils'
import { formatRupiah } from '@/lib/formatters'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Shield, Wallet, LineChart, ChevronRight, Sparkles, Clock } from 'lucide-react'
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
  
  const monthKey = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`
  const { data: monthlyPlan } = await supabase
    .from('monthly_plans')
    .select('*')
    .eq('user_id', user.id)
    .eq('month_key', monthKey)
    .single() as { data: any }

  // If no monthly plan, redirect to onboarding
  if (!monthlyPlan) {
    redirect('/onboarding')
  }

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
  const income = Number(monthlyPlan.income) || 0
  const mandatory = Number(monthlyPlan.mandatory) || 0
  const debt = Number(monthlyPlan.debt) || 0
  const buffer = Number(monthlyPlan.safety_buffer) || 0
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
        <NotificationTrigger riskWindowLabel={profile?.primary_risk_window} />
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
        <div className="relative overflow-hidden rounded-3xl bg-[#E7F2EC] border border-[#265C4B]/20 p-6 lg:p-8 flex flex-col justify-between shadow-sm group">
          
          {/* Subtle Decorative Leaf Svg in Background */}
          <div className="absolute right-0 bottom-0 opacity-15 pointer-events-none translate-x-4 translate-y-4">
            <svg width="180" height="180" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M50 0C50 27.6142 27.6142 50 0 50C27.6142 50 50 72.3858 50 100C50 72.3858 72.3858 50 100 50C72.3858 50 50 27.6142 50 0Z" fill="#265C4B"/>
            </svg>
          </div>

          <div className="space-y-2 z-10">
            <span className="text-xs font-semibold text-[#265C4B]/80 uppercase tracking-wider">Lagi ada dorongan?</span>
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
