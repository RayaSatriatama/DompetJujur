import { getAuthUser } from '../../../lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { getMonthKey, getGreeting } from '@/lib/utils'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Bell, Pause, Wallet, LineChart, ChevronRight } from 'lucide-react'

export default async function HomePage() {
  const supabase = await createClient()
  const { data: { user } } = await getAuthUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('nickname').eq('id', user.id).single() as { data: any }
  
  const monthKey = getMonthKey()
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

  // Get most frequent trigger for the "Jeda sekarang" subtitle
  const { data: history } = await supabase
    .from('pause_sessions')
    .select('trigger_type')
    .eq('user_id', user.id)
  
  let topTrigger = 'Mulai jeda baru'
  if (history && history.length > 0) {
    const triggerCounts = history.reduce((acc: any, curr: any) => {
      if (curr.trigger_type) {
        acc[curr.trigger_type] = (acc[curr.trigger_type] || 0) + 1
      }
      return acc
    }, {})
    
    let maxCount = 0
    let maxTrigger = ''
    for (const [trigger, count] of Object.entries(triggerCounts)) {
      if ((count as number) > maxCount) {
        maxCount = count as number
        maxTrigger = trigger
      }
    }
    
    const mapping: Record<string, string> = {
      'stress': 'Lagi stres',
      'bored': 'Lagi bosan',
      'chasing_loss': 'Mau balikin kerugian',
      'late_night': 'Larut malam',
      'social_pressure': 'Tekanan sosial',
      'promo': 'Melihat promo'
    }
    topTrigger = mapping[maxTrigger] || topTrigger
  }

  // Get total pauses this month
  const { data: totalPauses } = await supabase
    .from('pause_sessions')
    .select('id', { count: 'exact' })
    .eq('user_id', user.id)
    .gte('created_at', new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString())

  const pauseCount = totalPauses?.length || 0;

  return (
    <div className="flex flex-col flex-1 p-6 lg:p-12 pb-24 lg:pb-12 space-y-8 animate-in fade-in duration-500 bg-[#F8FAFC] lg:bg-white min-h-screen">
      <header className="relative pt-2 space-y-4 lg:space-y-6 max-w-4xl mx-auto w-full">
        <div className="flex justify-between items-center mb-6 lg:mb-0 lg:hidden">
          <h1 className="text-xl font-bold tracking-tight text-foreground">Beranda</h1>
          <button className="p-2 -mr-2 rounded-full hover:bg-muted transition-colors relative">
            <Bell className="w-5 h-5 text-foreground" />
            <div className="absolute top-2 right-2.5 w-2 h-2 bg-destructive rounded-full"></div>
          </button>
        </div>
        
        <div className="lg:flex lg:justify-between lg:items-end">
          <div>
            <h2 className="text-lg lg:text-3xl font-bold text-foreground tracking-tight">
              {getGreeting()}, {profile?.nickname || 'Kawan'}.
            </h2>
            <div className="flex items-center gap-2 mt-2">
              <p className="text-sm lg:text-base text-muted-foreground leading-relaxed">
                Kamu sudah menjeda <span className="font-bold text-foreground">{pauseCount} dorongan</span> bulan ini.
              </p>
              <div className="hidden lg:flex items-center justify-center p-1 bg-muted/30 rounded-md">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-muted-foreground"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-4 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6 pt-2 max-w-4xl mx-auto w-full">
        {/* Main Action Card */}
        <div className="lg:col-span-1 lg:row-span-2">
          <Link 
            href="/pause/new"
            className="flex lg:flex-col items-center lg:items-start p-4 lg:p-8 rounded-2xl lg:rounded-[32px] bg-white lg:bg-[#E7F2EC] border border-border/60 lg:border-success/20 shadow-sm hover:shadow-soft-card transition-shadow group h-full"
          >
            <div className="w-12 h-12 lg:w-16 lg:h-16 rounded-full bg-[#E7F2EC] lg:bg-white flex items-center justify-center shrink-0 mr-4 lg:mr-0 lg:mb-6 shadow-sm">
              <Pause className="w-6 h-6 lg:w-8 lg:h-8 text-primary" strokeWidth={2.5} />
            </div>
            <div className="flex-1 flex flex-col justify-center lg:justify-start w-full">
              <span className="text-sm lg:text-base text-muted-foreground lg:text-primary/80 lg:font-medium lg:mb-2">{topTrigger}?</span>
              <span className="text-base lg:text-2xl font-bold text-foreground lg:text-primary leading-tight lg:leading-snug">Buat jarak<br className="hidden lg:block"/> 90 detik.</span>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors lg:hidden" />
            <div className="hidden lg:flex items-center gap-2 mt-8 text-primary font-bold">
              <span>Jeda sekarang</span>
              <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </div>
          </Link>
        </div>

        {/* Secondary Cards */}
        <Link 
          href="/monthly-plan"
          className="flex flex-col lg:flex-row items-start lg:items-center p-4 lg:p-6 rounded-2xl bg-white border border-border/60 shadow-sm hover:shadow-soft-card transition-shadow group lg:h-auto"
        >
          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 mb-4 lg:mb-0 lg:mr-4">
            <Wallet className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1 flex flex-col justify-center w-full">
            <span className="text-base lg:text-lg font-bold text-foreground leading-tight mb-1">Ruang uang bulan ini</span>
            <span className="text-sm text-muted-foreground">Pantau sisa anggaran</span>
          </div>
          <ChevronRight className="hidden lg:block w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors ml-4" />
        </Link>

        <Link 
          href="/dashboard"
          className="flex flex-col lg:flex-row items-start lg:items-center p-4 lg:p-6 rounded-2xl bg-white border border-border/60 shadow-sm hover:shadow-soft-card transition-shadow group lg:h-auto"
        >
          <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-muted/50 flex items-center justify-center shrink-0 mb-4 lg:mb-0 lg:mr-4">
            <LineChart className="w-6 h-6 text-muted-foreground" />
          </div>
          <div className="flex-1 flex flex-col justify-center w-full">
            <span className="text-base lg:text-lg font-bold text-foreground leading-tight mb-1">Dampak jeda bulan ini</span>
            <span className="text-sm text-muted-foreground">Lihat pengaruh keputusan kecil</span>
          </div>
          <ChevronRight className="hidden lg:block w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors ml-4" />
        </Link>
        
        {/* Helper info on desktop */}
        <div className="hidden lg:flex items-start gap-4 p-5 rounded-2xl bg-[#F8FAFC] border border-border/40 mt-4 col-span-2">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-muted-foreground shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
          <p className="text-sm text-muted-foreground leading-relaxed font-medium">
            Kendali ada pada pilihan kecil setiap hari. Kami menjaga data aktivitasmu tetap privat dan aman.
          </p>
        </div>
      </div>
    </div>
  )
}
