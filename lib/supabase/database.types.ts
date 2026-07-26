// File ini di-generate oleh Supabase CLI.
// Jalankan: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > lib/supabase/database.types.ts
// Atau: npx supabase gen types typescript --local > lib/supabase/database.types.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      financial_profiles: {
        Row: {
          id: string
          user_id: string
          monthly_income: number
          mandatory_expenses: number
          debt_payments: number
          income_variable: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          monthly_income: number
          mandatory_expenses: number
          debt_payments: number
          income_variable?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          monthly_income?: number
          mandatory_expenses?: number
          debt_payments?: number
          income_variable?: boolean
          updated_at?: string
        }
      }
      monthly_plans: {
        Row: {
          id: string
          user_id: string
          month_key: string
          income: number
          mandatory: number
          debt: number
          safety_buffer: number
          flexible_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          month_key: string
          income: number
          mandatory: number
          debt: number
          safety_buffer?: number
          flexible_amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          income?: number
          mandatory?: number
          debt?: number
          safety_buffer?: number
          flexible_amount?: number
          updated_at?: string
        }
      }
      pause_sessions: {
        Row: {
          id: string
          user_id: string
          amount: number
          trigger_type: Database['public']['Enums']['trigger_type']
          urge_before: number | null
          urge_after: number | null
          intent_during_pause: Database['public']['Enums']['pause_intent'] | null
          outcome: Database['public']['Enums']['pause_outcome'] | null
          started_at: string
          pause_eligible_at: string
          completed_at: string | null
          is_demo: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          amount: number
          trigger_type: Database['public']['Enums']['trigger_type']
          urge_before?: number | null
          urge_after?: number | null
          intent_during_pause?: Database['public']['Enums']['pause_intent'] | null
          outcome?: Database['public']['Enums']['pause_outcome'] | null
          started_at: string
          pause_eligible_at: string
          completed_at?: string | null
          is_demo?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          urge_after?: number | null
          intent_during_pause?: Database['public']['Enums']['pause_intent'] | null
          outcome?: Database['public']['Enums']['pause_outcome'] | null
          completed_at?: string | null
          updated_at?: string
        }
      }
      profiles: {
        Row: {
          id: string
          nickname: string | null
          payday_day: number | null
          primary_risk_window: Database['public']['Enums']['risk_window'] | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          nickname?: string | null
          payday_day?: number | null
          primary_risk_window?: Database['public']['Enums']['risk_window'] | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          nickname?: string | null
          payday_day?: number | null
          primary_risk_window?: Database['public']['Enums']['risk_window'] | null
          updated_at?: string
        }
      }
      reflection_entries: {
        Row: {
          id: string
          session_id: string
          user_id: string
          reflection_code: Database['public']['Enums']['reflection_code']
          note: string | null
          created_at: string
        }
        Insert: {
          id?: string
          session_id: string
          user_id: string
          reflection_code: Database['public']['Enums']['reflection_code']
          note?: string | null
          created_at?: string
        }
        Update: {
          reflection_code?: Database['public']['Enums']['reflection_code']
          note?: string | null
        }
      }
    }
    Enums: {
      risk_window: 'after_work' | 'late_night' | 'after_payday' | 'after_loss' | 'paylater_available' | 'other'
      trigger_type: 'stress' | 'payday' | 'chasing_loss' | 'boredom_escape' | 'paylater_limit' | 'other'
      pause_outcome: 'delayed' | 'proceeded' | 'redirected'
      pause_intent: 'continue' | 'unsure'
      reflection_code: 'calmer' | 'same' | 'stronger' | 'urge_too_strong' | 'stress' | 'chasing_loss' | 'avoid_thinking' | 'skipped'
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]
