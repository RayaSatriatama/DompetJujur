'use client'

import { useState, useEffect } from 'react'
import { signInInstantly } from '@/modules/auth/actions'
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

  const [email, setEmail] = useState('')
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
      const result = await signInInstantly(email)
      
      if (isErr(result)) {
        setError(result.error)
      } else {
        // Success, redirect to home directly!
        router.push('/home')
      }
    } catch (err) {
      console.error(err)
      setError('Terjadi kesalahan jaringan atau server. Silakan coba lagi.')
    } finally {
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
            Lanjutkan jeda dan riwayatmu dengan aman.
          </p>
        </div>

        {error && <div className="mb-4 text-sm text-destructive font-medium">{error}</div>}
        
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
              {loading ? 'Masuk...' : 'Masuk sekarang'}
            </Button>
            <p className="text-xs text-center text-muted-foreground">
              Langsung terdaftar & masuk tanpa verifikasi.
            </p>
          </div>

          <div className="flex items-start gap-3 mt-12 p-4 bg-muted/30 rounded-2xl border border-border/40">
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
