'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, PauseCircle, ClipboardList, User, ShieldCheck, HelpCircle, Settings, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import { PwaInstallSidebarCard } from '@/components/pwa-install'

export function SidebarNav() {
  const pathname = usePathname()

  const mainTabs = [
    { name: 'Beranda', href: '/home', icon: Home },
    { name: 'Jeda', href: '/pause/new', icon: PauseCircle },
    { name: 'Riwayat', href: '/history', icon: ClipboardList },
    { name: 'Saya', href: '/profile', icon: User },
  ]

  const bottomTabs = [
    { name: 'Bantuan', href: '/help', icon: HelpCircle },
    { name: 'Pengaturan', href: '/settings', icon: Settings },
  ]

  // Hide nav on specific intervention pages? 
  // Wait, the mockup shows the Sidebar IS VISIBLE during Nominal & Trigger, but NOT visible during the Timer!
  // Mockup 04 shows Desktop Timer: The Sidebar is GONE. It's a clean slate.
  // Mockup 05 Keputusan: Sidebar is GONE.
  // So we hide the sidebar if the pathname is /pause/[id]/* EXCEPT /pause/new.
  
  const isInterventionFlow = 
    pathname?.includes('/pause/') && 
    !pathname?.includes('/pause/new')

  if (isInterventionFlow) return null

  return (
    <aside className="hidden lg:flex flex-col w-64 h-screen fixed left-0 top-0 border-r border-border/40 bg-[#F8FAFC]">
      <div className="p-6 pb-8">
        <Link href="/home" className="flex items-center gap-2 text-primary font-bold text-xl">
          <ShieldCheck className="w-6 h-6" strokeWidth={2.5} />
          <span>DompetJujur</span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-2">
        {mainTabs.map((tab) => {
          const isActive = pathname === tab.href || (pathname?.startsWith(tab.href + '/') && tab.href !== '/home')
          const Icon = tab.icon

          return (
            <Link 
              key={tab.name} 
              href={tab.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative",
                isActive 
                  ? "bg-muted/60 text-foreground font-semibold" 
                  : "text-muted-foreground hover:bg-muted/40 hover:text-foreground font-medium"
              )}
            >
              {isActive && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-primary rounded-r-full" />
              )}
              <Icon className={cn("w-5 h-5", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {tab.name}
            </Link>
          )
        })}
      </nav>

      <div className="pb-2">
        <PwaInstallSidebarCard />
      </div>

      <div className="p-4 space-y-2">
        {bottomTabs.map((tab) => {
          const Icon = tab.icon
          return (
            <Link 
              key={tab.name} 
              href={tab.href}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-muted-foreground hover:bg-muted/40 hover:text-foreground font-medium"
            >
              <Icon className="w-5 h-5" />
              {tab.name}
            </Link>
          )
        })}
        <button 
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-muted-foreground hover:bg-muted/40 hover:text-foreground font-medium mt-4"
        >
          <LogOut className="w-5 h-5" />
          Keluar
        </button>
      </div>
    </aside>
  )
}
