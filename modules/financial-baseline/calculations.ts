/**
 * Menghitung ruang uang fleksibel berdasarkan aturan:
 * raw_flexible = income - mandatory - debt
 * display_flexible = max(raw_flexible, 0)
 */
export function calcFlexibleMoney(income: number, mandatory: number, debt: number): number {
  const rawFlexible = income - mandatory - debt
  return Math.max(rawFlexible, 0)
}

/**
 * Menghitung estimasi sisa harian dari uang fleksibel.
 * Ini hanya untuk konteks visual (± 7 hari budget transportmu), bukan saran keuangan.
 */
export function calcDailyContext(flexible: number): number {
  return Math.max(Math.floor(flexible / 30), 0)
}
