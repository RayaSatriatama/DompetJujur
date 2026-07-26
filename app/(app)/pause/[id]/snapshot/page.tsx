import { getAuthUser } from '../../../../../lib/supabase/auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatRupiah } from '@/lib/formatters'
import { getMonthKey } from '@/lib/utils'
import { ArrowLeft, PieChart, Bus, Leaf } from 'lucide-react'

export default async function SnapshotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await getAuthUser()
  if (!user) redirect('/login')

  const { data: session } = await supabase
    .from('pause_sessions')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single() as { data: any }

  if (!session) redirect('/home')
  if (session.outcome) redirect(`/pause/${session.id}/outcome`)

  const monthKey = getMonthKey()
  const { data: monthlyPlan } = await supabase
    .from('monthly_plans')
    .select('*')
    .eq('user_id', user.id)
    .eq('month_key', monthKey)
    .single() as { data: any }

  const flexible = monthlyPlan?.flexible_amount || 0
  
  // Calculate percentage of flexible budget
  const percentage = flexible > 0 ? Math.min(100, Math.round((session.amount / flexible) * 100)) : 100
  
  // Rough estimate for transport days (assuming Rp50.000 per day)
  const transportCostPerDay = 50000
  const transportDays = Math.round(session.amount / transportCostPerDay)

  return (
    <div className="flex flex-col flex-1 p-6 pb-24 space-y-8 animate-in fade-in bg-white min-h-screen">
      <header className="relative flex items-center justify-center pt-2">
        <Link href={`/pause/new`} className="absolute left-0 p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </Link>
      </header>

      <div className="space-y-1 mt-4">
        <p className="text-sm font-medium text-muted-foreground">Nominal yang kamu masukkan</p>
        <h1 className="text-5xl font-bold tracking-tight text-foreground">
          {formatRupiah(session.amount)}
        </h1>
      </div>

      <div className="space-y-4 pt-4">
        {/* Percentage Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-border/50 shadow-soft-card">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 text-primary flex-shrink-0">
            <PieChart className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium leading-relaxed">
            <span className="text-lg font-bold text-primary block mb-0.5">{percentage}%</span>
            dari ruang uang fleksibelmu bulan ini.
          </p>
        </div>

        {/* Transport Equivalent Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-border/50 shadow-soft-card">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-100 text-slate-600 flex-shrink-0">
            <Bus className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium leading-relaxed text-muted-foreground">
            Setara dengan <span className="font-bold text-foreground">± {transportDays} hari</span> budget transportmu
          </p>
        </div>

        {/* Reassurance Card */}
        <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-border/50 shadow-soft-card">
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/5 text-primary/70 flex-shrink-0">
            <Leaf className="w-6 h-6" />
          </div>
          <p className="text-sm font-medium leading-relaxed text-muted-foreground">
            Tidak ada keputusan yang perlu dibuat di layar ini.
          </p>
        </div>
      </div>

      <div className="flex flex-col space-y-4 pt-8 mt-auto">
        <Button asChild size="lg" className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-soft-card">
          <Link href={`/pause/${session.id}/timer`}>Mulai jeda 90 detik</Link>
        </Button>
        <Link href={`/pause/new`} className="w-full">
          <Button variant="ghost" className="w-full text-primary hover:bg-primary/10 hover:text-primary font-medium">
            Ubah nominal
          </Button>
        </Link>
      </div>
    </div>
  )
}
