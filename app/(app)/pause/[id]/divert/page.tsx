'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { completePauseAction } from '@/modules/pause/actions'
import { isErr } from '@/lib/result'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Coffee, Footprints, Users, Smartphone, Check } from 'lucide-react'
import Link from 'next/link'

const DIVERT_ACTIVITIES = [
  { id: 'drink_stand', label: 'Minum air & berdiri', icon: Coffee },
  { id: 'walk', label: 'Jalan sebentar', icon: Footprints },
  { id: 'contact_friend', label: 'Hubungi orang terpercaya', icon: Users },
  { id: 'screen_off', label: 'Tutup layar 10 menit', icon: Smartphone },
]

export default function DivertFocusPage({ params }: { params: Promise<{ id: string }> }) {
  const [session, setSession] = useState<any>(null)
  const [activity, setActivity] = useState<string>('drink_stand')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    let mounted = true
    
    async function loadSession() {
      const { id } = await params
      const { data } = await supabase
        .from('pause_sessions')
        .select('*')
        .eq('id', id)
        .single() as { data: any }
      
      if (!mounted) return

      if (data) {
        if (data.outcome) {
          router.replace(`/pause/${data.id}/outcome`)
          return
        }
        setSession(data)
      } else {
        router.replace('/home')
      }
    }

    loadSession()
    return () => { mounted = false }
  }, [params, router, supabase])

  const handleConfirmDivert = async () => {
    if (!session) return
    setLoading(true)
    setError(null)

    // Complete the pause session with outcome = 'redirected'
    const result = await completePauseAction(session.id, { outcome: 'redirected' })

    if (isErr(result)) {
      setError(result.error)
      setLoading(false)
      return
    }

    // Go to outcome summary
    router.push(`/pause/${session.id}/outcome`)
  }

  if (!session) return null

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-white lg:bg-[#F8FAFC] lg:items-center lg:justify-center p-0 lg:p-6">
      <div className="flex flex-col flex-1 lg:flex-none w-full lg:max-w-4xl lg:bg-white lg:rounded-[32px] lg:shadow-soft-card lg:p-12 lg:border lg:border-border/50 p-6 pb-24 lg:pb-12 space-y-8 animate-in fade-in slide-in-from-right-8 duration-500">
        <header className="relative flex flex-col items-center justify-center pt-2 mb-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 lg:hidden">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
          </div>
          <Link href={`/pause/${session.id}/decision`} className="absolute left-0 top-2 p-2 -ml-2 rounded-full hover:bg-muted transition-colors lg:hidden">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div className="hidden lg:flex w-16 h-16 rounded-full bg-primary/5 items-center justify-center mb-6 border border-primary/10">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 12 12"/>
            </svg>
          </div>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight">Pindahkan fokus 10 menit</h1>
          <p className="text-muted-foreground text-sm mt-2 hidden lg:block">Pilih satu hal kecil untuk bantu menenangkan pikiranmu.</p>
        </header>

        <div className="flex-1 w-full max-w-sm lg:max-w-none mx-auto flex flex-col lg:flex-row lg:gap-12 mt-4">
          {error && <div className="text-sm text-destructive font-medium mb-4 lg:hidden">{error}</div>}

          {/* Left Column: Activities & Button */}
          <div className="flex-1 flex flex-col">
            <p className="text-center text-sm text-muted-foreground mb-6 lg:hidden">
              Pilih satu hal kecil untuk bantu menenangkan pikiranmu.
            </p>

            <div className="grid grid-cols-2 gap-4 lg:gap-6 mb-8 lg:mb-10">
              {DIVERT_ACTIVITIES.map((item) => {
                const Icon = item.icon
                const isSelected = activity === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActivity(item.id)}
                    className={`relative flex flex-col items-center justify-center gap-3 p-6 lg:p-8 rounded-2xl border transition-all duration-200 aspect-square ${
                      isSelected 
                        ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                        : 'border-border/60 text-muted-foreground hover:bg-muted/30'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-3 right-3 bg-primary rounded-full p-0.5">
                        <Check className="w-3 h-3 lg:w-4 lg:h-4 text-white" strokeWidth={3} />
                      </div>
                    )}
                    <Icon className={`w-8 h-8 lg:w-10 lg:h-10 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`font-semibold text-center text-sm lg:text-base leading-tight ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="mt-auto space-y-4">
              {error && <div className="text-sm text-destructive font-medium hidden lg:block text-center">{error}</div>}
              <Button 
                className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-soft-card"
                onClick={handleConfirmDivert}
                disabled={loading}
              >
                {loading ? 'Menyimpan...' : 'Saya pilih ini'}
              </Button>
              <p className="text-center text-sm text-muted-foreground lg:hidden">
                Tidak perlu menyelesaikan semuanya sekarang.
              </p>
            </div>
          </div>

          {/* Right Column: Motivation Card (Desktop Only) */}
          <div className="hidden lg:flex w-72 bg-[#F8FAFC] border border-border/60 rounded-3xl p-8 flex-col items-center justify-center text-center">
            <div className="w-16 h-16 rounded-full bg-primary/5 flex items-center justify-center mb-6">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/>
                <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 12 12"/>
              </svg>
            </div>
            <h3 className="font-bold text-foreground text-lg mb-3">Tidak perlu menyelesaikan semuanya sekarang.</h3>
            <p className="text-sm text-muted-foreground">Satu langkah kecil sudah cukup berarti.</p>
          </div>
        </div>
      </div>
    </div>
  )
}
