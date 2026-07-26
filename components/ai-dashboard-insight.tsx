'use client'

import { useCompletion } from '@ai-sdk/react'
import { useEffect, useRef, useState } from 'react'
import { Sparkles, Moon, MessageSquare } from 'lucide-react'
import Link from 'next/link'

interface AiDashboardInsightProps {
  totalSessions: number
  delayedCount: number
  delayedAmount: number
  topTrigger: string
  lateNightCount: number
}

export function AiDashboardInsight({
  totalSessions,
  delayedCount,
  delayedAmount,
  topTrigger,
  lateNightCount,
}: AiDashboardInsightProps) {
  const [hasError, setHasError] = useState(false)

  const { completion, isLoading, complete } = useCompletion({
    api: '/api/ai/dashboard',
    onError: (err) => {
      console.error('AI Insight Error:', err)
      setHasError(true)
    },
  })

  const hasStarted = useRef(false)

  useEffect(() => {
    if (hasStarted.current) return
    hasStarted.current = true

    complete('', {
      body: {
        totalSessions,
        delayedCount,
        delayedAmount,
        topTrigger,
        lateNightCount,
      },
    }).catch(() => setHasError(true))
  }, [complete, totalSessions, delayedCount, delayedAmount, topTrigger, lateNightCount])

  // Fallback text if AI server is offline or fails
  const fallbackText = lateNightCount > 0
    ? `${lateNightCount} dari ${totalSessions} sesi terjadi di waktu rawan larut malam (di atas jam 22:00). Cobalah menjauhi aplikasi e-commerce pada jam tersebut.`
    : `Pola belanjamu cukup baik bulan ini dengan pemicu utama ${topTrigger}. Pertahankan kesadaran menjeda!`

  return (
    <div className="flex flex-col gap-4 p-5 lg:p-8 rounded-2xl bg-[#E7F2EC] border border-[#265C4B]/20 shadow-soft-card relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-[#265C4B] font-bold text-sm lg:text-base">
          <Sparkles className="w-5 h-5 text-primary animate-pulse" />
          <span>Insight AI DompetJujur</span>
        </div>
        <Link 
          href="/chat"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-white hover:bg-white/80 px-3 py-1.5 rounded-full shadow-sm border border-[#265C4B]/20 transition-all active:scale-95"
        >
          <MessageSquare className="w-3.5 h-3.5" />
          <span>Tanya Teman AI</span>
        </Link>
      </div>

      <div className="text-sm lg:text-base text-[#265C4B] leading-relaxed font-medium min-h-[60px]">
        {hasError ? (
          <p>{fallbackText}</p>
        ) : isLoading && !completion ? (
          <div className="flex items-center space-x-2 animate-pulse text-[#265C4B]/70 py-2">
            <div className="w-2 h-2 bg-[#265C4B] rounded-full"></div>
            <div className="w-2 h-2 bg-[#265C4B] rounded-full animation-delay-200"></div>
            <div className="w-2 h-2 bg-[#265C4B] rounded-full animation-delay-400"></div>
            <span className="text-xs font-semibold">Membuat insight personalisasi...</span>
          </div>
        ) : (
          <p>
            {completion}
            {isLoading && (
              <span className="inline-block w-1.5 h-4 ml-1 bg-[#265C4B] animate-pulse align-middle"></span>
            )}
          </p>
        )}
      </div>
    </div>
  )
}
