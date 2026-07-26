'use client'

import { useState, useEffect } from 'react'
import { Bell, ShieldCheck, Check, Clock, Sparkles, X } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface NotificationSheetProps {
  isOpen: boolean
  onClose: () => void
  riskWindowLabel?: string
}

export function NotificationSheet({ isOpen, onClose, riskWindowLabel = 'Larut Malam (22:00)' }: NotificationSheetProps) {
  const [permission, setPermission] = useState<NotificationPermission | 'unsupported'>('default')
  const [riskReminder, setRiskReminder] = useState(true)
  const [paydayReminder, setPaydayReminder] = useState(true)
  const [testSent, setTestSent] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      setPermission(Notification.permission)
    } else {
      setPermission('unsupported')
    }
  }, [])

  if (!isOpen) return null

  const handleRequestPermission = async () => {
    if (typeof window !== 'undefined' && 'Notification' in window) {
      try {
        const res = await Notification.requestPermission()
        setPermission(res)
        if (res === 'granted') {
          // Send instant test notification
          new Notification('DompetJujur', {
            body: 'Notifikasi aktif! Kami akan mengingatkanmu di jam rawan untuk membuat jarak 90 detik.',
            icon: '/favicon.ico',
          })
          setTestSent(true)
          setTimeout(() => setTestSent(false), 4000)
        }
      } catch (err) {
        console.error('Permission error:', err)
      }
    }
  }

  const handleSendTestNotification = () => {
    if (typeof window !== 'undefined' && 'Notification' in window && Notification.permission === 'granted') {
      new Notification('DompetJujur • Pengingat Jeda', {
        body: 'Lagi ada dorongan belanja impulsif? Beri dirimu jeda 90 detik di DompetJujur.',
        icon: '/favicon.ico',
      })
      setTestSent(true)
      setTimeout(() => setTestSent(false), 4000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in">
      <div className="w-full sm:max-w-md bg-white rounded-t-[32px] sm:rounded-[32px] p-6 space-y-6 shadow-xl border border-border/60 animate-in slide-in-from-bottom-6">
        
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#E7F2EC] flex items-center justify-center text-primary shadow-sm">
              <Bell className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-foreground tracking-tight">Notifikasi & Pengingat</h3>
              <p className="text-xs text-muted-foreground">Kelola pengingat jam rawan belanja</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-muted text-muted-foreground transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status Permission Banner */}
        <div className="p-4 rounded-2xl bg-[#F8FAFC] border border-border/60 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status Peramban</span>
            <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${
              permission === 'granted'
                ? 'bg-success/10 text-success'
                : permission === 'denied'
                ? 'bg-destructive/10 text-destructive'
                : 'bg-amber-500/10 text-amber-600'
            }`}>
              {permission === 'granted' ? 'Aktif' : permission === 'denied' ? 'Ditolak' : 'Belum Dijinkan'}
            </span>
          </div>

          {permission !== 'granted' && (
            <Button
              onClick={handleRequestPermission}
              className="w-full h-11 rounded-xl text-xs font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
            >
              Izinkan Notifikasi Peramban
            </Button>
          )}

          {permission === 'granted' && (
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-muted-foreground">Uji coba pengingat langsung</span>
              <button
                onClick={handleSendTestNotification}
                className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Kirim Tes Notifikasi</span>
              </button>
            </div>
          )}

          {testSent && (
            <div className="p-2.5 rounded-xl bg-success/10 text-success text-xs font-semibold flex items-center gap-2 animate-in fade-in">
              <Check className="w-4 h-4" />
              <span>Notifikasi tes berhasil dikirim ke perangkatmu!</span>
            </div>
          )}
        </div>

        {/* Reminder Options */}
        <div className="space-y-4 pt-1">
          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border/50 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-muted/60 flex items-center justify-center text-foreground">
                <Clock className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-foreground">Pengingat Jam Rawan</p>
                <p className="text-[11px] text-muted-foreground">{riskWindowLabel}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setRiskReminder(!riskReminder)}
              className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors ${
                riskReminder ? 'bg-primary justify-end' : 'bg-muted justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>

          <div className="flex items-center justify-between p-3.5 rounded-2xl border border-border/50 bg-white shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-muted/60 flex items-center justify-center text-foreground">
                <Bell className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs sm:text-sm font-bold text-foreground">Pengingat Evaluasi Gajian</p>
                <p className="text-[11px] text-muted-foreground">Pengingat menyusun ruang uang gajian</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setPaydayReminder(!paydayReminder)}
              className={`w-11 h-6 flex items-center rounded-full p-0.5 transition-colors ${
                paydayReminder ? 'bg-primary justify-end' : 'bg-muted justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-sm" />
            </button>
          </div>
        </div>

        {/* Footer Privacy Note */}
        <div className="flex items-center gap-2 p-3 rounded-xl bg-[#E7F2EC] text-[#265C4B] text-xs font-medium">
          <ShieldCheck className="w-4 h-4 shrink-0" />
          <span>Notifikasi berjalan di perangkatmu tanpa melacak data pribadi.</span>
        </div>

        <Button
          onClick={onClose}
          variant="outline"
          className="w-full h-11 rounded-xl text-xs font-bold border-border/60"
        >
          Tutup
        </Button>
      </div>
    </div>
  )
}
