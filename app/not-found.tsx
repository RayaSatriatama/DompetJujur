import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center space-y-4">
      <h2 className="text-2xl font-bold">404 - Halaman Tidak Ditemukan</h2>
      <p className="text-muted-foreground text-sm">Halaman yang kamu cari tidak ada.</p>
      <Button asChild variant="default">
        <Link href="/home">Kembali ke Beranda</Link>
      </Button>
    </div>
  )
}
