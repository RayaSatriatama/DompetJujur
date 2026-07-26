/**
 * Menghitung sisa waktu dalam detik antara waktu selesai jeda dan waktu sekarang.
 * Tidak akan pernah bernilai negatif.
 */
export function getRemainingSeconds(eligibleAtMs: number, nowMs: number): number {
  return Math.max(Math.ceil((eligibleAtMs - nowMs) / 1000), 0)
}
