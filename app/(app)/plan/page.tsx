'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateProfileAction } from '@/modules/profile/actions'
import { submitFinancialBaselineAction } from '@/modules/financial-baseline/actions'
import { saveMonthlyPlanAction } from '@/modules/monthly-plan/actions'
import { isErr } from '@/lib/result'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Briefcase, Moon, CalendarDays, TrendingDown, CreditCard, MoreHorizontal, Check } from 'lucide-react'
import Link from 'next/link'

const RISK_WINDOWS = [
  { id: 'after_work', label: 'Setelah kerja', icon: Briefcase },
  { id: 'late_night', label: 'Larut malam', icon: Moon },
  { id: 'payday', label: 'Setelah gajian', icon: CalendarDays },
  { id: 'after_loss', label: 'Setelah rugi', icon: TrendingDown },
  { id: 'limit_available', label: 'Saat limit tersedia', icon: CreditCard },
  { id: 'other', label: 'Lainnya', icon: MoreHorizontal },
]

export default function PlanPage() {
  const [riskWindow, setRiskWindow] = useState<string>('late_night') // default as per mockup
  const [payday, setPayday] = useState<string>('25')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    setLoading(true)
    setError(null)

    try {
      // Get baseline from local storage
      const incomeStr = localStorage.getItem('dj_onboarding_income')
      const mandatoryStr = localStorage.getItem('dj_onboarding_mandatory')
      const debtStr = localStorage.getItem('dj_onboarding_debt')

      if (incomeStr && mandatoryStr && debtStr) {
        const income = parseInt(incomeStr, 10)
        const mandatory = parseInt(mandatoryStr, 10)
        const debt = parseInt(debtStr, 10)

        // Save Baseline
        const baselineResult = await submitFinancialBaselineAction({
          monthly_income: income,
          mandatory_expenses: mandatory,
          debt_payments: debt,
          income_variable: false,
        })

        if (!isErr(baselineResult)) {
          // Save Monthly Plan
          await saveMonthlyPlanAction({
            income,
            mandatory,
            debt,
            safety_buffer: 0,
          })
        }
      }

      // Save Profile info
      const profileResult = await updateProfileAction({
        nickname: null, // Removed from onboarding UI
        payday_day: parseInt(payday, 10),
        primary_risk_window: riskWindow,
      })

      if (isErr(profileResult)) {
        setError(profileResult.error)
        setLoading(false)
        return
      }

      // Clear local storage and redirect
      localStorage.removeItem('dj_onboarding_income')
      localStorage.removeItem('dj_onboarding_mandatory')
      localStorage.removeItem('dj_onboarding_debt')

      router.push('/home')
      router.refresh()
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan jaringan atau server. Silakan coba lagi.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Mobile/Tablet View (hidden on lg) */}
      <div className="lg:hidden flex flex-col min-h-screen p-6 bg-white animate-in fade-in slide-in-from-right-8 duration-500 w-full">
        <header className="relative flex items-center justify-center pt-2 mb-8">
          <Link href="/onboarding" className="absolute left-0 p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Langkah 2 dari 2</span>
            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="w-full h-full bg-primary rounded-full"></div>
            </div>
          </div>
        </header>

        <div className="flex-1 w-full max-w-sm mx-auto flex flex-col">
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Kapan kamu paling rawan impulsif?
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Pilih waktu yang paling sering membuatmu menyesal setelahnya.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8 flex flex-col flex-1">
            {error && <div className="text-sm text-destructive font-medium">{error}</div>}
            
            <div className="grid grid-cols-2 gap-3">
              {RISK_WINDOWS.map((item) => {
                const Icon = item.icon
                const isSelected = riskWindow === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setRiskWindow(item.id)}
                    className={`relative flex flex-col items-center justify-center gap-2 p-4 rounded-xl border text-sm transition-all duration-200 ${
                      isSelected 
                        ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                        : 'border-border/60 text-muted-foreground hover:bg-muted/30'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-primary rounded-full p-0.5">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`font-medium text-center ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-between border-t border-border/50 pt-6">
              <label htmlFor="payday-mobile" className="text-sm font-semibold text-foreground">
                Tanggal gajian (opsional)
              </label>
              <div className="relative">
                <select
                  id="payday-mobile"
                  value={payday}
                  onChange={(e) => setPayday(e.target.value)}
                  className="appearance-none bg-muted/30 border border-border/60 rounded-xl px-4 py-2 pr-8 text-sm font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary"
                >
                  {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
                <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                </div>
              </div>
            </div>

            <div className="pt-6 mt-auto pb-4">
              <Button type="submit" className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-soft-card" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Selesai & masuk'}
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Desktop View (visible on lg) */}
      <div className="hidden lg:flex w-full h-screen">
        {/* Left Column */}
        <div className="w-[45%] h-full bg-[#F8FAFC] flex flex-col pt-12 px-16 relative overflow-hidden">
          <div className="flex items-center gap-2 text-primary font-bold text-xl mb-16">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>DompetJujur</span>
          </div>

          <div className="max-w-md space-y-8 z-10 flex flex-col justify-center h-full pb-32">
            <div className="w-20 h-20 bg-white rounded-2xl shadow-sm border border-border/50 flex items-center justify-center text-primary mb-2 relative">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-10 h-10"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <div className="absolute -bottom-2 -right-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-primary bg-white rounded-full"><path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/></svg>
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight leading-[1.1] text-foreground">
              Kenali waktumu, kuatkan kendalimu.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Waktu rawan membantumu menyiapkan jeda yang lebih relevan dan efektif.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 text-muted-foreground">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span className="text-sm">Pilihan ini opsional.</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span className="text-sm">Kami tidak menyimpan tanggal tertentu.</span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5 shrink-0"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span className="text-sm">Semua data terenkripsi dan privat.</span>
              </div>
            </div>

            <div className="pt-8">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#E7F2EC]/50 border border-success/10">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-primary shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  DompetJujur tidak meminta akses rekening bank dan tidak menyimpan data sensitif di perangkat ini.
                </p>
              </div>
            </div>
          </div>
          
          <div className="absolute -left-24 bottom-0 opacity-10 pointer-events-none w-96 h-96 text-primary">
            <svg viewBox="0 0 200 200" fill="currentColor"><path d="M45.7,117.8c0-38.3,27.1-70.8,63.9-78.5c1.1-0.2,2.3-0.4,3.4-0.5c11.9-1.5,23.3-0.5,33.5,2.4c17.2,4.8,31.2,15.8,39,30 c1.1,2.1,2.1,4.3,3,6.5c2.6,6.7,4.3,14.1,4.7,21.9c0.9,15.5-3.3,30.3-11.2,42.7c-7.9,12.4-19.6,22.1-33.3,27.6 c-13.8,5.4-29.3,6.1-43.8,1.7C90,167.3,77.7,157.9,69,145.4c-4.4-6.3-7.9-13.4-10.2-21.1c-1.4-4.6-2.5-9.3-3.1-14.3 C55.3,107.5,55.5,104.9,56,102.3C50,105.7,45.7,111.4,45.7,117.8z"/></svg>
          </div>
        </div>

        {/* Right Column */}
        <div className="w-[55%] h-full bg-white flex flex-col items-center justify-center p-12 relative border-l border-border/40 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)]">
          <div className="absolute top-8 right-8">
            <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              Bantuan
            </button>
          </div>

          <div className="w-full max-w-lg bg-white rounded-[32px] p-10 border border-border/50 shadow-soft-card">
            <div className="space-y-2 mb-8">
              <h1 className="text-3xl font-bold tracking-tight text-foreground">
                Kapan kamu paling rawan impulsif?
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Pilih waktu yang paling sering membuatmu menyesal setelahnya.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {error && <div className="text-sm text-destructive font-medium">{error}</div>}
              
              <div className="grid grid-cols-2 gap-4">
                {RISK_WINDOWS.map((item) => {
                  const Icon = item.icon
                  const isSelected = riskWindow === item.id
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setRiskWindow(item.id)}
                      className={`relative flex items-center gap-3 p-4 rounded-xl border transition-all duration-200 ${
                        isSelected 
                          ? 'border-primary bg-primary/5 text-primary shadow-sm ring-1 ring-primary' 
                          : 'border-border/60 text-muted-foreground hover:bg-muted/30 hover:border-border'
                      }`}
                    >
                      <Icon className={`w-5 h-5 shrink-0 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                      <span className={`font-medium text-sm text-left ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                        {item.label}
                      </span>
                    </button>
                  )
                })}
              </div>

              <div className="pt-2">
                <div className="flex flex-col space-y-2">
                  <label htmlFor="payday-desk" className="text-sm font-semibold text-foreground">
                    Tanggal gajian (opsional)
                  </label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    </div>
                    <select
                      id="payday-desk"
                      value={payday}
                      onChange={(e) => setPayday(e.target.value)}
                      className="appearance-none w-full bg-muted/5 border border-border/60 rounded-xl pl-12 pr-10 py-4 text-sm font-bold focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                    >
                      {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                        <option key={day} value={day}>{day}</option>
                      ))}
                    </select>
                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <Button type="submit" className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-soft-card" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Selesai & masuk'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
