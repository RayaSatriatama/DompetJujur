'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createPauseAction } from '@/modules/pause/actions'
import { isErr } from '@/lib/result'
import { Button } from '@/components/ui/button'
import { ArrowLeft, CloudRain, Wallet, RefreshCcw, Sparkles, CreditCard, MoreHorizontal, Check } from 'lucide-react'
import Link from 'next/link'

const QUICK_AMOUNTS = [50000, 100000, 250000, 500000]

const TRIGGERS = [
  { id: 'stress', label: 'Lagi stres', icon: CloudRain },
  { id: 'payday', label: 'Baru gajian', icon: Wallet },
  { id: 'chasing_loss', label: 'Mau balikin kerugian', icon: RefreshCcw },
  { id: 'boredom_escape', label: 'Bosan / pengin pelarian', icon: Sparkles },
  { id: 'limit_available', label: 'Lagi pegang limit', icon: CreditCard },
  { id: 'other', label: 'Lainnya', icon: MoreHorizontal },
]

export default function NewPauseSessionPage() {
  const [step, setStep] = useState<'nominal' | 'trigger'>('nominal')
  const [amount, setAmount] = useState<string>('')
  const [triggerType, setTriggerType] = useState<string>('')
  const [intensity, setIntensity] = useState<number>(3) // 1 to 5
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const numericAmount = amount ? parseInt(amount.replace(/[^0-9]/g, ''), 10) : 0

  const handleNextStep = () => {
    if (!numericAmount || numericAmount <= 0) {
      setError('Masukkan nominal pengeluaran.')
      return
    }
    setError(null)
    setStep('trigger')
  }

  const handleStartPause = async () => {
    if (!triggerType) {
      setError('Pilih kondisimu saat ini.')
      return
    }

    setLoading(true)
    setError(null)

    const result = await createPauseAction({
      amount: numericAmount,
      triggerType: triggerType as any,
      // For future: backend doesn't currently accept 'intensity' in the type, but we could add it.
      // We pass it if we update the backend, but for MVP it's just recorded in the DB as trigger context or ignored if not in schema.
      isDemo: false,
    })

    if (isErr(result)) {
      setError(result.error)
      setLoading(false)
      return
    }

    // Go to snapshot screen
    router.push(`/pause/${result.data.id}/snapshot`)
  }

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '')
    if (rawValue) {
      const formatted = new Intl.NumberFormat('id-ID').format(parseInt(rawValue, 10))
      setAmount(formatted)
    } else {
      setAmount('')
    }
  }

  const setQuickAmount = (val: number) => {
    setAmount(new Intl.NumberFormat('id-ID').format(val))
  }

  const formatShortRupiah = (val: number) => {
    return `Rp${val / 1000}rb`
  }

  if (step === 'trigger') {
    return (
      <div className="flex min-h-screen bg-[#F8FAFC]">
        {/* Mobile/Tablet View (hidden on lg) */}
        <div className="lg:hidden flex flex-col flex-1 p-6 pb-24 space-y-8 animate-in fade-in slide-in-from-right-8 duration-500 bg-white min-h-screen w-full">
          <header className="relative flex items-center justify-center pt-2 mb-4">
            <button onClick={() => setStep('nominal')} className="absolute left-0 p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
              <ArrowLeft className="w-5 h-5 text-foreground" />
            </button>
            <div className="flex flex-col items-center gap-2">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider">2 dari 3</span>
              <div className="w-24 h-1.5 bg-muted rounded-full overflow-hidden">
                <div className="w-2/3 h-full bg-primary rounded-full"></div>
              </div>
            </div>
          </header>

          <div className="flex-1 w-full max-w-sm mx-auto flex flex-col h-full">
            <h1 className="text-2xl font-bold tracking-tight text-foreground mb-8 text-center px-4">
              Apa yang paling dekat dengan kondisimu sekarang?
            </h1>

            {error && <div className="text-sm text-destructive font-medium mb-4">{error}</div>}

            <div className="grid grid-cols-3 gap-3 mb-10">
              {TRIGGERS.map((item) => {
                const Icon = item.icon
                const isSelected = triggerType === item.id
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setTriggerType(item.id)}
                    className={`relative flex flex-col items-center justify-center gap-2 p-3 rounded-2xl border text-xs transition-all duration-200 aspect-square ${
                      isSelected 
                        ? 'border-primary bg-primary/5 text-primary shadow-sm' 
                        : 'border-border/60 text-muted-foreground hover:bg-muted/30'
                    }`}
                  >
                    {isSelected && (
                      <div className="absolute -top-2 -right-2 bg-primary rounded-full p-0.5 border-2 border-white">
                        <Check className="w-3 h-3 text-white" strokeWidth={3} />
                      </div>
                    )}
                    <Icon className={`w-6 h-6 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className={`font-medium text-center leading-tight ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                      {item.label}
                    </span>
                  </button>
                )
              })}
            </div>

            <div className="space-y-4 mb-8">
              <h2 className="text-sm font-semibold text-foreground">Seberapa kuat dorongannya?</h2>
              <div className="flex justify-between gap-2">
                {[1, 2, 3, 4, 5].map((level) => (
                  <button
                    key={level}
                    onClick={() => setIntensity(level)}
                    className={`flex-1 h-12 rounded-xl text-sm font-bold border transition-colors ${
                      intensity === level 
                        ? 'bg-primary text-primary-foreground border-primary' 
                        : 'border-border/60 text-muted-foreground hover:bg-muted/50'
                    }`}
                  >
                    {level}
                  </button>
                ))}
              </div>
              <div className="flex justify-between text-xs font-medium text-muted-foreground px-1">
                <span>Tenang</span>
                <span>Sangat kuat</span>
              </div>
            </div>

            <div className="mt-auto pt-4">
              <Button 
                className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-soft-card" 
                onClick={handleStartPause} 
                disabled={loading}
              >
                {loading ? 'Menyiapkan...' : 'Lihat dampaknya'}
              </Button>
            </div>
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
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-8 h-8 text-primary bg-white rounded-full"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><circle cx="12" cy="10" r="3"/><path d="M7 22v-1a5 5 0 0 1 10 0v1"/></svg>
                </div>
              </div>

              <h1 className="text-4xl font-bold tracking-tight leading-[1.1] text-foreground">
                Setiap dorongan punya pola.
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed">
                Mengenali emosi saat ini membantumu lebih peka di masa depan.
              </p>
            </div>
            
            <div className="absolute -left-24 bottom-0 opacity-10 pointer-events-none w-96 h-96 text-primary">
              <svg viewBox="0 0 200 200" fill="currentColor"><path d="M45.7,117.8c0-38.3,27.1-70.8,63.9-78.5c1.1-0.2,2.3-0.4,3.4-0.5c11.9-1.5,23.3-0.5,33.5,2.4c17.2,4.8,31.2,15.8,39,30 c1.1,2.1,2.1,4.3,3,6.5c2.6,6.7,4.3,14.1,4.7,21.9c0.9,15.5-3.3,30.3-11.2,42.7c-7.9,12.4-19.6,22.1-33.3,27.6 c-13.8,5.4-29.3,6.1-43.8,1.7C90,167.3,77.7,157.9,69,145.4c-4.4-6.3-7.9-13.4-10.2-21.1c-1.4-4.6-2.5-9.3-3.1-14.3 C55.3,107.5,55.5,104.9,56,102.3C50,105.7,45.7,111.4,45.7,117.8z"/></svg>
            </div>
          </div>

          {/* Right Column */}
          <div className="w-[55%] h-full bg-white flex flex-col items-center justify-center p-12 relative border-l border-border/40 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.05)]">
            <div className="absolute top-8 left-8">
              <button onClick={() => setStep('nominal')} className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-full hover:bg-muted">
                <ArrowLeft className="w-5 h-5 text-foreground" />
                <span className="uppercase tracking-wider">Kembali</span>
              </button>
            </div>

            <div className="absolute top-8 right-8">
              <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
                Bantuan
              </button>
            </div>

            <div className="w-full max-w-lg bg-white rounded-[32px] p-10 border border-border/50 shadow-soft-card">
              <div className="space-y-3 mb-10">
                <span className="text-sm font-bold text-primary uppercase tracking-wider">2 dari 3</span>
                <div className="w-48 h-2 bg-muted rounded-full overflow-hidden">
                  <div className="w-2/3 h-full bg-primary rounded-full"></div>
                </div>
                <h1 className="text-3xl font-bold tracking-tight text-foreground pt-4">
                  Apa yang paling dekat dengan kondisimu sekarang?
                </h1>
              </div>

              <div className="space-y-8">
                {error && <div className="text-sm text-destructive font-medium">{error}</div>}
                
                <div className="grid grid-cols-2 gap-4">
                  {TRIGGERS.map((item) => {
                    const Icon = item.icon
                    const isSelected = triggerType === item.id
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTriggerType(item.id)}
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

                <div className="space-y-4 pt-4">
                  <h2 className="text-sm font-semibold text-foreground">Seberapa kuat dorongannya?</h2>
                  <div className="flex justify-between gap-2">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        onClick={() => setIntensity(level)}
                        className={`flex-1 h-14 rounded-xl text-base font-bold border transition-colors ${
                          intensity === level 
                            ? 'bg-primary text-primary-foreground border-primary' 
                            : 'border-border/60 text-muted-foreground hover:bg-muted/50'
                        }`}
                      >
                        {level}
                      </button>
                    ))}
                  </div>
                  <div className="flex justify-between text-xs font-medium text-muted-foreground px-2">
                    <span>Tenang</span>
                    <span>Sangat kuat</span>
                  </div>
                </div>

                <div className="pt-6">
                  <Button 
                    className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-soft-card" 
                    onClick={handleStartPause} 
                    disabled={loading}
                  >
                    {loading ? 'Menyiapkan...' : 'Lihat dampaknya'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-[#F8FAFC]">
      {/* Mobile/Tablet View (hidden on lg) */}
      <div className="lg:hidden flex flex-col flex-1 p-6 pb-24 space-y-12 animate-in fade-in slide-in-from-left-8 duration-500 bg-white min-h-screen w-full">
        <header className="relative flex items-center justify-center pt-2">
          <Link href="/home" className="absolute left-0 p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <h1 className="text-xl font-bold tracking-tight">Mulai Jeda</h1>
        </header>

        <div className="space-y-8 flex-1 flex flex-col items-center max-w-sm mx-auto w-full mt-4">
          <p className="text-center text-lg font-medium text-foreground max-w-[250px]">
            Berapa uang yang lagi kepikiran untuk kamu keluarkan?
          </p>
          
          {error && <div className="text-sm text-destructive font-medium">{error}</div>}

          <div className="w-full relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">
              Rp
            </div>
            <input
              type="text"
              inputMode="numeric"
              value={amount}
              onChange={handleAmountChange}
              placeholder="0"
              className="w-full text-center text-4xl sm:text-5xl font-bold rounded-2xl border-2 border-border/50 py-6 px-14 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all bg-background shadow-inner"
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-3 w-full px-2">
            {QUICK_AMOUNTS.map((amt) => (
              <button
                key={amt}
                onClick={() => setQuickAmount(amt)}
                className="py-3 px-4 text-center rounded-xl border border-border/60 font-medium text-foreground hover:bg-muted/50 hover:border-border transition-colors active:scale-95"
              >
                {formatShortRupiah(amt)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col space-y-4 max-w-sm mx-auto w-full pt-8">
          <Button 
            className="w-full h-14 rounded-xl text-lg font-bold bg-primary hover:bg-primary/90 shadow-soft-card" 
            onClick={handleNextStep} 
          >
            Lanjut
          </Button>
          <Link href="/home" className="w-full">
            <Button variant="ghost" className="w-full text-primary hover:bg-primary/10 hover:text-primary font-medium">
              Batal
            </Button>
          </Link>
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
            </div>

            <h1 className="text-4xl font-bold tracking-tight leading-[1.1] text-foreground">
              Sebentar, kita hitung dampaknya.
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Jeda 90 detik membantumu melihat dengan jelas sebelum memutuskan.
            </p>

            <div className="pt-8">
              <div className="flex items-start gap-4 p-5 rounded-2xl bg-[#E7F2EC]/50 border border-success/10">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-6 h-6 text-primary shrink-0"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="M9 12l2 2 4-4"/></svg>
                <p className="text-sm text-muted-foreground leading-relaxed font-medium">
                  Keputusan tetap di tanganmu setelah waktu jeda selesai. Kami hanya membantu memberi ruang bernapas.
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
          <div className="absolute top-8 left-8">
            <Link href="/home" className="flex items-center gap-2 text-sm font-semibold text-muted-foreground hover:text-foreground transition-colors p-2 -ml-2 rounded-full hover:bg-muted">
              <ArrowLeft className="w-5 h-5 text-foreground" />
              <span className="uppercase tracking-wider">Batal</span>
            </Link>
          </div>
          
          <div className="absolute top-8 right-8">
            <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><path d="M12 17h.01"/></svg>
              Bantuan
            </button>
          </div>

          <div className="w-full max-w-lg bg-white rounded-[32px] p-10 border border-border/50 shadow-soft-card">
            <div className="space-y-3 mb-10 text-center">
              <h1 className="text-3xl font-bold tracking-tight text-foreground pt-4">
                Berapa uang yang lagi kepikiran untuk kamu keluarkan?
              </h1>
            </div>

            <div className="space-y-8 flex-1 flex flex-col items-center w-full mt-4">
              {error && <div className="text-sm text-destructive font-medium">{error}</div>}

              <div className="w-full relative">
                <div className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl font-bold text-muted-foreground">
                  Rp
                </div>
                <input
                  type="text"
                  inputMode="numeric"
                  value={amount}
                  onChange={handleAmountChange}
                  placeholder="0"
                  className="w-full text-center text-4xl sm:text-5xl font-bold rounded-2xl border-2 border-border/50 py-8 px-14 focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all bg-background shadow-inner"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-4 gap-3 w-full">
                {QUICK_AMOUNTS.map((amt) => (
                  <button
                    key={amt}
                    onClick={() => setQuickAmount(amt)}
                    className="py-4 px-2 text-center rounded-xl border border-border/60 font-semibold text-muted-foreground hover:text-foreground hover:bg-muted/50 hover:border-border transition-colors active:scale-95"
                  >
                    {formatShortRupiah(amt)}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col space-y-4 w-full pt-12">
              <Button 
                className="w-full h-16 rounded-xl text-xl font-bold bg-primary hover:bg-primary/90 shadow-soft-card" 
                onClick={handleNextStep} 
              >
                Lanjut
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
