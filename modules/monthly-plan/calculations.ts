/**
 * Menghitung rincian Monthly Plan berdasarkan aturan:
 * committed = mandatory + debt + safety_buffer
 * flexible = max(income - committed, 0)
 */
export function calcMonthlyPlan(
  income: number,
  mandatory: number,
  debt: number,
  buffer: number
): {
  committed: number
  flexible: number
  isOverBudget: boolean
} {
  const committed = mandatory + debt + buffer
  const rawFlexible = income - committed
  const flexible = Math.max(rawFlexible, 0)
  
  return {
    committed,
    flexible,
    isOverBudget: rawFlexible < 0,
  }
}
