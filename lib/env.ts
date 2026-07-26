import { z } from 'zod'

const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL harus URL yang valid'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY wajib diisi'),
  NEXT_PUBLIC_APP_URL: z.string().url().optional().default('http://localhost:3000'),
  ALLOW_DEMO_MODE: z.string().optional().default('false'),
  APP_ENV: z.enum(['development', 'preview', 'production']).optional().default('development'),
})

const serverEnvSchema = envSchema.extend({
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'SUPABASE_SERVICE_ROLE_KEY wajib diisi di server'),
})

function getClientEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
    NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    ALLOW_DEMO_MODE: process.env.ALLOW_DEMO_MODE,
    APP_ENV: process.env.APP_ENV,
  })

  if (!parsed.success) {
    throw new Error(
      `Environment variable error:\n${parsed.error.issues.map((e) => `  ${e.path.join('.')}: ${e.message}`).join('\n')}`
    )
  }

  return parsed.data
}

export const env = getClientEnv()

export function isDemoModeAllowed(): boolean {
  return env.ALLOW_DEMO_MODE === 'true'
}
