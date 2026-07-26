/**
 * Result type untuk error handling yang konsisten di Server Actions.
 * Menghindari throw/catch yang tidak terprediksi di batas UI.
 */
export type Result<T, E = string> =
  | { success: true; data: T }
  | { success: false; error: E }

export function ok<T>(data: T): Result<T, never> {
  return { success: true, data }
}

export function err<E = string>(error: E): Result<never, E> {
  return { success: false, error }
}

export function isOk<T, E>(result: Result<T, E>): result is { success: true; data: T } {
  return result.success === true
}

export function isErr<T, E>(result: Result<T, E>): result is { success: false; error: E } {
  return result.success === false
}
