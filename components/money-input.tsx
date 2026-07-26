import * as React from 'react'
import { cn } from '@/lib/utils'
import { parseRupiah, formatRupiahPlain } from '@/lib/formatters'

interface MoneyInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  value: number | ''
  onChange: (value: number | '') => void
}

export const MoneyInput = React.forwardRef<HTMLInputElement, MoneyInputProps>(
  ({ className, value, onChange, ...props }, ref) => {
    const [displayValue, setDisplayValue] = React.useState(
      value === '' || value === 0 ? '' : formatRupiahPlain(value as number)
    )

    React.useEffect(() => {
      if (value === '' || value === 0) {
        setDisplayValue('')
      } else if (parseRupiah(displayValue) !== value) {
        setDisplayValue(formatRupiahPlain(value as number))
      }
    }, [value])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const rawValue = e.target.value
      const parsed = parseRupiah(rawValue)

      if (rawValue === '') {
        setDisplayValue('')
        onChange('')
        return
      }

      setDisplayValue(formatRupiahPlain(parsed))
      onChange(parsed)
    }

    return (
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">Rp</span>
        <input
          type="text"
          inputMode="numeric"
          className={cn(
            'flex h-12 w-full rounded-md border border-input bg-background pl-10 pr-3 py-2 text-lg font-semibold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className
          )}
          ref={ref}
          value={displayValue}
          onChange={handleChange}
          {...props}
        />
      </div>
    )
  }
)
MoneyInput.displayName = 'MoneyInput'
