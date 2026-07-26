'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-4 text-center space-y-4">
      <h2 className="text-2xl font-bold">Terjadi Kesalahan!</h2>
      <p className="text-muted-foreground text-sm">Ada sesuatu yang tidak beres.</p>
      <Button onClick={() => reset()} variant="outline">
        Coba Lagi
      </Button>
    </div>
  )
}
