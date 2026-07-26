import * as React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { formatRupiah } from '@/lib/formatters'

interface FinancialSummaryProps {
  income: number
  committed: number // mandatory + debt + buffer
  flexible: number
}

export function FinancialSummary({ income, committed, flexible }: FinancialSummaryProps) {
  const committedPercentage = income > 0 ? Math.min(100, (committed / income) * 100) : 0
  const flexiblePercentage = income > 0 ? Math.min(100, (flexible / income) * 100) : 0

  return (
    <Card className="shadow-soft-card border-none bg-white/70 dark:bg-card/50 backdrop-blur-xl transition-all duration-300 hover:shadow-lg">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg font-bold tracking-tight text-foreground/90">Ruang Uang Bulan Ini</CardTitle>
      </CardHeader>
      <CardContent className="space-y-8">
        
        {/* Modern Stacked Bar */}
        <div className="relative pt-2">
          <div className="flex h-4 w-full overflow-hidden rounded-full bg-muted shadow-inner">
            <div 
              className="bg-primary transition-all duration-1000 ease-out" 
              style={{ width: `${committedPercentage}%` }} 
              title={`Wajib: ${formatRupiah(committed)}`}
            />
            <div 
              className="bg-success transition-all duration-1000 delay-300 ease-out" 
              style={{ width: `${flexiblePercentage}%` }} 
              title={`Fleksibel: ${formatRupiah(flexible)}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1 p-3 bg-muted/40 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="w-2 h-2 rounded-full bg-primary" />
              Teralokasi
            </div>
            <div className="font-semibold text-lg">{formatRupiah(committed)}</div>
          </div>
          <div className="space-y-1 p-3 bg-muted/40 rounded-xl">
            <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground uppercase tracking-wider">
              <div className="w-2 h-2 rounded-full bg-success" />
              Fleksibel
            </div>
            <div className="font-semibold text-lg text-success">{formatRupiah(flexible)}</div>
          </div>
        </div>

        <div className="pt-2 border-t border-border/50 flex justify-between items-center text-sm">
          <span className="text-muted-foreground font-medium">Total Pemasukan</span>
          <span className="font-bold">{formatRupiah(income)}</span>
        </div>
      </CardContent>
    </Card>
  )
}
