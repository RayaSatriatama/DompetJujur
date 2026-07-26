import * as React from 'react'
import { cn } from '@/lib/utils'
import { formatOutcomeLabel } from '@/lib/formatters'

interface OutcomeChipProps extends React.HTMLAttributes<HTMLSpanElement> {
  outcome: 'delayed' | 'proceeded' | 'redirected'
}

export function OutcomeChip({ outcome, className, ...props }: OutcomeChipProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border",
        {
          'bg-success/10 text-success border-success/20': outcome === 'delayed' || outcome === 'redirected',
          'bg-destructive/10 text-destructive border-destructive/20': outcome === 'proceeded',
        },
        className
      )}
      {...props}
    >
      {formatOutcomeLabel(outcome)}
    </span>
  )
}
