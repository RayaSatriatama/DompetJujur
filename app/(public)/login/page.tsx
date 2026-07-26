'use client'

import { useState, useEffect } from 'react'
import { loginWithPassword, registerWithPassword } from '@/modules/auth/actions'
import { isErr } from '@/lib/result'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { ArrowLeft, Shield } from 'lucide-react'
import { useSearchParams, useRouter } from 'next/navigation'
import Link from 'next/link'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const urlError = searchParams.get('error')

  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (urlError) {
      setError(urlError)
    }
  }, [urlError])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      const result = mode === 'login' 
        ? await loginWithPassword(email, password)
        : await registerWithPassword(email, password)
      
      if (isErr(result)) {
        setError(result.error)
      } else {
        // Success, redirect to home
        router.push('/home')
      }
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan jaringan atau server. Silakan coba lagi.')
    } finally {
      setLoading(false)
    }
  }

  const toggleMode = () => {
    setMode(mode === 'login' ? 'register' : 'login')
    setError(null)
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
            {mode === 'login' ? 'Masuk ke DompetJujur' : 'Daftar DompetJujur'}
          </h1>
          <p className="text-sm text-muted-foreground">
            Lanjutkan jeda dan riwayatmu dengan aman.
          </p>
        </div>

        {error && <div className="mb-4 text-sm text-destructive font-medium">{error}</div>}
        
        <form onSubmit={handleSubmit} className="space-y-6">
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
            <Label htmlFor="password">Kata Sandi</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
              className="h-12 rounded-xl border-border/60"
            />
          </div>
          
          <div className="space-y-3 pt-2">
            <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold bg-primary hover:bg-primary/90" disabled={loading}>
              {loading ? 'Memproses...' : (mode === 'login' ? 'Masuk sekarang' : 'Daftar sekarang')}
            </Button>
          </div>

          <div className="text-center pt-2">
            <button 
              type="button" 
              onClick={toggleMode}
              className="text-sm text-primary font-medium hover:underline focus:outline-none"
            >
              {mode === 'login' 
                ? 'Belum punya akun? Daftar di sini' 
                : 'Sudah punya akun? Masuk di sini'}
            </button>
          </div>

          <div className="flex items-start gap-3 mt-8 p-4 bg-muted/30 rounded-2xl border border-border/40">
            <Shield className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-xs text-muted-foreground leading-relaxed">
              <span className="font-semibold text-foreground">Privasi terjaga.</span> Kami tidak melihat atau menyimpan akses ke rekeningmu.
            </p>
          </div>
        </form>
      </div>
      </div>
    </div>
  )
}
