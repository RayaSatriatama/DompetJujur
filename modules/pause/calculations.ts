/**
 * Menghitung porsi pengeluaran relatif terhadap uang fleksibel.
 * Mengembalikan persentase (0-100+).
 */
export function calcConsequencePercentage(amount: number, flexibleAmount: number): number | null {
  if (flexibleAmount <= 0) return null
  return Math.round((amount / flexibleAmount) * 100)
}

/**
 * Menghitung equivalen pengeluaran dalam hari (budget harian).
 */
export function calcEquivalentDays(amount: number, dailyContext: number): number | null {
  if (dailyContext <= 0) return null
  return Math.round(amount / dailyContext)
}
