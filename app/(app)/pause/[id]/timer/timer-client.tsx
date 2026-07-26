'use client'

import { useRouter } from 'next/navigation'
import { PauseTimer } from '@/components/pause-timer'

export function TimerClient({ session }: { session: any }) {
  const router = useRouter()

  const handleComplete = () => {
    router.replace(`/pause/${session.id}/decision`)
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
