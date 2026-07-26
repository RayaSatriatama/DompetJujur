'use client'

import { useState } from 'react'
import { Bell } from 'lucide-react'
import { NotificationSheet } from './notification-sheet'

interface NotificationTriggerProps {
  riskWindowLabel?: string
}

export function NotificationTrigger({ riskWindowLabel }: NotificationTriggerProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        aria-label="Pengaturan Notifikasi"
        className="p-2 -mr-2 rounded-full hover:bg-muted transition-colors relative group active:scale-95"
      >
        <Bell className="w-5 h-5 text-foreground group-hover:text-primary transition-colors" />
        <div className="absolute top-2 right-2.5 w-2 h-2 bg-destructive rounded-full"></div>
      </button>

      <NotificationSheet
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        riskWindowLabel={riskWindowLabel}
      />
    </>
  )
}
