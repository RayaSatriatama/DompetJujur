import { type PauseSession, type PauseState } from './types'

export function determinePauseState(session: PauseSession): PauseState {
  if (session.completed_at || session.outcome) {
    return 'outcome'
  }

  const now = new Date().getTime()
  const eligibleAt = new Date(session.pause_eligible_at).getTime()

  if (now >= eligibleAt) {
    return 'decision'
  }

  // Jika waktu belum selesai, anggap di timer.
  // Catatan: Snapshot state di-handle di level UI route.
  return 'timer'
}
