'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Download, X } from 'lucide-react'

export function PwaInstallSidebarCard() {
  const [isDismissed, setIsDismissed] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  // In a real app, this would use the beforeinstallprompt event.
  // For the mockup, we simulate it being available but not installed.
  
  if (isDismissed || isInstalled) return null

  return (
    <div className="relative mt-4 mx-4 p-4 bg-[#E7F2EC] border border-[#265C4B]/20 rounded-2xl">
      <button 
        onClick={() => setIsDismissed(true)}
        className="absolute top-2 right-2 p-1 text-[#265C4B]/60 hover:text-[#265C4B] transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
      <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center mb-3 text-[#265C4B] shadow-sm">
        <Download className="w-4 h-4" />
      </div>
      <h4 className="text-sm font-bold text-[#265C4B] mb-1">Pasang Aplikasi</h4>
      <p className="text-xs text-[#265C4B]/80 mb-3 leading-tight">Tambahkan ke layar utama untuk akses lebih cepat.</p>
      <Button 
        onClick={() => {
          alert('Simulasi PWA Install prompt muncul!')
          setIsInstalled(true)
        }}
        size="sm" 
        className="w-full bg-[#265C4B] hover:bg-[#265C4B]/90 text-white rounded-xl text-xs font-bold"
      >
        Pasang
      </Button>
    </div>
  )
}

export function PwaInstallMobileBanner() {
  const [isDismissed, setIsDismissed] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)

  if (isDismissed || isInstalled) return null

  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 w-[90%] max-w-sm bg-white rounded-2xl shadow-floating-cta border border-border/50 p-4 flex flex-col gap-3 z-50 lg:hidden animate-in slide-in-from-bottom-10">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-[#E7F2EC] rounded-xl flex items-center justify-center shrink-0">
           <Download className="w-5 h-5 text-[#265C4B]" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-sm text-foreground">Tambahkan ke Layar Utama</p>
          <p className="text-xs text-muted-foreground mt-0.5">Akses DompetJujur lebih cepat dan bisa dipakai offline.</p>
        </div>
      </div>
      <div className="flex gap-2 mt-1">
        <Button 
          variant="outline" 
          className="flex-1 rounded-xl text-xs font-semibold h-9"
          onClick={() => setIsDismissed(true)}
        >
          Nanti
        </Button>
        <Button 
          className="flex-1 rounded-xl bg-primary text-primary-foreground text-xs font-bold h-9"
          onClick={() => {
            alert('Simulasi PWA Install prompt muncul!')
            setIsInstalled(true)
          }}
        >
          Pasang
        </Button>
      </div>
    </div>
  )
}
