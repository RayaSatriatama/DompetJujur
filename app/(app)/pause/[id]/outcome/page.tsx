import { getAuthUser } from '../../../../../lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatRupiah } from '@/lib/formatters'
import { Pause, Shield, CheckCircle2, AlertCircle, CheckCircle } from 'lucide-react'

export default async function OutcomePage(props: { params: Promise<{ id: string }>, searchParams: Promise<{ error?: string, recovered?: string }> }) {
  const params = await props.params;
  const searchParams = await props.searchParams;
  const { id } = params
  const supabase = await createClient()
  const { data: { user } } = await getAuthUser()
  if (!user) redirect('/login')

  const { data: session } = await supabase
    .from('pause_sessions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single() as any

  if (!session || !session.outcome) redirect('/home')

  const { data: existingReflection } = await supabase
    .from('reflection_entries')
    .select('id')
    .eq('session_id', id)
    .single()
  
  if (existingReflection) redirect('/home')

  const isDelayed = session.outcome === 'delayed' || session.outcome === 'redirected'
  const hasError = searchParams.error === 'true'
  const isRecovered = searchParams.recovered === 'true'

  const reflectionOptions = isDelayed ? [
    { code: 'calmer', label: 'Lebih tenang' },
    { code: 'lighter', label: 'Lebih ringan' },
    { code: 'same', label: 'Biasa saja' },
    { code: 'heavy', label: 'Masih berat' },
  ] : [
    { code: 'urge_too_strong', label: 'Dorongan terlalu kuat' },
    { code: 'stress', label: 'Sedang stres' },
    { code: 'chasing_loss', label: 'Merasa harus balik modal' },
    { code: 'avoid_thinking', label: 'Tidak ingin berpikir panjang' },
  ]

  async function submitReflection(formData: FormData) {
    'use server'
    // Simulate error for mockup 10 demonstration if form has simulate_error=1
    if (formData.get('simulate_error') === 'true') {
      redirect(`/pause/${id}/outcome?error=true`)
    }
    // Simulate recovery for mockup 10
    if (formData.get('simulate_recovery') === 'true') {
      redirect(`/pause/${id}/outcome?recovered=true`)
    }

    const code = formData.get('code') as string
    const sb = await createClient()
    
    try {
      await sb.from('reflection_entries').insert({
        user_id: user!.id,
        session_id: session.id,
        reflection_code: code || 'skipped',
        note: null
      } as any)
    } catch (e) {
      console.error('Reflection insert error:', e)
    }
    
    // Redirect to AI reflection page (Mockup 13)
    redirect(`/pause/${id}/reflection`)
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-white lg:bg-[#F8FAFC] lg:items-center lg:justify-center p-0 lg:p-6 relative overflow-hidden">
      <div className="absolute -left-12 -top-12 opacity-10 pointer-events-none w-64 h-64 text-primary z-0 hidden lg:block">
        <svg viewBox="0 0 200 200" fill="currentColor"><path d="M45.7,117.8c0-38.3,27.1-70.8,63.9-78.5c1.1-0.2,2.3-0.4,3.4-0.5c11.9-1.5,23.3-0.5,33.5,2.4c17.2,4.8,31.2,15.8,39,30 c1.1,2.1,2.1,4.3,3,6.5c2.6,6.7,4.3,14.1,4.7,21.9c0.9,15.5-3.3,30.3-11.2,42.7c-7.9,12.4-19.6,22.1-33.3,27.6 c-13.8,5.4-29.3,6.1-43.8,1.7C90,167.3,77.7,157.9,69,145.4c-4.4-6.3-7.9-13.4-10.2-21.1c-1.4-4.6-2.5-9.3-3.1-14.3 C55.3,107.5,55.5,104.9,56,102.3C50,105.7,45.7,111.4,45.7,117.8z"/></svg>
      </div>

      <div className={`flex flex-col flex-1 lg:flex-none w-full lg:bg-white lg:rounded-[32px] lg:shadow-soft-card lg:p-10 lg:border lg:border-border/50 p-6 space-y-8 animate-in fade-in duration-500 z-10 relative ${isDelayed ? 'lg:max-w-3xl' : 'lg:max-w-4xl'}`}>
        <div className="absolute -left-12 -top-12 opacity-10 pointer-events-none w-64 h-64 text-primary lg:hidden">
          <svg viewBox="0 0 200 200" fill="currentColor"><path d="M45.7,117.8c0-38.3,27.1-70.8,63.9-78.5c1.1-0.2,2.3-0.4,3.4-0.5c11.9-1.5,23.3-0.5,33.5,2.4c17.2,4.8,31.2,15.8,39,30 c1.1,2.1,2.1,4.3,3,6.5c2.6,6.7,4.3,14.1,4.7,21.9c0.9,15.5-3.3,30.3-11.2,42.7c-7.9,12.4-19.6,22.1-33.3,27.6 c-13.8,5.4-29.3,6.1-43.8,1.7C90,167.3,77.7,157.9,69,145.4c-4.4-6.3-7.9-13.4-10.2-21.1c-1.4-4.6-2.5-9.3-3.1-14.3 C55.3,107.5,55.5,104.9,56,102.3C50,105.7,45.7,111.4,45.7,117.8z"/></svg>
        </div>

        <div className={`relative z-10 flex flex-col ${isDelayed ? (hasError ? 'lg:flex-row lg:items-start lg:gap-12' : 'lg:items-center') : 'lg:flex-row lg:items-center lg:gap-16'}`}>
          
          {/* Header Section (Left on Desktop if Proceeded or if Error Delayed) */}
          <header className={`text-center lg:text-left space-y-4 mb-8 lg:mb-0 ${isDelayed ? (hasError ? 'lg:flex-1' : 'w-full max-w-md mx-auto') : 'lg:flex-1'}`}>
            {isDelayed && !hasError && (
              <div className="flex justify-center mb-6">
                <div className="p-4 border-2 border-primary/20 rounded-full bg-white text-primary">
                  <Pause className="w-8 h-8" strokeWidth={2.5} />
                </div>
              </div>
            )}
            {!isDelayed && (
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="relative">
                  <div className="p-4 border-2 border-primary/20 rounded-full bg-white">
                    <Shield className="w-8 h-8 text-primary" strokeWidth={2.5} />
                  </div>
                  <div className="absolute -top-1 -right-1 bg-white rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                </div>
              </div>
            )}
            
            <h1 className={`text-2xl font-bold tracking-tight text-foreground ${isDelayed ? 'px-4 lg:px-0 text-center lg:text-left' : 'lg:text-3xl'}`}>
              {isDelayed ? 'Refleksi Hasil' : 'Terima kasih sudah jujur.'}
            </h1>
            <p className={`text-muted-foreground text-sm leading-relaxed ${isDelayed ? (hasError ? 'text-left' : 'max-w-[280px] mx-auto lg:max-w-none text-center lg:text-left') : 'lg:text-base'}`}>
              {isDelayed 
                ? 'Bagaimana perasaanmu setelah jeda ini?'
                : 'Catatan ini bukan nilai tentang dirimu. Kita mulai lagi dari keputusan berikutnya.'}
            </p>
          </header>

          {/* Form Section (Right on Desktop) */}
          <div className={`w-full ${isDelayed ? (hasError ? 'lg:flex-1' : 'max-w-md mx-auto') : 'lg:flex-1'}`}>
            {!isDelayed && (
              <h2 className="text-sm font-semibold text-foreground mb-4">
                Apa yang paling berpengaruh tadi?
              </h2>
            )}
            
            <form action={submitReflection} className="space-y-4 flex flex-col h-full">
              <input type="hidden" name="simulate_error" value="false" id="sim_err" />
              <input type="hidden" name="simulate_recovery" value="false" id="sim_rec" />
              
              <div className="grid grid-cols-1 gap-3">
                {reflectionOptions.map((opt, i) => (
                  <label
                    key={opt.code}
                    className={`relative flex items-center p-4 rounded-xl border bg-white hover:bg-muted/30 transition-colors cursor-pointer group ${
                      hasError && i === 1 ? 'border-destructive bg-destructive/5' : 'border-border/60'
                    }`}
                  >
                    <input type="radio" name="code" value={opt.code} className="peer sr-only" required defaultChecked={hasError && i === 1} />
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 mr-4 flex items-center justify-center peer-checked:border-primary peer-checked:bg-primary transition-colors">
                      <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="text-sm font-medium text-foreground">{opt.label}</span>
                  </label>
                ))}
                
                {!isDelayed && (
                  <label className="relative flex items-center p-4 rounded-xl border border-border/60 bg-white hover:bg-muted/30 transition-colors cursor-pointer group">
                    <input type="radio" name="code" value="skipped" className="peer sr-only" />
                    <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 mr-4 flex items-center justify-center peer-checked:border-primary peer-checked:bg-primary transition-colors">
                      <div className="w-2 h-2 rounded-full bg-white opacity-0 peer-checked:opacity-100 transition-opacity"></div>
                    </div>
                    <span className="text-sm font-medium text-muted-foreground">Lewati</span>
                  </label>
                )}
              </div>

              {hasError && !isRecovered && (
                <div className="flex items-start gap-2 text-destructive mt-4 bg-destructive/5 p-4 rounded-xl border border-destructive/20 lg:hidden">
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-xs font-medium">Ada yang belum tersimpan.<br/>Coba lagi, inputmu tetap ada di layar.</p>
                </div>
              )}

              {isRecovered && (
                <div className="flex items-center gap-2 text-[#265C4B] mt-2 bg-[#265C4B]/10 p-4 rounded-xl border border-[#265C4B]/20">
                  <CheckCircle className="w-5 h-5" />
                  <p className="text-xs font-medium">Koneksi kembali - Data tersimpan</p>
                </div>
              )}

              <div className={`pt-8 space-y-4 pb-12 lg:pb-0 ${hasError && isDelayed && !isRecovered ? 'hidden lg:flex lg:flex-col lg:bg-destructive/5 lg:p-8 lg:rounded-2xl lg:border lg:border-destructive/20 lg:mt-4' : ''}`}>
                {hasError && isDelayed && !isRecovered && (
                  <div className="flex flex-col items-center gap-3 mb-4 hidden lg:flex">
                    <AlertCircle className="w-12 h-12 text-destructive opacity-80" />
                    <h3 className="font-semibold text-foreground text-center">Ada yang belum tersimpan.</h3>
                    <p className="text-sm text-muted-foreground text-center">Coba lagi, inputmu tetap ada di layar.</p>
                  </div>
                )}
                
                <Button type="submit" className={`w-full h-14 rounded-xl text-lg font-bold shadow-soft-card ${hasError && !isRecovered ? 'bg-[#153B2F] hover:bg-[#153B2F]/90 text-white' : 'bg-[#265C4B] hover:bg-[#265C4B]/90 text-white'}`}>
                  {hasError && !isRecovered ? 'Coba simpan lagi' : 'Lihat Catatan AI'}
                </Button>
                
                <div className="text-center w-full">
                  <Link href="/home" className="text-muted-foreground font-medium hover:text-foreground text-sm w-full block py-2">
                    Selesai &amp; kembali ke Beranda
                  </Link>
                </div>

                {/* Developer controls removed to fix Server Component error */}
              </div>
              
              {/* Mobile buttons when error */}
              {hasError && !isRecovered && (
                <div className="pt-4 space-y-4 pb-12 lg:hidden">
                  <Button type="submit" className="w-full h-14 rounded-xl text-lg font-bold bg-[#153B2F] hover:bg-[#153B2F]/90 shadow-soft-card text-white">
                    Coba simpan lagi
                  </Button>
                  <div className="text-center w-full">
                    <Link href="/home" className="text-muted-foreground font-medium hover:underline text-sm w-full block py-2">
                      Kembali nanti
                    </Link>
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
