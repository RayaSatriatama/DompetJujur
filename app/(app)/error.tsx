'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { AlertCircle } from 'lucide-react'

export default function AppError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-1 flex-col items-center justify-center p-4">
      <Card className="w-full max-w-sm border-dashed">
        <CardContent className="pt-6 flex flex-col items-center text-center space-y-4">
          <div className="w-12 h-12 bg-destructive/10 rounded-full flex items-center justify-center text-destructive">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Terjadi Kesalahan</h2>
            <p className="text-sm text-muted-foreground mt-2">
              Tenang, sistem kami sedang jeda sebentar. Mari coba muat ulang halaman.
            </p>
          </div>
          <Button onClick={reset} variant="outline" className="w-full mt-4">
            Coba Lagi
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
