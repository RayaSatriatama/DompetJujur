import { Loader2 } from 'lucide-react'

export default function AppLoading() {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-8 text-center space-y-4">
      <Loader2 className="w-8 h-8 animate-spin text-primary opacity-50" />
      <p className="text-muted-foreground animate-pulse text-sm">Menyiapkan halaman...</p>
    </div>
  )
}
