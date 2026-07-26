import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { redirect } from 'next/navigation'
import { Shield, Lock } from 'lucide-react'

export default async function WelcomePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
  const params = await searchParams
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  
  if (params.error) {
    redirect(`${baseUrl}/login?error=${params.error_description || params.error}`)
  }

  if (params.code) {
    redirect(`${baseUrl}/auth/callback?code=${params.code}`)
  }
  
  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Mobile/Tablet View (hidden on lg) */}
      <div className="lg:hidden flex flex-col min-h-screen p-6 overflow-hidden relative w-full bg-white">
        {/* Decorative leaf background */}
        <div className="absolute -left-12 bottom-0 opacity-30 pointer-events-none w-64 h-64 text-primary">
          <svg viewBox="0 0 200 200" fill="currentColor"><path d="M45.7,117.8c0-38.3,27.1-70.8,63.9-78.5c1.1-0.2,2.3-0.4,3.4-0.5c11.9-1.5,23.3-0.5,33.5,2.4c17.2,4.8,31.2,15.8,39,30 c1.1,2.1,2.1,4.3,3,6.5c2.6,6.7,4.3,14.1,4.7,21.9c0.9,15.5-3.3,30.3-11.2,42.7c-7.9,12.4-19.6,22.1-33.3,27.6 c-13.8,5.4-29.3,6.1-43.8,1.7C90,167.3,77.7,157.9,69,145.4c-4.4-6.3-7.9-13.4-10.2-21.1c-1.4-4.6-2.5-9.3-3.1-14.3 C55.3,107.5,55.5,104.9,56,102.3C50,105.7,45.7,111.4,45.7,117.8z"/></svg>
        </div>
        <div className="absolute right-0 bottom-12 opacity-20 pointer-events-none w-48 h-48 text-primary">
          <svg viewBox="0 0 200 200" fill="currentColor"><path d="M152.1,135.2c-15.1,30.3-46.7,50.1-81.8,49.8c-1.1,0-2.2,0-3.3-0.1c-11.2-1.2-21.7-4.4-30.7-9.3 c-15.1-8.2-26.3-21.3-31-36.4c-0.7-2.3-1.2-4.6-1.6-7c-1-7-1-14.4,0.3-21.7c2.5-14.6,9.5-27.7,19.8-37.8c10.3-10.1,23.4-16.7,37.6-18.7 c14.2-2,28.6,0.3,41,6.5c12.5,6.3,22.7,16,29.1,27.5c3.3,5.8,5.8,12.1,7.3,18.8c1,4.3,1.7,8.8,1.9,13.3 C140.9,122.9,141,125.4,140.7,128C145.7,123.6,149.7,117.2,152.1,135.2z"/></svg>
        </div>

        <div className="relative z-10 flex flex-col flex-1 mt-8">
          <div className="flex items-center justify-center gap-2 mb-12">
            <div className="p-2 border border-border/50 rounded-xl shadow-sm">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <span className="text-xl font-bold tracking-tight">DompetJujur</span>
          </div>

          <div className="w-full max-w-[200px] aspect-square mx-auto mb-8 bg-muted/20 rounded-2xl border border-border/40 flex items-center justify-center p-8">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-full h-full text-muted-foreground/40">
              <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
              <line x1="8" y1="6" x2="16" y2="6"/>
              <line x1="8" y1="10" x2="16" y2="10"/>
              <line x1="8" y1="14" x2="12" y2="14"/>
            </svg>
          </div>

          <div className="space-y-4 text-center max-w-[280px] mx-auto">
            <h1 className="text-3xl font-bold tracking-tight leading-tight text-foreground">
              Jeda sebelum uangmu ikut terbawa suasana.
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              DompetJujur membantumu berhenti sebentar, melihat dampaknya, lalu memilih dengan sadar.
            </p>
          </div>

          <div className="mt-8 mb-auto flex items-center justify-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-primary flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5 text-primary"><polyline points="20 6 9 17 4 12"/></svg>
              </div>
              <span className="text-xs font-medium text-muted-foreground">Tanpa koneksi rekening</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 rounded-full border border-primary flex items-center justify-center">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-2.5 h-2.5 text-primary"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              </div>
              <span className="text-xs font-medium text-muted-foreground">Data milikmu</span>
            </div>
          </div>
          
          <div className="space-y-3 mt-8">
            <Button asChild size="lg" className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-soft-card">
              <Link href="/login">Mulai</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full h-14 rounded-xl text-lg font-bold border-primary text-primary hover:bg-primary/5">
              <Link href="/login">Saya sudah punya akun</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Desktop View (visible on lg) */}
      <div className="hidden lg:flex w-full h-screen">
        {/* Left Column: Context */}
        <div className="w-1/2 h-full bg-[#F8FAFC] flex flex-col justify-center px-24 relative overflow-hidden">
          <div className="absolute top-8 left-8 flex items-center gap-2 text-primary font-bold text-xl">
            <Shield className="w-6 h-6" strokeWidth={2.5} />
            <span>DompetJujur</span>
          </div>

          <div className="max-w-md space-y-8 z-10">
            <h1 className="text-5xl font-bold tracking-tight leading-[1.1] text-foreground">
              Jeda sebelum uangmu ikut terbawa suasana.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              DompetJujur membantumu berhenti sebentar, melihat dampaknya, lalu memilih dengan lebih sadar.
            </p>

            <div className="flex items-center gap-8 pt-4">
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3 text-primary"><polyline points="20 6 9 17 4 12"/></svg>
                </div>
                <span className="text-sm font-medium">Tanpa koneksi rekening</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-3 h-3 text-primary"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </div>
                <span className="text-sm font-medium">Data milikmu</span>
              </div>
            </div>

            <div className="pt-12">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#E7F2EC]/50 border border-success/10">
                <Shield className="w-6 h-6 text-primary shrink-0" />
                <p className="text-sm text-muted-foreground leading-relaxed">
                  DompetJujur tidak meminta akses rekening bank dan tidak menyimpan data sensitif di perangkat ini.
                </p>
              </div>
            </div>
          </div>
          
          {/* Large Leaf Decoration */}
          <div className="absolute -left-24 bottom-0 opacity-10 pointer-events-none w-96 h-96 text-primary">
            <svg viewBox="0 0 200 200" fill="currentColor"><path d="M45.7,117.8c0-38.3,27.1-70.8,63.9-78.5c1.1-0.2,2.3-0.4,3.4-0.5c11.9-1.5,23.3-0.5,33.5,2.4c17.2,4.8,31.2,15.8,39,30 c1.1,2.1,2.1,4.3,3,6.5c2.6,6.7,4.3,14.1,4.7,21.9c0.9,15.5-3.3,30.3-11.2,42.7c-7.9,12.4-19.6,22.1-33.3,27.6 c-13.8,5.4-29.3,6.1-43.8,1.7C90,167.3,77.7,157.9,69,145.4c-4.4-6.3-7.9-13.4-10.2-21.1c-1.4-4.6-2.5-9.3-3.1-14.3 C55.3,107.5,55.5,104.9,56,102.3C50,105.7,45.7,111.4,45.7,117.8z"/></svg>
          </div>
        </div>

        {/* Right Column: Interaction */}
        <div className="w-1/2 h-full bg-white flex flex-col items-center justify-center p-12 relative">
          <div className="absolute top-8 right-8">
            <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              Bantuan
            </button>
          </div>

          <div className="w-full max-w-sm flex flex-col space-y-12">
            <div className="w-full aspect-[4/3] bg-muted/10 rounded-[32px] border border-border/50 flex flex-col items-center justify-center p-8 shadow-sm">
              <div className="relative">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-24 h-24 text-muted-foreground/30">
                  <rect x="5" y="2" width="14" height="20" rx="2" ry="2"/>
                  <line x1="8" y1="6" x2="16" y2="6"/>
                  <line x1="8" y1="10" x2="16" y2="10"/>
                  <line x1="8" y1="14" x2="12" y2="14"/>
                </svg>
                <div className="absolute -bottom-2 -right-4">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" className="w-12 h-12 text-muted-foreground/30">
                    <path d="M17 8h1a4 4 0 1 1 0 8h-1"/><path d="M3 8h14v9a4 4 0 0 1-4 4H7a4 4 0 0 1-4-4Z"/><line x1="6" y1="2" x2="6" y2="4"/><line x1="10" y1="2" x2="10" y2="4"/><line x1="14" y1="2" x2="14" y2="4"/></svg>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button asChild size="lg" className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-soft-card">
                <Link href="/login">Mulai</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full h-14 rounded-xl text-lg font-bold border-primary text-primary hover:bg-primary/5">
                <Link href="/login">Saya sudah punya akun</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
