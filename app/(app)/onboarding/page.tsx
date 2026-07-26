'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Shield } from 'lucide-react'
import Link from 'next/link'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { updateProfileAction } from '@/modules/profile/actions'
import { submitFinancialBaselineAction } from '@/modules/financial-baseline/actions'
import { saveMonthlyPlanAction } from '@/modules/monthly-plan/actions'
import { isErr } from '@/lib/result'

export default function OnboardingPage() {
  const [step, setStep] = useState<number>(1)
  const [income, setIncome] = useState<string>('')
  const [mandatory, setMandatory] = useState<string>('')
  const [debt, setDebt] = useState<string>('')
  const [step1Error, setStep1Error] = useState<string | null>(null)

  const [riskWindow, setRiskWindow] = useState<string>('')
  const [payday, setPayday] = useState<string>('25')
  const [step2Error, setStep2Error] = useState<string | null>(null)
  
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const formatIDR = (value: string) => {
    const rawValue = value.replace(/[^0-9-]/g, '')
    if (!rawValue) return ''
    if (rawValue === '-') return '-'
    const number = parseInt(rawValue, 10)
    if (isNaN(number)) return ''
    return new Intl.NumberFormat('id-ID').format(number)
  }

  const handleIncomeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIncome(formatIDR(e.target.value))
    setStep1Error(null)
  }
  
  const handleMandatoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMandatory(formatIDR(e.target.value))
    setStep1Error(null)
  }
  
  const handleDebtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebt(formatIDR(e.target.value))
    setStep1Error(null)
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep1Error(null)
    
    if (!income || !mandatory || !debt) {
      setStep1Error('Semua kolom harus diisi. Isi 0 jika tidak ada.')
      return
    }

    const numInc = parseInt(income.replace(/[^0-9-]/g, ''), 10)
    const numMan = parseInt(mandatory.replace(/[^0-9-]/g, ''), 10)
    const numDeb = parseInt(debt.replace(/[^0-9-]/g, ''), 10)

    if (numInc <= 0) {
      setStep1Error('Pendapatan harus lebih dari 0.')
      return
    }
    
    if (numMan < 0 || numDeb < 0 || numInc < 0) {
      setStep1Error('Nilai tidak valid (negatif).')
      return
    }

    if (numMan + numDeb > numInc) {
      setStep1Error('Kebutuhan dan cicilan melebihi pendapatan.')
      return
    }

    setStep(2)
  }

  const handleStep2Submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStep2Error(null)

    if (!riskWindow) {
      setStep2Error('Pilih salah satu jam rawan.')
      return
    }

    const payDate = parseInt(payday, 10)
    if (!payday || isNaN(payDate) || payDate < 1 || payDate > 31) {
      setStep2Error('Tanggal tidak valid. Masukkan angka 1-31.')
      return
    }

    setLoading(true)

    // Map risk window to backend enum
    let primaryRiskWindow: any = 'other'
    if (riskWindow === 'Sore hari') primaryRiskWindow = 'after_work'
    if (riskWindow === 'Larut malam') primaryRiskWindow = 'late_night'

    try {
      const profileResult = await updateProfileAction({
        payday_day: payDate,
        primary_risk_window: primaryRiskWindow
      })

      if (isErr(profileResult)) console.warn('Profile update notice:', profileResult.error)

      const numIncome = parseInt(income.replace(/[^0-9-]/g, ''), 10) || 0
      const numMandatory = parseInt(mandatory.replace(/[^0-9-]/g, ''), 10) || 0
      const numDebt = parseInt(debt.replace(/[^0-9-]/g, ''), 10) || 0

      const financialResult = await submitFinancialBaselineAction({
        monthly_income: numIncome,
        mandatory_expenses: numMandatory,
        debt_payments: numDebt,
        income_variable: false
      })

      if (isErr(financialResult)) console.warn('Financial baseline notice:', financialResult.error)

      // Also create a monthly plan for the current month so /home doesn't redirect back to /onboarding
      const planResult = await saveMonthlyPlanAction({
        income: numIncome,
        mandatory: numMandatory,
        debt: numDebt,
        safety_buffer: 0
      })

      if (isErr(planResult)) console.warn('Plan action notice:', planResult.error)

      // Store in localStorage for legacy compatibility
      localStorage.setItem('dj_onboarding_income', income)
      localStorage.setItem('dj_onboarding_mandatory', mandatory)
      localStorage.setItem('dj_onboarding_debt', debt)
      localStorage.setItem('dj_onboarding_riskWindow', riskWindow)
      localStorage.setItem('dj_onboarding_payday', payday)
      
      router.push('/home')
    } catch (err: any) {
      console.error('Onboarding save error:', err)
      router.push('/home')
    }
  }

  const riskWindowOptions = [
    { id: 'pagi', label: 'Pagi hari' },
    { id: 'siang', label: 'Siang hari' },
    { id: 'sore', label: 'Sore hari' },
    { id: 'larut-malam', label: 'Larut malam' }
  ]

  return (
    <div className="flex flex-col min-h-screen p-6 lg:p-0 bg-white lg:bg-[#F8FAFC] lg:items-center lg:justify-center">
      <div className="w-full lg:max-w-md lg:bg-white lg:rounded-[32px] lg:shadow-soft-card lg:p-10 lg:border lg:border-border/50">
        
        <header className="relative flex items-center pt-2 mb-8 lg:mb-10 justify-between">
          {step === 1 ? (
            <Link href="/login" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
          ) : (
            <button onClick={() => setStep(1)} className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          
          <div className="flex flex-col items-end gap-1">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Langkah {step} dari 2</span>
            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className={`h-full bg-primary rounded-full transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
            </div>
          </div>
        </header>

        <div className="flex-1 w-full max-w-sm mx-auto">
          {step === 1 ? (
            <>
              <div className="space-y-2 mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Anggaran Bulanan
                </h1>
                <p className="text-sm text-muted-foreground">
                  Biar angka punya konteks. Cukup estimasi.
                </p>
              </div>

              {step1Error && <div className="mb-4 text-sm text-destructive font-medium">{step1Error}</div>}
              
              <form onSubmit={handleStep1Submit} className="space-y-6">
                <div className="space-y-3">
                  <Label htmlFor="income">Pendapatan bulanan</Label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</div>
                    <Input
                      id="income"
                      type="text"
                      inputMode="numeric"
                      value={income}
                      onChange={handleIncomeChange}
                      placeholder="6.000.000"
                      required
                      className="h-12 pl-12 rounded-xl border-border/60 text-base font-bold bg-muted/10 lg:bg-muted/5"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="mandatory">Kebutuhan Pokok</Label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</div>
                    <Input
                      id="mandatory"
                      type="text"
                      inputMode="numeric"
                      value={mandatory}
                      onChange={handleMandatoryChange}
                      placeholder="3.600.000"
                      required
                      className="h-12 pl-12 rounded-xl border-border/60 text-base font-bold bg-muted/10 lg:bg-muted/5"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="debt">Cicilan</Label>
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</div>
                    <Input
                      id="debt"
                      type="text"
                      inputMode="numeric"
                      value={debt}
                      onChange={handleDebtChange}
                      placeholder="800.000"
                      required
                      className="h-12 pl-12 rounded-xl border-border/60 text-base font-bold bg-muted/10 lg:bg-muted/5"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold bg-primary hover:bg-primary/90">
                    Lanjut
                  </Button>
                </div>
              </form>
            </>
          ) : (
            <>
              <div className="space-y-2 mb-8">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Pola Kebiasaan
                </h1>
                <p className="text-sm text-muted-foreground">
                  Kapan Anda merasa paling ingin belanja?
                </p>
              </div>

              {step2Error && <div className="mb-4 text-sm text-destructive font-medium">{step2Error}</div>}
              
              <form onSubmit={handleStep2Submit} className="space-y-6">
                <div className="space-y-3">
                  <Label>Jam Rawan Belanja</Label>
                  <div className="grid grid-cols-2 gap-3">
                    {riskWindowOptions.map(option => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setRiskWindow(option.label)}
                        className={`h-12 rounded-xl text-sm font-medium transition-all ${
                          riskWindow === option.label 
                            ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary ring-offset-2' 
                            : 'bg-muted/30 text-foreground hover:bg-muted/50 border border-border/50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="payday">Tanggal Gajian (1-31)</Label>
                  <Input
                    id="payday"
                    type="number"
                    min="1"
                    max="31"
                    value={payday}
                    onChange={(e) => setPayday(e.target.value)}
                    placeholder="25"
                    required
                    className="h-12 rounded-xl border-border/60 text-base font-bold bg-muted/10 lg:bg-muted/5"
                  />
                </div>

                <div className="pt-2">
                  <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold bg-primary hover:bg-primary/90" disabled={loading}>
                    {loading ? 'Menyimpan...' : 'Mulai Sekarang'}
                  </Button>
                </div>
              </form>
            </>
          )}

          <div className="flex items-start gap-3 mt-12 p-4 bg-muted/30 rounded-2xl border border-border/40">
            <Shield className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Privasi terjaga.</span> Data ini disimpan lokal & tidak terhubung ke bank mana pun.
            </p>
          </div>
          
        </div>
      </div>
    </div>
  )
}
