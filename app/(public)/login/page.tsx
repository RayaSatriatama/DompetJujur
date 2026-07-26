'use client'

import { useState, useEffect } from 'react'
import { signInWithOtp, verifyOtp } from '@/modules/auth/actions'
import { isErr } from '@/lib/result'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { MailCheck, ArrowLeft, Shield } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const urlError = searchParams.get('error')

  const [email, setEmail] = useState('')
  const [token, setToken] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (urlError) {
      setError(urlError)
    }
  }, [urlError])

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await signInWithOtp(email)
      
      if (isErr(result)) {
        setError(result.error)
      } else {
        setStep('otp')
      }
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan jaringan atau server. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = await verifyOtp(email, token)
      
      if (isErr(result)) {
        setError(result.error)
        setLoading(false)
      } else {
        // Success, redirect to home
        router.push('/home')
      }
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan jaringan atau server. Silakan coba lagi.')
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen p-6 lg:p-0 bg-white lg:bg-[#F8FAFC] lg:items-center lg:justify-center">
      <div className="w-full lg:max-w-md lg:bg-white lg:rounded-[32px] lg:shadow-soft-card lg:p-10 lg:border lg:border-border/50">
        <header className="relative flex items-center pt-2 mb-8 lg:mb-10">
          <Link href="/" className="p-2 -ml-2 rounded-full hover:bg-muted transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </Link>
          <span className="hidden lg:block ml-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">Kembali</span>
        </header>

      <div className="flex-1 w-full max-w-sm mx-auto">
        <div className="space-y-2 mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Masuk ke DompetJujur
          </h1>
          <p className="text-sm text-muted-foreground">
            {step === 'email' 
              ? 'Lanjutkan jeda dan riwayatmu dengan aman.' 
              : 'Cek email kamu!'}
          </p>
        </div>

        {error && <div className="mb-4 text-sm text-destructive font-medium">{error}</div>}
        
        {step === 'email' ? (
          <form onSubmit={handleSendLink} className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nama@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="h-12 rounded-xl border-border/60"
              />
            </div>
            
            <div className="space-y-3">
              <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold bg-primary hover:bg-primary/90" disabled={loading}>
                {loading ? 'Mengirim...' : 'Kirim tautan masuk'}
              </Button>
              <p className="text-xs text-center text-muted-foreground">
                Kami akan mengirim tautan aman tanpa kata sandi.
              </p>
            </div>

            <div className="flex items-start gap-3 mt-12 p-4 bg-muted/30 rounded-2xl border border-border/40">
              <Shield className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                <span className="font-semibold text-foreground">Privasi terjaga.</span> Kami tidak melihat atau menyimpan akses ke rekeningmu.
              </p>
            </div>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-8 text-center mt-12">
            <div className="flex justify-center text-primary">
              <div className="p-4 bg-primary/10 rounded-full">
                <MailCheck className="w-12 h-12" />
              </div>
            </div>
            
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Kode OTP 6-digit telah dikirim ke:<br/>
                <strong className="text-foreground text-base">{email}</strong>
              </p>
            </div>
            
            <div className="space-y-3 text-left">
              <Label htmlFor="token" className="sr-only">Kode OTP</Label>
              <Input
                id="token"
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                pattern="\d{6}"
                maxLength={6}
                placeholder="123456"
                value={token}
                onChange={(e) => setToken(e.target.value.replace(/\D/g, ''))}
                className="h-16 text-center text-3xl tracking-[0.5em] font-bold rounded-2xl bg-muted/20 border-border/60"
                required
              />
            </div>
            
            <div className="space-y-3">
              <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold bg-primary hover:bg-primary/90" disabled={loading || token.length !== 6}>
                {loading ? 'Memverifikasi...' : 'Verifikasi Masuk'}
              </Button>
              <Button 
                type="button" 
                variant="ghost" 
                className="w-full text-primary hover:text-primary hover:bg-primary/10" 
                onClick={() => setStep('email')}
                disabled={loading}
              >
                Ganti Email
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
