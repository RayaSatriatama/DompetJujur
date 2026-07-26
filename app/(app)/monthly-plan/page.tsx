import { createClient } from '@/lib/supabase/server'
import { getMonthKey } from '@/lib/utils'
import { formatRupiah } from '@/lib/formatters'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Pencil, Info, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function MonthlyPlanPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const monthKey = getMonthKey()
  const { data: monthlyPlan } = await supabase
    .from('monthly_plans')
    .select('*')
    .eq('user_id', user.id)
    .eq('month_key', monthKey)
    .single() as { data: any }

  if (!monthlyPlan) {
    redirect('/onboarding')
  }

  const income = monthlyPlan.income
  const obligations = monthlyPlan.obligations
  const debt = monthlyPlan.debt_payments
  const buffer = obligations * 0.2 // arbitrary buffer for display if not saved
  const totalAllocated = obligations + debt + buffer
  const flexible = income - totalAllocated

  const pctWajib = Math.round(((obligations + debt) / income) * 100) || 0
  const pctBuffer = Math.round((buffer / income) * 100) || 0
  const pctFleksibel = 100 - pctWajib - pctBuffer

  return (
    <div className="flex flex-col flex-1 p-6 pb-24 lg:pb-6 lg:p-12 space-y-6 lg:space-y-10 animate-in fade-in bg-white lg:bg-[#F9FAFB] min-h-screen">
      <header className="relative flex items-center justify-between pt-2">
        <div className="flex items-center">
          <Link href="/home" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors lg:hidden">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <h1 className="text-xl lg:text-2xl font-bold tracking-tight ml-2 lg:ml-0">Rencana uang bulan ini</h1>
        </div>
        <button className="p-2 -mr-2 rounded-full hover:bg-muted transition-colors lg:hidden">
          <Pencil className="w-5 h-5 text-foreground" />
        </button>
      </header>

      <div className="flex flex-col lg:flex-row lg:gap-16 flex-1">
        
        {/* Left Column (Desktop) / Top Section (Mobile) */}
        <div className="flex-1 space-y-6 lg:space-y-10">
          <div className="grid grid-cols-3 gap-3">
            <div className="flex flex-col items-center justify-center p-3 lg:p-5 rounded-2xl border border-border/50 shadow-soft-card bg-white">
              <span className="text-[10px] lg:text-xs text-muted-foreground font-medium mb-1">Pendapatan</span>
              <span className="text-sm lg:text-base font-bold text-foreground truncate w-full text-center px-1">
                {formatRupiah(income).replace('Rp', 'Rp ')}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 lg:p-5 rounded-2xl border border-border/50 shadow-soft-card bg-white">
              <span className="text-[10px] lg:text-xs text-muted-foreground font-medium mb-1">Dialokasikan</span>
              <span className="text-sm lg:text-base font-bold text-foreground truncate w-full text-center px-1">
                {formatRupiah(totalAllocated).replace('Rp', 'Rp ')}
              </span>
            </div>
            <div className="flex flex-col items-center justify-center p-3 lg:p-5 rounded-2xl border border-border/50 shadow-soft-card bg-white">
              <span className="text-[10px] lg:text-xs text-muted-foreground font-medium mb-1">Uang fleksibel</span>
              <span className="text-sm lg:text-base font-bold text-foreground truncate w-full text-center px-1">
                {formatRupiah(flexible).replace('Rp', 'Rp ')}
              </span>
            </div>
          </div>

          <div className="space-y-4 pt-4 lg:pt-0 pb-2 border-b border-border/50 lg:border-none">
            <div className="flex h-10 lg:h-12 w-full rounded-xl overflow-hidden text-xs lg:text-sm font-bold text-white text-center">
              <div className="bg-primary flex items-center justify-center" style={{ width: `${pctWajib}%` }}>{pctWajib}%</div>
              <div className="bg-[#8CC6A5] flex items-center justify-center text-foreground" style={{ width: `${pctBuffer}%` }}>{pctBuffer}%</div>
              <div className="bg-[#5D80A6] flex items-center justify-center" style={{ width: `${pctFleksibel}%` }}>{pctFleksibel}%</div>
            </div>
            
            <div className="flex justify-center gap-6 text-xs lg:text-sm font-medium text-muted-foreground pt-2">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-primary"></div>
                Wajib
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#8CC6A5]"></div>
                Buffer
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#5D80A6]"></div>
                Fleksibel
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-start gap-3 p-5 rounded-xl border border-border/60 bg-muted/20 w-max">
            <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground leading-relaxed">
              Uang fleksibel bukan rekomendasi belanja.
            </p>
          </div>
        </div>

        {/* Right Column (Desktop) / Bottom Section (Mobile) */}
        <div className="flex-1 flex flex-col mt-6 lg:mt-0 lg:bg-white lg:p-8 lg:rounded-3xl lg:shadow-sm lg:border lg:border-border/50">
          <div className="space-y-4 lg:space-y-6">
            {[
              { label: 'Pendapatan', val: income },
              { label: 'Kebutuhan wajib', val: obligations },
              { label: 'Cicilan', val: debt },
              { label: 'Buffer aman', val: buffer },
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between py-2 border-b border-border/30 last:border-0 lg:border-border/60 lg:pb-4">
                <span className="text-sm lg:text-base text-foreground font-medium lg:font-normal">{item.label}</span>
                <div className="flex items-center gap-4">
                  <span className="text-sm lg:text-base font-bold lg:font-medium">{formatRupiah(item.val)}</span>
                  <button className="text-muted-foreground hover:text-foreground">
                    <Pencil className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex lg:hidden items-start gap-3 p-4 rounded-xl border border-border/60 bg-muted/20 mt-6">
            <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              Uang fleksibel bukan rekomendasi belanja.
            </p>
          </div>

          <div className="pt-8 mt-auto w-full lg:pt-12">
            <Button className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-soft-card">
              Simpan rencana
            </Button>
          </div>
        </div>

      </div>
    </div>
  )
}
