'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { DownloadCloud, X } from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

export function PwaUpdateModal() {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Simulate update available after 30 seconds for mockup purposes
  // In a real app, this would listen to service worker update events
  useEffect(() => {
    const timer = setTimeout(() => {
      // Uncomment to simulate update available
      // setIsUpdateAvailable(true)
    }, 30000)
    return () => clearTimeout(timer)
  }, [])

  // Allow manual trigger via window for testing
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).simulatePwaUpdate = () => setIsUpdateAvailable(true)
    }
  }, [])

  const handleUpdate = () => {
    setIsUpdating(true)
    setTimeout(() => {
      setIsUpdating(false)
      setIsUpdateAvailable(false)
      alert('Aplikasi diperbarui! (simulasi memuat ulang halaman)')
      window.location.reload()
    }, 1500)
  }

  return (
    <Dialog open={isUpdateAvailable} onOpenChange={setIsUpdateAvailable}>
      <DialogContent className="sm:max-w-[400px] rounded-2xl w-[90%] p-6 bg-white border-border/50 shadow-floating-cta">
        <DialogHeader className="flex flex-col items-center justify-center pt-2">
          <div className="w-16 h-16 rounded-full bg-[#E7F2EC] flex items-center justify-center mb-4">
             <DownloadCloud className="w-8 h-8 text-[#265C4B]" />
          </div>
          <DialogTitle className="text-xl font-bold text-center">Pembaruan Tersedia</DialogTitle>
          <DialogDescription className="text-center pt-2 text-muted-foreground leading-relaxed">
            Versi terbaru DompetJujur siap digunakan. Perbarui sekarang untuk pengalaman yang lebih lancar dan fitur baru.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-6">
          <Button 
            className="w-full h-12 rounded-xl font-bold bg-[#265C4B] hover:bg-[#265C4B]/90 text-white"
            onClick={handleUpdate}
            disabled={isUpdating}
          >
            {isUpdating ? 'Memperbarui...' : 'Perbarui sekarang'}
          </Button>
          <Button 
            variant="ghost" 
            className="w-full h-12 rounded-xl font-bold text-muted-foreground"
            onClick={() => setIsUpdateAvailable(false)}
            disabled={isUpdating}
          >
            Nanti saja
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
