const assert = require('node:assert')
const { test, describe } = require('node:test')

function getRemainingSeconds(eligibleAtMs, nowMs) {
  return Math.max(Math.ceil((eligibleAtMs - nowMs) / 1000), 0)
}

function determinePauseState(session, nowMs) {
  if (session.completed_at || session.outcome) {
    return 'outcome'
  }

  const eligibleAt = new Date(session.pause_eligible_at).getTime()

  if (nowMs >= eligibleAt) {
    return 'decision'
  }

  return 'timer'
}

describe('Pause Timer & State Machine Unit Tests', () => {
  test('Timer menghitung sisa detik dengan benar', () => {
    const now = 1000000000000
    const eligibleAt = 1000000090000 // 90 detik setelahnya
    assert.strictEqual(getRemainingSeconds(eligibleAt, now), 90)
  })

  test('Timer tidak pernah bernilai negatif (berhenti di 0)', () => {
    const now = 1000000100000
    const eligibleAt = 1000000000000 // 100 detik di masa lalu
    assert.strictEqual(getRemainingSeconds(eligibleAt, now), 0)
  })

  test('State "timer" jika waktu sekarang < eligibleAt', () => {
    const now = 1000000000000
    const session = {
      pause_eligible_at: new Date(1000000090000).toISOString(),
      completed_at: null,
      outcome: null,
    }
    assert.strictEqual(determinePauseState(session, now), 'timer')
  })

  test('State "decision" jika waktu sekarang >= eligibleAt dan belum ada outcome', () => {
    const now = 1000000090000
    const session = {
      pause_eligible_at: new Date(1000000090000).toISOString(),
      completed_at: null,
      outcome: null,
    }
    assert.strictEqual(determinePauseState(session, now), 'decision')
  })

  test('State "outcome" jika sesi sudah completed atau punya outcome', () => {
    const now = 1000000090000
    const session = {
      pause_eligible_at: new Date(1000000090000).toISOString(),
      completed_at: new Date().toISOString(),
      outcome: 'delayed',
    }
    assert.strictEqual(determinePauseState(session, now), 'outcome')
  })
})
