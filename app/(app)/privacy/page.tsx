import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PrivacyPage() {
  return (
    <div className="flex flex-col flex-1 p-4 sm:p-8 pt-12 space-y-6">
      <header>
        <h1 className="text-2xl font-bold tracking-tight">Privasi & Keamanan</h1>
      </header>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Kebijakan Privasi Sederhana</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            DompetJujur dirancang dengan prinsip <strong>Privacy First</strong>. Kami hanya meminta data yang esensial untuk membantumu mengerem pengeluaran.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Kami tidak menghubungkan aplikasi ini dengan rekening bank aslimu.</li>
            <li>Kami tidak menjual atau membagikan datamu ke pihak ketiga.</li>
            <li>Kami menggunakan enkripsi dan perlindungan dari Supabase untuk menjaga data tetap aman.</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
