'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PauseCircle, ClipboardList, User } from 'lucide-react'
import { cn } from '@/lib/utils'

export function BottomNav() {
  const pathname = usePathname()

  const tabs = [
    { name: 'Beranda', href: '/home', icon: Home },
    { name: 'Jeda', href: '/pause/new', icon: PauseCircle },
    { name: 'Riwayat', href: '/history', icon: ClipboardList },
    { name: 'Saya', href: '/profile', icon: User },
  ]

  // Hide nav on specific intervention pages to prevent distraction
  const isInterventionFlow = 
    pathname?.includes('/pause/') && 
    !pathname?.includes('/pause/new')

  if (isInterventionFlow) return null

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-xl border-t border-border/50 safe-area-pb">
      <div className="flex items-center justify-around w-full h-16 max-w-md mx-auto px-4">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || pathname?.startsWith(tab.href + '/') && tab.href !== '/home'
          const Icon = tab.icon

          return (
            <Link 
              key={tab.name} 
              href={tab.href}
              className="flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors"
            >
              <div className={cn(
                "p-1 rounded-full transition-all duration-300",
                isActive ? "bg-primary text-primary-foreground scale-110 shadow-md" : "text-muted-foreground hover:bg-muted"
              )}>
                <Icon className={cn("w-5 h-5", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
              </div>
              <span className={cn(
                "text-[10px] font-medium transition-colors",
                isActive ? "text-primary font-bold" : "text-muted-foreground"
              )}>
                {tab.name}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
