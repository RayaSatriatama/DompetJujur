import { getAuthUser } from '../../../../../lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Sparkles, CheckCircle2, ChevronRight } from 'lucide-react'

export default async function ReflectionPage(props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
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

  if (!session) redirect('/home')

  const isDelayed = session.outcome === 'delayed' || session.outcome === 'redirected'

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-white lg:bg-[#F8FAFC] lg:items-center lg:justify-center p-0 lg:p-6 relative overflow-hidden">
      <div className="absolute -right-12 -bottom-12 opacity-10 pointer-events-none w-64 h-64 text-primary z-0 hidden lg:block">
        <svg viewBox="0 0 200 200" fill="currentColor"><path d="M45.7,117.8c0-38.3,27.1-70.8,63.9-78.5c1.1-0.2,2.3-0.4,3.4-0.5c11.9-1.5,23.3-0.5,33.5,2.4c17.2,4.8,31.2,15.8,39,30 c1.1,2.1,2.1,4.3,3,6.5c2.6,6.7,4.3,14.1,4.7,21.9c0.9,15.5-3.3,30.3-11.2,42.7c-7.9,12.4-19.6,22.1-33.3,27.6 c-13.8,5.4-29.3,6.1-43.8,1.7C90,167.3,77.7,157.9,69,145.4c-4.4-6.3-7.9-13.4-10.2-21.1c-1.4-4.6-2.5-9.3-3.1-14.3 C55.3,107.5,55.5,104.9,56,102.3C50,105.7,45.7,111.4,45.7,117.8z"/></svg>
      </div>

      <div className="flex flex-col flex-1 lg:flex-none w-full lg:bg-white lg:rounded-[32px] lg:shadow-soft-card lg:p-10 lg:border lg:border-border/50 p-6 space-y-8 animate-in fade-in duration-500 z-10 relative lg:max-w-4xl">
        <div className="absolute -left-12 -top-12 opacity-10 pointer-events-none w-64 h-64 text-primary lg:hidden">
          <svg viewBox="0 0 200 200" fill="currentColor"><path d="M45.7,117.8c0-38.3,27.1-70.8,63.9-78.5c1.1-0.2,2.3-0.4,3.4-0.5c11.9-1.5,23.3-0.5,33.5,2.4c17.2,4.8,31.2,15.8,39,30 c1.1,2.1,2.1,4.3,3,6.5c2.6,6.7,4.3,14.1,4.7,21.9c0.9,15.5-3.3,30.3-11.2,42.7c-7.9,12.4-19.6,22.1-33.3,27.6 c-13.8,5.4-29.3,6.1-43.8,1.7C90,167.3,77.7,157.9,69,145.4c-4.4-6.3-7.9-13.4-10.2-21.1c-1.4-4.6-2.5-9.3-3.1-14.3 C55.3,107.5,55.5,104.9,56,102.3C50,105.7,45.7,111.4,45.7,117.8z"/></svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:gap-16">
          
          {/* Header Section (Left on Desktop) */}
          <header className="text-center lg:text-left space-y-4 mb-8 lg:mb-0 lg:flex-1">
            <div className="flex justify-center lg:justify-start mb-6">
              <div className="relative">
                <div className="p-4 border-2 border-primary/20 rounded-full bg-[#E7F2EC]">
                  <Sparkles className="w-8 h-8 text-[#265C4B]" strokeWidth={2.5} />
                </div>
                {isDelayed && (
                  <div className="absolute -top-1 -right-1 bg-white rounded-full">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                  </div>
                )}
              </div>
            </div>
            
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
              Catatan untukmu
            </h1>
            <p className="text-muted-foreground text-sm lg:text-base leading-relaxed max-w-[280px] mx-auto lg:max-w-none text-center lg:text-left">
              Berdasarkan pola yang DompetJujur pelajari darimu hari ini.
            </p>
          </header>

          {/* Form/Insight Section (Right on Desktop) */}
          <div className="w-full lg:flex-1 flex flex-col justify-between h-full space-y-8 lg:space-y-12">
            
            <div className="bg-[#F8FAFC] border border-border/60 rounded-2xl p-6 shadow-sm relative">
              <div className="absolute -top-3 left-6 bg-primary text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                Insight AI
              </div>
              <p className="text-sm lg:text-base text-foreground leading-relaxed pt-2">
                {isDelayed ? (
                  <>
                    <span className="font-semibold block mb-2">Luar biasa!</span>
                    Kamu berhasil mengendalikan dorongan di waktu rawan. Semakin sering kamu berlatih menunda, semakin ringan rasanya di kemudian hari. Teruskan kebiasaan baik ini!
                  </>
                ) : (
                  <>
                    <span className="font-semibold block mb-2">Tidak apa-apa.</span>
                    Hari ini mungkin berat, tapi ini bukan akhir. Kamu sudah mencoba yang terbaik. Mari kita coba lagi di kesempatan berikutnya.
                  </>
                )}
              </p>
            </div>

            <div className="pt-4 space-y-4 pb-12 lg:pb-0">
              <Link href="/home" className="w-full">
                <Button className="w-full h-14 rounded-xl text-lg font-bold shadow-soft-card bg-primary hover:bg-primary/90">
                  Kembali ke Beranda
                </Button>
              </Link>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  )
}
