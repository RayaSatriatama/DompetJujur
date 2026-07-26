'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { PauseTimer } from '@/components/pause-timer'
import { determinePauseState } from '@/modules/pause/state-machine'

export default function TimerPage({ params }: { params: Promise<{ id: string }> }) {
  const [session, setSession] = useState<any>(null)
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
        
        const state = determinePauseState(data)
        if (state === 'decision') {
          router.replace(`/pause/${data.id}/decision`)
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

  const handleComplete = async () => {
    if (!session) return
    router.replace(`/pause/${session.id}/decision`)
  }

  if (!session) {
    return <div className="flex flex-1 items-center justify-center p-8 text-muted-foreground">Memuat sesi jeda...</div>
  }

  return (
    <div className="flex flex-col flex-1 min-h-screen bg-white lg:bg-[#F8FAFC] lg:items-center lg:justify-center p-0 lg:p-6">
      <div className="flex flex-col flex-1 lg:flex-none w-full lg:max-w-md lg:bg-white lg:rounded-[32px] lg:shadow-soft-card lg:p-10 lg:border lg:border-border/50 items-center justify-center p-4">
        <PauseTimer 
          eligibleAt={session.pause_eligible_at} 
          onComplete={handleComplete} 
          onSkip={handleComplete}
        />
      </div>
    </div>
  )
}
