import { getAuthUser } from '../../../lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { BarChart3, Calendar, Clock, Accessibility, Info, Shield, ChevronRight } from 'lucide-react'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await getAuthUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single() as { data: any }
  
  const nickname = profile?.nickname || 'Kawan'
  const initial = nickname.charAt(0).toUpperCase()

  return (
    <div className="flex flex-col flex-1 p-6 lg:p-12 pb-24 lg:pb-12 space-y-8 lg:space-y-12 animate-in fade-in duration-500 bg-[#F9FAFB] lg:bg-white min-h-screen w-full max-w-6xl mx-auto">
      <header className="pt-2 lg:pt-4 flex justify-center lg:justify-start w-full">
        <h1 className="text-xl lg:text-3xl font-bold tracking-tight text-foreground">Saya</h1>
      </header>

      <div className="flex flex-col lg:flex-row lg:items-start lg:gap-12 w-full">
        
        {/* Column 1: Profile Info */}
        <div className="flex flex-col items-center lg:items-start justify-center lg:justify-start space-y-3 pb-8 lg:pb-0 lg:w-1/4 shrink-0">
          <div className="w-20 h-20 lg:w-32 lg:h-32 bg-[#265C4B] rounded-full flex items-center justify-center text-white text-3xl lg:text-5xl font-bold shadow-sm mb-2 lg:mb-4">
            {initial}
          </div>
          <div className="text-center lg:text-left">
            <h2 className="text-xl lg:text-2xl font-bold text-foreground tracking-tight">{nickname}</h2>
            <p className="text-sm lg:text-base text-muted-foreground">{user.email}</p>
          </div>
          
          <div className="hidden lg:block w-full h-[1px] bg-border/50 my-6"></div>
          
          <div className="hidden lg:flex flex-col items-start gap-4 w-full">
             <Link href="/logout" className="text-sm font-medium text-destructive hover:underline">
               Keluar
             </Link>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:gap-8 w-full space-y-6 lg:space-y-0">
          {/* Column 2: Informasi pribadi */}
          <div className="lg:flex-1 w-full">
            <h3 className="text-xs lg:text-sm font-semibold text-muted-foreground uppercase tracking-wider px-4 lg:px-0 mb-3 lg:mb-4">Informasi pribadi</h3>
            <div className="bg-white rounded-2xl lg:rounded-[24px] border border-border/50 shadow-sm overflow-hidden">
              <Link href="/onboarding" className="flex items-center justify-between p-4 lg:p-5 border-b border-border/40 hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-4 text-foreground">
                  <div className="w-10 h-10 rounded-full bg-[#E7F2EC] flex items-center justify-center shrink-0">
                    <BarChart3 className="w-5 h-5 text-[#265C4B]" />
                  </div>
                  <span className="font-semibold text-sm lg:text-base tracking-tight">Baseline keuangan</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </Link>
              <Link href="/plan" className="flex items-center justify-between p-4 lg:p-5 border-b border-border/40 hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-4 text-foreground">
                  <div className="w-10 h-10 rounded-full bg-[#E7F2EC] flex items-center justify-center shrink-0">
                    <Calendar className="w-5 h-5 text-[#265C4B]" />
                  </div>
                  <span className="font-semibold text-sm lg:text-base tracking-tight">Tanggal gajian</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </Link>
              <Link href="/plan" className="flex items-center justify-between p-4 lg:p-5 border-b border-border/40 hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-4 text-foreground">
                  <div className="w-10 h-10 rounded-full bg-[#E7F2EC] flex items-center justify-center shrink-0">
                    <Clock className="w-5 h-5 text-[#265C4B]" />
                  </div>
                  <span className="font-semibold text-sm lg:text-base tracking-tight">Jam rawan</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </Link>
              <Link href="/profile" className="flex items-center justify-between p-4 lg:p-5 hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-4 text-foreground">
                  <div className="w-10 h-10 rounded-full bg-[#E7F2EC] flex items-center justify-center shrink-0">
                    <Accessibility className="w-5 h-5 text-[#265C4B]" />
                  </div>
                  <span className="font-semibold text-sm lg:text-base tracking-tight">Preferensi aksesibilitas</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </Link>
            </div>
          </div>

          {/* Column 3: Aplikasi */}
          <div className="lg:flex-1 w-full">
            <h3 className="text-xs lg:text-sm font-semibold text-muted-foreground uppercase tracking-wider px-4 lg:px-0 mb-3 lg:mb-4">Aplikasi</h3>
            <div className="bg-white rounded-2xl lg:rounded-[24px] border border-border/50 shadow-sm overflow-hidden">
              <Link href="/profile/privacy" className="flex items-center justify-between p-4 lg:p-5 border-b border-border/40 hover:bg-muted/30 transition-colors group">
                <div className="flex items-center gap-4 text-foreground">
                  <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center shrink-0">
                    <Shield className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="font-semibold text-sm lg:text-base tracking-tight">Privasi & data</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground/40 group-hover:text-primary transition-colors" />
              </Link>
              <div className="flex items-center justify-between p-4 lg:p-5 hover:bg-muted/30 transition-colors">
                <div className="flex items-center gap-4 text-foreground">
                  <div className="w-10 h-10 rounded-full bg-muted/50 flex items-center justify-center shrink-0">
                    <Info className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <span className="font-semibold text-sm lg:text-base tracking-tight">Versi 1.0.0</span>
                </div>
                <ChevronRight className="w-5 h-5 text-muted-foreground/20" />
              </div>
            </div>
          </div>
        </div>
        
      </div>
      
      {/* Decorative leaf background, subtle */}
      <div className="fixed top-0 right-0 -mr-20 -mt-10 opacity-[0.03] pointer-events-none w-64 h-64 text-primary">
        <svg viewBox="0 0 200 200" fill="currentColor"><path d="M45.7,117.8c0-38.3,27.1-70.8,63.9-78.5c1.1-0.2,2.3-0.4,3.4-0.5c11.9-1.5,23.3-0.5,33.5,2.4c17.2,4.8,31.2,15.8,39,30 c1.1,2.1,2.1,4.3,3,6.5c2.6,6.7,4.3,14.1,4.7,21.9c0.9,15.5-3.3,30.3-11.2,42.7c-7.9,12.4-19.6,22.1-33.3,27.6 c-13.8,5.4-29.3,6.1-43.8,1.7C90,167.3,77.7,157.9,69,145.4c-4.4-6.3-7.9-13.4-10.2-21.1c-1.4-4.6-2.5-9.3-3.1-14.3 C55.3,107.5,55.5,104.9,56,102.3C50,105.7,45.7,111.4,45.7,117.8z"/></svg>
      </div>
    </div>
  )
}
