const assert = require('node:assert')
const { test, describe } = require('node:test')

// Implementasi fungsi kalkulasi sesuai modules/monthly-plan/calculations.ts
function calcMonthlyPlan(income, mandatory, debt, buffer) {
  const committed = mandatory + debt + buffer
  const rawFlexible = income - committed
  const flexible = Math.max(rawFlexible, 0)

  return {
    committed,
    flexible,
    isOverBudget: rawFlexible < 0,
  }
}

describe('Monthly Plan Calculation Unit Tests', () => {
  test('Kalkulasi normal dengan sisa anggaran fleksibel', () => {
    const result = calcMonthlyPlan(5000000, 2000000, 500000, 500000)
    assert.strictEqual(result.committed, 3000000)
    assert.strictEqual(result.flexible, 2000000)
    assert.strictEqual(result.isOverBudget, false)
  })

  test('Kalkulasi over budget ketika committed melampaui income', () => {
    const result = calcMonthlyPlan(4000000, 3000000, 1000000, 500000)
    assert.strictEqual(result.committed, 4500000)
    assert.strictEqual(result.flexible, 0)
    assert.strictEqual(result.isOverBudget, true)
  })

  test('Kalkulasi tepat pas (zero flexible, not over budget)', () => {
    const result = calcMonthlyPlan(3000000, 2000000, 1000000, 0)
    assert.strictEqual(result.committed, 3000000)
    assert.strictEqual(result.flexible, 0)
    assert.strictEqual(result.isOverBudget, false)
  })
})
