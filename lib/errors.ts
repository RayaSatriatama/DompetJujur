export const APP_ERRORS = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  SESSION_NOT_FOUND: 'SESSION_NOT_FOUND',
  SESSION_NOT_OWNED: 'SESSION_NOT_OWNED',
  SESSION_ALREADY_COMPLETED: 'SESSION_ALREADY_COMPLETED',
  PAUSE_NOT_ELIGIBLE: 'PAUSE_NOT_ELIGIBLE',
  REFLECTION_ALREADY_EXISTS: 'REFLECTION_ALREADY_EXISTS',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  DATABASE_ERROR: 'DATABASE_ERROR',
  ACCOUNT_DELETION_FAILED: 'ACCOUNT_DELETION_FAILED',
} as const

export type AppErrorCode = typeof APP_ERRORS[keyof typeof APP_ERRORS]

export const ERROR_MESSAGES: Record<AppErrorCode, string> = {
  UNAUTHORIZED: 'Sesi tidak ditemukan. Silakan masuk kembali.',
  SESSION_NOT_FOUND: 'Sesi tidak ditemukan.',
  SESSION_NOT_OWNED: 'Sesi tidak ditemukan.',
  SESSION_ALREADY_COMPLETED: 'Sesi ini sudah selesai.',
  PAUSE_NOT_ELIGIBLE: 'Jeda masih berjalan.',
  REFLECTION_ALREADY_EXISTS: 'Refleksi sudah tersimpan.',
  VALIDATION_ERROR: 'Data tidak valid. Periksa input kamu.',
  DATABASE_ERROR: 'Ada yang belum tersimpan. Coba lagi, inputmu tetap ada di layar.',
  ACCOUNT_DELETION_FAILED: 'Gagal menghapus akun. Coba lagi.',
}

export function getErrorMessage(code: AppErrorCode): string {
  return ERROR_MESSAGES[code] ?? 'Terjadi kesalahan. Coba lagi.'
}
