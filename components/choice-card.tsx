import * as React from 'react'
import { cn } from '@/lib/utils'

interface ChoiceCardProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string
  description?: string
  icon?: React.ReactNode
  selected?: boolean
}

export const ChoiceCard = React.forwardRef<HTMLButtonElement, ChoiceCardProps>(
  ({ className, title, description, icon, selected, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "group flex items-start w-full gap-4 p-4 text-left border rounded-xl transition-all duration-300 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 hover:scale-[1.02] active:scale-[0.98]",
          selected
            ? "border-primary bg-primary/10 shadow-md ring-1 ring-primary/20"
            : "border-border/50 bg-white/60 dark:bg-card/40 backdrop-blur-sm shadow-sm hover:shadow-md hover:border-border",
          className
        )}
        {...props}
      >
        {icon && (
          <div className={cn(
            "flex items-center justify-center w-10 h-10 rounded-full transition-transform duration-300 ease-out",
            selected ? "bg-primary text-primary-foreground scale-110" : "bg-muted text-muted-foreground group-hover:scale-110"
          )}>
            {icon}
          </div>
        )}
        <div className="flex flex-col gap-1 flex-1">
          <span className="font-semibold">{title}</span>
          {description && <span className="text-sm text-muted-foreground">{description}</span>}
        </div>
      </button>
    )
  }
)
ChoiceCard.displayName = 'ChoiceCard'
