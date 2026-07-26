import * as React from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface ImpactCardProps {
  title: string
  value: string | React.ReactNode
  description?: string
  variant?: 'default' | 'destructive' | 'success'
  className?: string
}

export function ImpactCard({ title, value, description, variant = 'default', className }: ImpactCardProps) {
  return (
    <Card className={cn(
      "overflow-hidden shadow-soft-card border-none bg-white/70 dark:bg-card/50 backdrop-blur-xl transition-all duration-300 hover:shadow-lg hover:-translate-y-1", 
      className
    )}>
      <CardContent className="p-4 sm:p-6 flex flex-col justify-between h-full">
        <p className="text-sm font-medium text-muted-foreground mb-2">{title}</p>
        <div>
          <p className={cn(
            "text-2xl sm:text-3xl font-bold tracking-tight",
            {
              'text-destructive': variant === 'destructive',
              'text-success': variant === 'success',
              'text-foreground': variant === 'default',
            }
          )}>
            {value}
          </p>
          {description && (
            <p className="text-sm text-muted-foreground mt-1">
              {description}
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
