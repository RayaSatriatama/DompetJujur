import * as React from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { BottomNav } from '@/components/bottom-nav'
import { SidebarNav } from '@/components/sidebar-nav'
import { PwaInstallMobileBanner } from '@/components/pwa-install'
import { PwaUpdateModal } from '@/components/pwa-update-modal'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <SidebarNav />
      
      <div className="flex-1 flex flex-col lg:ml-64 w-full h-full relative pb-16 sm:pb-0 lg:pb-0">
        <main className="flex-1 flex flex-col w-full h-full relative">
          {children}
        </main>

        <PwaUpdateModal />

        <div className="lg:hidden">
          <PwaInstallMobileBanner />
          <BottomNav />
        </div>
      </div>
    </div>
  )
}
