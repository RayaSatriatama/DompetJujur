'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'

export default function OnboardingPage() {
  // Step Management
  const [step, setStep] = useState<number>(1)

  // Step 1 State
  const [income, setIncome] = useState<string>('')
  const [mandatory, setMandatory] = useState<string>('')
  const [debt, setDebt] = useState<string>('')
  const [step1Error, setStep1Error] = useState<string | null>(null)

  const [riskWindow, setRiskWindow] = useState<string>('')
  const [payday, setPayday] = useState<string>('25')
  const [step2Error, setStep2Error] = useState<string | null>(null)
  
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  // Format IDR
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
    validateStep1(e.target.value, mandatory, debt)
  }
  
  const handleMandatoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMandatory(formatIDR(e.target.value))
    validateStep1(income, e.target.value, debt)
  }
  
  const handleDebtChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebt(formatIDR(e.target.value))
    validateStep1(income, mandatory, e.target.value)
  }

  const validateStep1 = (inc: string, man: string, deb: string) => {
    setStep1Error(null)
    
    const numInc = parseInt(inc.replace(/[^0-9-]/g, ''), 10) || 0
    const numMan = parseInt(man.replace(/[^0-9-]/g, ''), 10) || 0
    const numDeb = parseInt(deb.replace(/[^0-9-]/g, ''), 10) || 0

    if (numInc < 0 || numMan < 0 || numDeb < 0) {
      setStep1Error('Nilai tidak boleh negatif.')
    }
  }

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault()
    setStep1Error(null)
    
    if (!income || !mandatory || !debt) {
      // Use standard HTML5 validation or show custom message if empty
      // But tests expect specific error
      setStep1Error('Semua field harus diisi. Isi 0 jika tidak ada.')
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

    // Save to local state and proceed to step 2
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

    // Simulate saving data
    await new Promise(resolve => setTimeout(resolve, 500))

    // Store in localStorage for now (mocking API)
    localStorage.setItem('dj_onboarding_income', income)
    localStorage.setItem('dj_onboarding_mandatory', mandatory)
    localStorage.setItem('dj_onboarding_debt', debt)
    localStorage.setItem('dj_onboarding_riskWindow', riskWindow)
    localStorage.setItem('dj_onboarding_payday', payday)
    
    router.push('/dashboard')
  }

  const riskWindowOptions = [
    { id: 'pagi', label: 'Pagi hari' },
    { id: 'siang', label: 'Siang hari' },
    { id: 'sore', label: 'Sore hari' },
    { id: 'larut-malam', label: 'Larut malam' }
  ]

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Left Column (Desktop Only for Decorative Text) */}
      <div className="hidden lg:flex w-[45%] h-full flex-col pt-12 px-16 relative overflow-hidden fixed top-0 bottom-0 left-0">
        <div className="flex items-center gap-2 text-primary font-bold text-xl mb-16">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>DompetJujur</span>
        </div>

        <div className="max-w-md space-y-8 z-10">
          <div className="space-y-3">
            <span className="text-sm font-bold text-primary uppercase tracking-wider">Langkah {step} dari 2</span>
            <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
              <div className={`h-full bg-primary rounded-full transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
            </div>
          </div>

          {step === 1 ? (
            <>
              <h1 className="text-4xl font-bold tracking-tight leading-[1.1] text-foreground pt-4">
                Biar angka punya konteks
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Cukup estimasi. DompetJujur tidak perlu melihat rekeningmu.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-4xl font-bold tracking-tight leading-[1.1] text-foreground pt-4">
                Kenali pola belanjamu
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Kami akan membantu kamu mengambil jeda di jam-jam rawan.
              </p>
            </>
          )}

          <div className="pt-8">
            <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#E7F2EC]/50 border border-success/10">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-primary shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
              <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                Data ini tersimpan aman dan hanya digunakan untuk menghitung anggaran fleksibelmu.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column / Main Form Area (Mobile + Desktop) */}
      <div className="w-full lg:w-[55%] lg:ml-[45%] min-h-screen bg-white lg:p-12 p-6 flex flex-col relative lg:border-l lg:border-border/40 lg:shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)]">
        
        <header className="relative flex items-center lg:hidden pt-2 mb-8 justify-center">
          {step === 1 ? (
            <Link href="/login" className="absolute left-0 p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </Link>
          ) : (
            <button onClick={() => setStep(1)} className="absolute left-0 p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
          )}
          <div className="flex flex-col items-center gap-2">
            <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Langkah {step} dari 2</span>
            <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
              <div className={`h-full bg-primary rounded-full transition-all duration-300 ${step === 1 ? 'w-1/2' : 'w-full'}`}></div>
            </div>
          </div>
        </header>

        <div className="absolute top-8 left-8 hidden lg:block">
          {step === 2 && (
            <button onClick={() => setStep(1)} className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-4 h-4" /> Kembali
            </button>
          )}
        </div>
        
        <div className="flex-1 w-full max-w-md mx-auto lg:mx-0 lg:ml-auto lg:mr-auto lg:my-auto flex flex-col justify-center">
          <div className="lg:bg-white lg:rounded-[32px] lg:p-10 lg:border lg:border-border/50 lg:shadow-soft-card w-full">
            {step === 1 ? (
              <>
                <div className="space-y-2 mb-10 lg:hidden">
                <h1 className="text-2xl font-bold tracking-tight text-foreground">
                  Biar angka punya konteks
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px]">
                  Cukup estimasi. DompetJujur tidak perlu melihat rekeningmu.
                </p>
              </div>
                
                <form onSubmit={handleStep1Submit} className="space-y-6 lg:space-y-8 flex flex-col">
                  {step1Error && <div className="p-3 bg-destructive/10 text-destructive text-sm font-medium rounded-lg">{step1Error}</div>}
                  
                  <div className="flex flex-col space-y-2">
                    <label htmlFor="income" className="text-sm font-semibold shrink-0">Pendapatan bulanan</label>
                    <div className="relative w-full">
                      <div className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</div>
                      <input
                        id="income"
                        type="text"
                        inputMode="numeric"
                        value={income}
                        onChange={handleIncomeChange}
                        placeholder="6.000.000"
                        className="w-full h-14 pl-10 lg:pl-12 pr-4 font-bold rounded-xl border border-border/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-muted/10 lg:bg-muted/5 text-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label htmlFor="mandatory" className="text-sm font-semibold shrink-0">Kebutuhan Pokok</label>
                    <div className="relative w-full">
                      <div className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</div>
                      <input
                        id="mandatory"
                        type="text"
                        inputMode="numeric"
                        value={mandatory}
                        onChange={handleMandatoryChange}
                        placeholder="3.600.000"
                        className="w-full h-14 pl-10 lg:pl-12 pr-4 font-bold rounded-xl border border-border/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-muted/10 lg:bg-muted/5 text-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex flex-col space-y-2">
                    <label htmlFor="debt" className="text-sm font-semibold shrink-0">Cicilan</label>
                    <div className="relative w-full">
                      <div className="absolute left-3 lg:left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-muted-foreground">Rp</div>
                      <input
                        id="debt"
                        type="text"
                        inputMode="numeric"
                        value={debt}
                        onChange={handleDebtChange}
                        placeholder="800.000"
                        className="w-full h-14 pl-10 lg:pl-12 pr-4 font-bold rounded-xl border border-border/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-muted/10 lg:bg-muted/5 text-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="pt-8 lg:pt-6 mt-auto">
                    <Button type="submit" className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-soft-card">
                      Lanjut
                    </Button>
                  </div>
                </form>
              </>
            ) : (
              <>
                <div className="space-y-2 mb-8">
                <h1 className="text-2xl lg:text-xl font-bold tracking-tight text-foreground leading-tight">
                  Jam berapa Anda biasanya merasa paling ingin belanja?
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-[280px] lg:hidden">
                  Kami akan membantu kamu lebih waspada di jam-jam ini.
                </p>
              </div>

                <form onSubmit={handleStep2Submit} className="space-y-6 lg:space-y-8 flex flex-col">
                  {step2Error && <div className="p-3 bg-destructive/10 text-destructive text-sm font-medium rounded-lg">{step2Error}</div>}
                  
                  <div className="grid grid-cols-2 gap-3">
                    {riskWindowOptions.map(option => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setRiskWindow(option.label)}
                        className={`h-14 rounded-xl text-sm font-medium transition-all ${
                          riskWindow === option.label 
                            ? 'bg-primary text-primary-foreground shadow-md ring-2 ring-primary ring-offset-2' 
                            : 'bg-muted/30 text-foreground hover:bg-muted/50 border border-border/50'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col space-y-2 pt-4">
                    <label htmlFor="payday" className="text-sm font-semibold shrink-0">Tanggal Gajian (1-31)</label>
                    <input
                      id="payday"
                      type="number"
                      min="1"
                      max="31"
                      value={payday}
                      onChange={(e) => setPayday(e.target.value)}
                      placeholder="25"
                      className="w-full h-14 px-4 font-bold rounded-xl border border-border/60 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all bg-muted/10 text-lg"
                      required
                    />
                  </div>

                  <div className="pt-8 lg:pt-6 mt-auto">
                    <Button type="submit" className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-soft-card" disabled={loading}>
                      {loading ? 'Menyimpan...' : 'Selesai'}
                    </Button>
                  </div>
                </form>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
