'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { completePauseAction } from '@/modules/pause/actions'
import { isErr } from '@/lib/result'
import { Button } from '@/components/ui/button'
import { Brain, Gamepad2, Coffee, MessageCircle, Music, MoveRight } from 'lucide-react'

export function DivertClient({ session }: { session: any }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleRedirect = async () => {
    setLoading(true)
    setError(null)

    const result = await completePauseAction(session.id, { outcome: 'redirected' })

    if (isErr(result)) {
      setError(result.error)
      setLoading(false)
      return
    }

    router.push(`/pause/${session.id}/outcome`)
  }

  const activities = [
    { icon: Gamepad2, label: 'Main game favorit' },
    { icon: Coffee, label: 'Bikin minuman hangat' },
    { icon: MessageCircle, label: 'Chat teman dekat' },
    { icon: Music, label: 'Dengerin lagu kesukaan' }
  ]

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-white lg:bg-[#F8FAFC] lg:items-center lg:justify-center p-0 lg:p-6">
      <div className="flex flex-col flex-1 lg:flex-none w-full lg:max-w-md lg:bg-white lg:rounded-[32px] lg:shadow-soft-card lg:p-10 lg:border lg:border-border/50 p-6 space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex-1 flex flex-col w-full max-w-sm mx-auto">
          
          <div className="flex flex-col text-center space-y-4 mb-8">
            <div className="self-center p-4 bg-primary/5 rounded-3xl mb-2">
              <Brain className="w-10 h-10 text-primary" strokeWidth={2} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">
              Hebat!
            </h1>
            <p className="text-base text-muted-foreground leading-relaxed">
              Memilih memindahkan fokus adalah langkah awal yang sangat baik. Coba pilih satu aktivitas di bawah:
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-10">
            {activities.map((item, i) => (
              <div key={i} className="flex flex-col items-center justify-center p-4 rounded-2xl bg-slate-50 border border-slate-100 text-center gap-2 transition-transform hover:scale-105 active:scale-95 cursor-default">
                <item.icon className="w-6 h-6 text-slate-400" />
                <span className="text-xs font-medium text-slate-600 leading-tight">
                  {item.label}
                </span>
              </div>
            ))}
          </div>

          {error && <div className="text-sm text-center text-destructive font-medium mb-6">{error}</div>}
          
          <div className="mt-auto space-y-4">
            <Button 
              className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-soft-card group"
              onClick={handleRedirect}
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Saya siap mengalihkan fokus'}
              {!loading && <MoveRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />}
            </Button>
            
            <Button 
              variant="ghost"
              className="w-full h-14 rounded-xl text-base font-medium text-muted-foreground hover:bg-slate-50 hover:text-foreground"
              onClick={() => router.back()}
              disabled={loading}
            >
              Kembali
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
