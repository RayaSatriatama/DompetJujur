/**
 * Format angka integer Rupiah ke string yang dapat dibaca manusia.
 * Contoh: 350000 → "Rp350.000"
 */
export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format angka integer Rupiah singkat tanpa simbol mata uang.
 * Contoh: 350000 → "350.000"
 */
export function formatRupiahPlain(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Parse string input menjadi integer Rupiah.
 * Menghapus semua karakter non-digit.
 * Contoh: "Rp350.000" → 350000
 */
export function parseRupiah(input: string): number {
  const digits = input.replace(/\D/g, '')
  if (!digits) return 0
  const value = parseInt(digits, 10)
  return isNaN(value) ? 0 : value
}

/**
 * Format tanggal ke string lokal Indonesia.
 * Contoh: "2026-07-25T23:14:00Z" → "25 Jul · 23:14"
 */
export function formatSessionDate(dateString: string): string {
  const date = new Date(dateString)
  const day = date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
  const time = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
  return `${day} · ${time}`
}

/**
 * Format angka detik menjadi tampilan timer.
 * Contoh: 72 → "72"
 */
export function formatTimerSeconds(seconds: number): string {
  return Math.max(0, seconds).toString()
}

/**
 * Format nama trigger ke label yang dapat dibaca.
 */
export function formatTriggerLabel(triggerType: string): string {
  const labels: Record<string, string> = {
    stress: 'Lagi stres',
    payday: 'Baru gajian',
    chasing_loss: 'Mau balikin kerugian',
    boredom_escape: 'Bosan / pengin pelarian',
    paylater_limit: 'Lagi pegang limit paylater',
    other: 'Lainnya',
  }
  return labels[triggerType] ?? triggerType
}

/**
 * Format outcome ke label yang dapat dibaca.
 */
export function formatOutcomeLabel(outcome: string): string {
  const labels: Record<string, string> = {
    delayed: 'Ditunda',
    proceeded: 'Tetap lanjut',
    redirected: 'Alihkan fokus',
  }
  return labels[outcome] ?? outcome
}

/**
 * Format nama risk window ke label yang dapat dibaca.
 */
export function formatRiskWindowLabel(riskWindow: string): string {
  const labels: Record<string, string> = {
    after_work: 'Setelah kerja',
    late_night: 'Larut malam',
    after_payday: 'Setelah gajian',
    after_loss: 'Setelah rugi',
    paylater_available: 'Saat limit paylater tersedia',
    other: 'Lainnya',
  }
  return labels[riskWindow] ?? riskWindow
}
