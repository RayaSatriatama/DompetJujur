'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { completePauseAction } from '@/modules/pause/actions'
import { isErr } from '@/lib/result'
import { Button } from '@/components/ui/button'
import { Shield } from 'lucide-react'

export function DecisionClient({ session }: { session: any }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleDecide = async (outcome: 'delayed' | 'proceeded') => {
    setLoading(true)
    setError(null)

    const result = await completePauseAction(session.id, { outcome })

    if (isErr(result)) {
      setError(result.error)
      setLoading(false)
      return
    }

    router.push(`/pause/${session.id}/outcome`)
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-white lg:bg-[#F8FAFC] lg:items-center lg:justify-center p-0 lg:p-6">
      <div className="flex flex-col flex-1 lg:flex-none w-full lg:max-w-md lg:bg-white lg:rounded-[32px] lg:shadow-soft-card lg:p-10 lg:border lg:border-border/50 p-6 space-y-8 animate-in fade-in zoom-in-95 duration-500">
        <div className="flex-1 flex flex-col items-center justify-center w-full">
          
          <div className="flex flex-col items-center text-center space-y-4 mb-12">
            <div className="p-3 border-2 border-primary/20 rounded-2xl mb-2">
              <Shield className="w-8 h-8 text-primary" strokeWidth={2.5} />
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-foreground">Jeda selesai.</h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[240px]">
              Sekarang pilih yang paling jujur menggambarkan keputusanmu.
            </p>
          </div>

          {error && <div className="text-sm text-destructive font-medium mb-6">{error}</div>}
          
          <div className="w-full space-y-4">
            <Button 
              className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-soft-card"
              onClick={() => handleDecide('delayed')}
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Saya tunda dulu'}
            </Button>
            
            <Button 
              variant="outline"
              className="w-full h-14 rounded-xl text-lg font-bold border-primary text-primary hover:bg-primary/5"
              onClick={() => router.push(`/pause/${session.id}/divert`)}
              disabled={loading}
            >
              Saya pindahkan fokus
            </Button>

            <Button 
              variant="ghost"
              className="w-full h-14 rounded-xl text-lg font-bold text-primary hover:bg-primary/10 hover:text-primary mt-2"
              onClick={() => handleDecide('proceeded')}
              disabled={loading}
            >
              Saya tetap memilih lanjut
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
