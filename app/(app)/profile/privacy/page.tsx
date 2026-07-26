import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ShieldCheck, BarChart3, Clock, Sparkles, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { signOut } from '@/modules/auth/actions'
import { PrivacyActions } from '@/components/privacy-actions'

export default async function PrivacyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <div className="flex flex-col flex-1 p-6 pb-24 space-y-8 animate-in fade-in duration-500 bg-white min-h-screen">
      <header className="relative flex items-center justify-center pt-2 mb-4">
        <Link href="/profile" className="absolute left-0 p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
        <h1 className="text-xl font-bold tracking-tight">Privasi & data</h1>
      </header>

      <div className="flex-1 flex flex-col items-center">
        <div className="w-20 h-20 bg-[#E7F2EC] rounded-full flex items-center justify-center mb-6 shadow-sm border border-success/20">
          <ShieldCheck className="w-10 h-10 text-success" strokeWidth={2.5} />
        </div>
        
        <h2 className="text-xl font-bold text-center leading-snug mb-8 max-w-[280px]">
          DompetJujur tidak membutuhkan akses rekening bank.
        </h2>

        <div className="w-full space-y-6">
          <div>
            <p className="text-sm font-medium text-muted-foreground mb-4">
              Kami hanya menyimpan data berikut dengan aman:
            </p>
            <div className="space-y-4">
              <div className="flex items-center gap-4 text-foreground">
                <BarChart3 className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-sm">Baseline keuangan</span>
              </div>
              <div className="flex items-center gap-4 text-foreground">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-sm">Riwayat Jeda</span>
              </div>
              <div className="flex items-center gap-4 text-foreground">
                <Sparkles className="w-5 h-5 text-muted-foreground" />
                <span className="font-medium text-sm">Refleksi pilihanmu</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 rounded-xl border border-border/60 bg-muted/20">
            <Lock className="w-6 h-6 text-muted-foreground shrink-0" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Data hanya digunakan untuk menampilkan konteks dan pola milikmu.
            </p>
          </div>
        </div>

        <PrivacyActions />

        <form action={async () => {
          'use server'
          await signOut()
        }} className="w-full">
          <Button type="submit" variant="ghost" className="w-full text-muted-foreground">
            Keluar dari aplikasi
          </Button>
        </form>
      </div>
    </div>
  )
}
