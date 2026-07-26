'use client'

import * as React from 'react'
import { formatTimerSeconds } from '@/lib/formatters'
import { getRemainingSeconds } from '@/modules/pause/timer'
import { ShieldCheck, Leaf } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PauseTimerProps {
  eligibleAt: string
  onComplete?: () => void
  onSkip?: () => void
}

export function PauseTimer({ eligibleAt, onComplete, onSkip }: PauseTimerProps) {
  const targetMs = new Date(eligibleAt).getTime()
  
  const [initialRemaining] = React.useState(() => getRemainingSeconds(targetMs, Date.now()))
  const maxDuration = Math.max(initialRemaining, 90) // Assuming 90s is the standard max

  const [remainingSeconds, setRemainingSeconds] = React.useState(initialRemaining)

  React.useEffect(() => {
    const interval = setInterval(() => {
      const remaining = getRemainingSeconds(targetMs, Date.now())
      setRemainingSeconds(remaining)
      
      if (remaining <= 0) {
        clearInterval(interval)
        onComplete?.()
      }
    }, 100) // Fast update for smooth animation
    
    return () => clearInterval(interval)
  }, [targetMs, onComplete])

  // Circular progress math
  const radius = 120
  const circumference = 2 * Math.PI * radius
  const progressPercentage = Math.max(0, Math.min(100, (remainingSeconds / maxDuration) * 100))
  const strokeDashoffset = circumference - (progressPercentage / 100) * circumference
  
  const isDone = remainingSeconds <= 0

  return (
    <div className="flex flex-col items-center justify-between min-h-[70vh] w-full max-w-sm mx-auto p-4 animate-in fade-in zoom-in-95 duration-700">
      
      {/* Top Pill */}
      <div className="flex items-center gap-2 bg-[#E7F2EC] text-[#265C4B] text-xs font-semibold px-4 py-1.5 rounded-full mt-4 border border-[#265C4B]/20">
        <ShieldCheck className="w-3.5 h-3.5" />
        <span>Mode Jeda • Privasi Terjaga</span>
      </div>

      {/* Circular Timer */}
      <div className="relative flex flex-col items-center justify-center my-12">
        <svg
          className="w-72 h-72 transform -rotate-90"
          viewBox="0 0 280 280"
        >
          {/* Background circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="8"
            className="text-muted opacity-50"
          />
          {/* Progress circle */}
          <circle
            cx="140"
            cy="140"
            r={radius}
            fill="transparent"
            stroke="currentColor"
            strokeWidth="10"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            className="text-primary transition-all duration-300 ease-linear"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-7xl font-bold tracking-tighter text-foreground tabular-nums">
            {formatTimerSeconds(remainingSeconds)}
          </span>
          <span className="text-lg font-medium text-primary mt-2">
            detik
          </span>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="text-center space-y-4 max-w-[200px] mb-8">
        <p className="text-lg font-medium text-foreground leading-snug">
          {isDone ? 'Waktu jeda selesai.' : 'Tidak perlu memutuskan sekarang.'}
        </p>
        <p className="text-sm text-muted-foreground">
          {isDone ? 'Silakan tentukan keputusanmu.' : 'Tarik napas perlahan.'}
        </p>
        {!isDone && (
          <div className="flex justify-center pt-2">
            <Leaf className="w-6 h-6 text-primary/60" />
          </div>
        )}
      </div>

      {/* Skip button at the very bottom */}
      {!isDone && (
        <div className="mt-auto pb-4">
          <Button 
            variant="ghost" 
            className="text-primary font-medium hover:text-primary hover:bg-primary/10"
            onClick={onSkip || onComplete}
          >
            Saya tetap ingin lanjut
          </Button>
        </div>
      )}
    </div>
  )
}
