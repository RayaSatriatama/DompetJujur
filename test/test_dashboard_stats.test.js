const assert = require('node:assert')
const { test, describe } = require('node:test')

function calculateDashboardStats(allSessions, currentMonthPrefix) {
  let totalDelayedAmount = 0
  let totalRedirectedAmount = 0
  let delayedCount = 0
  let proceededCount = 0
  let redirectedCount = 0
  let savedThisMonth = 0

  allSessions.forEach((session) => {
    if (session.outcome === 'delayed') {
      delayedCount++
      totalDelayedAmount += session.amount
      if (session.created_at.startsWith(currentMonthPrefix)) {
        savedThisMonth += session.amount
      }
    } else if (session.outcome === 'redirected') {
      redirectedCount++
      totalRedirectedAmount += session.amount
      if (session.created_at.startsWith(currentMonthPrefix)) {
        savedThisMonth += session.amount
      }
    } else if (session.outcome === 'proceeded') {
      proceededCount++
    }
  })

  return {
    totalDelayedAmount,
    totalRedirectedAmount,
    delayedCount,
    proceededCount,
    redirectedCount,
    savedThisMonth,
  }
}

describe('Dashboard Stats Calculation Unit Tests', () => {
  test('Menghitung akumulasi hemat (delayed & redirected) bulan ini', () => {
    const currentMonth = '2026-07'
    const mockSessions = [
      { amount: 500000, outcome: 'delayed', created_at: '2026-07-10T10:00:00Z' },
      { amount: 250000, outcome: 'redirected', created_at: '2026-07-15T12:00:00Z' },
      { amount: 1000000, outcome: 'proceeded', created_at: '2026-07-05T08:00:00Z' },
      { amount: 300000, outcome: 'delayed', created_at: '2026-06-20T10:00:00Z' }, // Bulan lalu
    ]

    const stats = calculateDashboardStats(mockSessions, currentMonth)

    assert.strictEqual(stats.delayedCount, 2)
    assert.strictEqual(stats.redirectedCount, 1)
    assert.strictEqual(stats.proceededCount, 1)
    assert.strictEqual(stats.totalDelayedAmount, 800000)
    assert.strictEqual(stats.totalRedirectedAmount, 250000)
    assert.strictEqual(stats.savedThisMonth, 750000) // 500k + 250k
  })
})
