export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          timezone: string | null
          user_goal: string | null
          difficulty_level: string | null
          session_duration_minutes: number | null
          reminder_time_local: string | null
          subject_preferences: string[]
          skill_focus_preferences: string[]
          onboarding_completed: boolean
        }
        Insert: {
          id: string
          created_at?: string
          timezone?: string | null
          user_goal?: string | null
          difficulty_level?: string | null
          session_duration_minutes?: number | null
          reminder_time_local?: string | null
          subject_preferences?: string[]
          skill_focus_preferences?: string[]
          onboarding_completed?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          timezone?: string | null
          user_goal?: string | null
          difficulty_level?: string | null
          session_duration_minutes?: number | null
          reminder_time_local?: string | null
          subject_preferences?: string[]
          skill_focus_preferences?: string[]
          onboarding_completed?: boolean
        }
        Relationships: []
      }
      prompts: {
        Row: {
          id: number
          title: string
          description: string
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          time_required_minutes: number
          growth_weight: number
          subject_tags: string[]
          skill_focus_tags: string[]
          is_active: boolean
          created_at: string
        }
        Insert: {
          id?: number
          title: string
          description: string
          difficulty_level: 'beginner' | 'intermediate' | 'advanced'
          time_required_minutes: number
          growth_weight: number
          subject_tags?: string[]
          skill_focus_tags?: string[]
          is_active?: boolean
          created_at?: string
        }
        Update: {
          id?: number
          title?: string
          description?: string
          difficulty_level?: 'beginner' | 'intermediate' | 'advanced'
          time_required_minutes?: number
          growth_weight?: number
          subject_tags?: string[]
          skill_focus_tags?: string[]
          is_active?: boolean
          created_at?: string
        }
        Relationships: []
      }
      daily_prompt_sets: {
        Row: {
          id: string
          user_id: string
          date_local: string
          prompt_ids: number[]
          selected_prompt_id: number | null
          status: 'offered' | 'selected' | 'completed' | 'expired'
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date_local: string
          prompt_ids: number[]
          selected_prompt_id?: number | null
          status?: 'offered' | 'selected' | 'completed' | 'expired'
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date_local?: string
          prompt_ids?: number[]
          selected_prompt_id?: number | null
          status?: 'offered' | 'selected' | 'completed' | 'expired'
          created_at?: string
        }
        Relationships: []
      }
      user_prompt_history: {
        Row: {
          id: string
          user_id: string
          date_local: string
          prompt_id: number
          was_offered: boolean
          was_selected: boolean
          was_completed: boolean
          completed_at: string | null
        }
        Insert: {
          id?: string
          user_id: string
          date_local: string
          prompt_id: number
          was_offered?: boolean
          was_selected?: boolean
          was_completed?: boolean
          completed_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          date_local?: string
          prompt_id?: number
          was_offered?: boolean
          was_selected?: boolean
          was_completed?: boolean
          completed_at?: string | null
        }
        Relationships: []
      }
      user_streaks: {
        Row: {
          user_id: string
          current_streak_days: number
          longest_streak_days: number
          last_completed_date_local: string | null
          grace_days_available: number
          updated_at: string
        }
        Insert: {
          user_id: string
          current_streak_days?: number
          longest_streak_days?: number
          last_completed_date_local?: string | null
          grace_days_available?: number
          updated_at?: string
        }
        Update: {
          user_id?: string
          current_streak_days?: number
          longest_streak_days?: number
          last_completed_date_local?: string | null
          grace_days_available?: number
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          user_id: string
          plan: 'free' | 'pro'
          status: 'active' | 'canceled' | 'past_due'
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          current_period_end: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          plan?: 'free' | 'pro'
          status?: 'active' | 'canceled' | 'past_due'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          user_id?: string
          plan?: 'free' | 'pro'
          status?: 'active' | 'canceled' | 'past_due'
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          current_period_end?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      uploads: {
        Row: {
          id: string
          user_id: string
          prompt_id: number
          date_local: string
          storage_path: string
          caption: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          prompt_id: number
          date_local: string
          storage_path: string
          caption?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          prompt_id?: number
          date_local?: string
          storage_path?: string
          caption?: string | null
          created_at?: string
        }
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: {
      generate_daily_prompts: {
        Args: { p_user_id: string; p_date_local: string }
        Returns: Json
      }
      update_streak_on_completion: {
        Args: { p_user_id: string; p_date: string }
        Returns: undefined
      }
    }
    Enums: Record<string, never>
  }
}

// Convenience row types
export type UserRow = Database['public']['Tables']['users']['Row']
export type PromptRow = Database['public']['Tables']['prompts']['Row']
export type DailyPromptSetRow = Database['public']['Tables']['daily_prompt_sets']['Row']
export type UserPromptHistoryRow = Database['public']['Tables']['user_prompt_history']['Row']
export type UserStreakRow = Database['public']['Tables']['user_streaks']['Row']
export type UploadRow = Database['public']['Tables']['uploads']['Row']
export type SubscriptionRow = Database['public']['Tables']['subscriptions']['Row']

// Domain types
export type DifficultyLevel = 'beginner' | 'intermediate' | 'advanced'
export type DailyPromptSetStatus = 'offered' | 'selected' | 'completed' | 'expired'
export type PromptRole = 'comfort' | 'growth' | 'wildcard'

// Response type from generate_daily_prompts RPC
export interface DailyPromptWithRole {
  id: number
  title: string
  description: string
  difficulty_level: string
  time_required_minutes: number
  growth_weight: number
  subject_tags: string[]
  skill_focus_tags: string[]
  role: PromptRole
}

export interface DailyPromptsResponse {
  id: string
  user_id: string
  date_local: string
  prompt_ids: number[]
  selected_prompt_id: number | null
  status: DailyPromptSetStatus
  prompts: DailyPromptWithRole[]
}
