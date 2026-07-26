'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MoneyInput } from '@/components/money-input'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function OnboardingPage() {
  const [income, setIncome] = useState<string>('')
  const [mandatory, setMandatory] = useState<string>('')
  const [debt, setDebt] = useState<string>('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '')
    setIncome(rawValue ? new Intl.NumberFormat('id-ID').format(parseInt(rawValue, 10)) : '')
  }
  
  const handleMandatoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '')
    setMandatory(rawValue ? new Intl.NumberFormat('id-ID').format(parseInt(rawValue, 10)) : '')
  }
  
  const handleDebtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '')
    setDebt(rawValue ? new Intl.NumberFormat('id-ID').format(parseInt(rawValue, 10)) : '')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!income || !mandatory || !debt) {
      setError('Semua field harus diisi. Isi 0 jika tidak ada.')
      return
    }

    // Pass data via localStorage or just state if it was a context.
    // For simplicity, we'll store it in localStorage temporarily to submit it together in step 2.
    // Or, we can just save Baseline and Monthly Plan here and move to step 2!
    // Since we need to call API, let's just save to localStorage for the multi-step form to avoid partial data in DB.
    
    const numericIncome = parseInt(income.replace(/[^0-9]/g, ''), 10)
    const numericMandatory = parseInt(mandatory.replace(/[^0-9]/g, ''), 10)
    const numericDebt = parseInt(debt.replace(/[^0-9]/g, ''), 10)

    localStorage.setItem('dj_onboarding_income', numericIncome.toString())
    localStorage.setItem('dj_onboarding_mandatory', numericMandatory.toString())
    localStorage.setItem('dj_onboarding_debt', numericDebt.toString())
    
    router.push('/plan')
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Mobile/Tablet View (hidden on lg) */}
      <div className="lg:hidden flex flex-col min-h-screen p-6 bg-white animate-in fade-in w-full">
        <header className="relative flex items-center justify-center pt-2 mb-8">
          <Link href="/login" className="absolute left-0 p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Langkah 1 dari 2</span>
            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className="w-1/2 h-full bg-primary rounded-full"></div>
            </div>
          </div>
        </header>

        <div className="flex-1 w-full max-w-sm mx-auto flex flex-col">
          <div className="space-y-2 mb-10">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Biar angka punya konteks
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">
              Cukup estimasi. DompetJujur tidak perlu melihat rekeningmu.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6 flex-1 flex flex-col">
            {error && <div className="mb-4 text-sm text-destructive font-medium">{error}</div>}
            
            <div className="flex flex-col space-y-2">
              <label htmlFor="income-mobile" className="text-sm font-semibold shrink-0">Pendapatan bulanan</label>
              <div className="relative w-full">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</div>
                <input
                  id="income-mobile"
                  type="text"
                  inputMode="numeric"
                  value={income}
                  onChange={handleIncomeChange}
                  placeholder="0"
                  className="w-full h-14 pl-10 pr-4 font-bold rounded-xl border border-border/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-muted/10 text-lg"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label htmlFor="mandatory-mobile" className="text-sm font-semibold shrink-0">Kebutuhan wajib</label>
              <div className="relative w-full">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</div>
                <input
                  id="mandatory-mobile"
                  type="text"
                  inputMode="numeric"
                  value={mandatory}
                  onChange={handleMandatoryChange}
                  placeholder="0"
                  className="w-full h-14 pl-10 pr-4 font-bold rounded-xl border border-border/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-muted/10 text-lg"
                  required
                />
              </div>
            </div>

            <div className="flex flex-col space-y-2 pt-2">
              <label htmlFor="debt-mobile" className="text-sm font-semibold shrink-0">Cicilan / paylater</label>
              <div className="relative w-full">
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</div>
                <input
                  id="debt-mobile"
                  type="text"
                  inputMode="numeric"
                  value={debt}
                  onChange={handleDebtChange}
                  placeholder="0"
                  className="w-full h-14 pl-10 pr-4 font-bold rounded-xl border border-border/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-muted/10 text-lg"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                Masukkan estimasi wajar. Kamu bisa ubah kapan saja.
              </p>
            </div>

            <div className="pt-8 mt-auto mb-4">
              <Button type="submit" className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-soft-card" disabled={loading}>
                {loading ? 'Menyimpan...' : 'Lanjut'}
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

          <div className="max-w-md space-y-8 z-10">
            <div className="space-y-3">
              <span className="text-sm font-bold text-primary uppercase tracking-wider">Langkah 1 dari 2</span>
              <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                <div className="w-1/2 h-full bg-primary rounded-full"></div>
              </div>
            </div>

            <h1 className="text-4xl font-bold tracking-tight leading-[1.1] text-foreground pt-4">
              Biar angka punya konteks
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Cukup estimasi. DompetJujur tidak perlu melihat rekeningmu.
            </p>

            <div className="pt-8">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#E7F2EC]/50 border border-success/10">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-primary shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  Estimasi tetap milikmu. Kami hanya menyimpan data di perangkat ini dan tidak mengakses rekening bank mana pun.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-auto -ml-8 opacity-40">
            <svg viewBox="0 0 200 200" fill="currentColor" className="w-64 h-64 text-muted-foreground"><path d="M45.7,117.8c0-38.3,27.1-70.8,63.9-78.5c1.1-0.2,2.3-0.4,3.4-0.5c11.9-1.5,23.3-0.5,33.5,2.4c17.2,4.8,31.2,15.8,39,30 c1.1,2.1,2.1,4.3,3,6.5c2.6,6.7,4.3,14.1,4.7,21.9c0.9,15.5-3.3,30.3-11.2,42.7c-7.9,12.4-19.6,22.1-33.3,27.6 c-13.8,5.4-29.3,6.1-43.8,1.7C90,167.3,77.7,157.9,69,145.4c-4.4-6.3-7.9-13.4-10.2-21.1c-1.4-4.6-2.5-9.3-3.1-14.3 C55.3,107.5,55.5,104.9,56,102.3C50,105.7,45.7,111.4,45.7,117.8z"/></svg>
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

          <div className="w-full max-w-md bg-white rounded-[32px] p-10 border border-border/50 shadow-soft-card">
            <form onSubmit={handleSubmit} className="space-y-8">
              {error && <div className="mb-4 text-sm text-destructive font-medium">{error}</div>}
              
              <div className="flex flex-col space-y-2">
                <label htmlFor="income-desk" className="text-sm font-semibold">Pendapatan bulanan</label>
                <div className="relative w-full">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</div>
                  <input
                    id="income-desk"
                    type="text"
                    inputMode="numeric"
                    value={income}
                    onChange={handleIncomeChange}
                    placeholder="6.000.000"
                    className="w-full h-14 pl-12 pr-4 font-bold rounded-xl border border-border/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-muted/5 text-lg"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="mandatory-desk" className="text-sm font-semibold">Kebutuhan wajib</label>
                <div className="relative w-full">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</div>
                  <input
                    id="mandatory-desk"
                    type="text"
                    inputMode="numeric"
                    value={mandatory}
                    onChange={handleMandatoryChange}
                    placeholder="3.600.000"
                    className="w-full h-14 pl-12 pr-4 font-bold rounded-xl border border-border/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-muted/5 text-lg"
                    required
                  />
                </div>
              </div>

              <div className="flex flex-col space-y-2">
                <label htmlFor="debt-desk" className="text-sm font-semibold">Cicilan / paylater</label>
                <div className="relative w-full">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</div>
                  <input
                    id="debt-desk"
                    type="text"
                    inputMode="numeric"
                    value={debt}
                    onChange={handleDebtChange}
                    placeholder="800.000"
                    className="w-full h-14 pl-12 pr-4 font-bold rounded-xl border border-border/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-muted/5 text-lg"
                    required
                  />
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed mt-2">
                  Masukkan estimasi wajar. Kamu bisa ubah kapan saja.
                </p>
              </div>

              <div className="pt-6">
                <Button type="submit" className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-soft-card" disabled={loading}>
                  {loading ? 'Menyimpan...' : 'Lanjut'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
