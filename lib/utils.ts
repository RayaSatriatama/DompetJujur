import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Mengembalikan tanggal hari pertama bulan dari date yang diberikan.
 * Digunakan sebagai month_key untuk monthly_plans.
 * Format: "YYYY-MM-01"
 */
export function getMonthKey(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${year}-${month}-01`
}

/**
 * Mengembalikan greeting berdasarkan jam saat ini.
 */
export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Pagi'
  if (hour < 15) return 'Siang'
  if (hour < 18) return 'Sore'
  return 'Malam'
}

/**
 * Cek apakah nilai melebihi ambang batas konfirmasi (Rp1.000.000.000).
 */
export function requiresAmountConfirmation(amount: number): boolean {
  return amount > 1_000_000_000
}
