// Generated types for Supabase tables
// These match the schema in supabase/migrations/001_initial_schema.sql

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          stripe_customer_id: string | null
          language: 'en' | 'pt' | 'es' | 'fr' | 'de' | 'it' | 'ar'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          stripe_customer_id?: string | null
          language?: 'en' | 'pt' | 'es' | 'fr' | 'de' | 'it' | 'ar'
        }
        Update: {
          email?: string
          stripe_customer_id?: string | null
          language?: 'en' | 'pt' | 'es' | 'fr' | 'de' | 'it' | 'ar'
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          type: 'bundle' | 'standalone'
          segment: 'hotel' | 'agency' | 'dmc' | 'dmo' | 'all' | null
          price_type: 'subscription' | 'one_time'
          price_usd: number | null
          stripe_product_id: string | null
          stripe_price_id: string | null
          is_active: boolean
          created_at: string
        }
        Insert: {
          id: string
          name: string
          description?: string | null
          type: 'bundle' | 'standalone'
          segment?: 'hotel' | 'agency' | 'dmc' | 'dmo' | 'all' | null
          price_type: 'subscription' | 'one_time'
          price_usd?: number | null
          stripe_product_id?: string | null
          stripe_price_id?: string | null
          is_active?: boolean
        }
        Update: {
          name?: string
          description?: string | null
          type?: 'bundle' | 'standalone'
          segment?: 'hotel' | 'agency' | 'dmc' | 'dmo' | 'all' | null
          price_type?: 'subscription' | 'one_time'
          price_usd?: number | null
          stripe_product_id?: string | null
          stripe_price_id?: string | null
          is_active?: boolean
        }
      }
      product_access: {
        Row: {
          id: string
          product_id: string
          content_type: 'experts' | 'prompts' | 'tools' | 'trails' | 'sops' | 'tutor' | 'guides'
          segment_filter: 'hotel' | 'agency' | 'dmc' | 'dmo' | 'all' | null
        }
        Insert: {
          product_id: string
          content_type: 'experts' | 'prompts' | 'tools' | 'trails' | 'sops' | 'tutor' | 'guides'
          segment_filter?: 'hotel' | 'agency' | 'dmc' | 'dmo' | 'all' | null
        }
        Update: {
          product_id?: string
          content_type?: 'experts' | 'prompts' | 'tools' | 'trails' | 'sops' | 'tutor' | 'guides'
          segment_filter?: 'hotel' | 'agency' | 'dmc' | 'dmo' | 'all' | null
        }
      }
      user_products: {
        Row: {
          id: string
          user_id: string
          product_id: string
          status: 'active' | 'expired' | 'cancelled' | 'trial'
          stripe_subscription_id: string | null
          purchased_at: string
          trial_ends_at: string | null
          expires_at: string | null
          purchased_from: string | null
        }
        Insert: {
          user_id: string
          product_id: string
          status?: 'active' | 'expired' | 'cancelled' | 'trial'
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          expires_at?: string | null
          purchased_from?: string | null
        }
        Update: {
          status?: 'active' | 'expired' | 'cancelled' | 'trial'
          stripe_subscription_id?: string | null
          trial_ends_at?: string | null
          expires_at?: string | null
        }
      }
      business_dna: {
        Row: {
          id: string
          user_id: string
          business_name: string
          location: string
          segment: 'hotel' | 'agency' | 'dmc' | 'dmo' | 'resort' | 'tour_guide' | 'attraction' | 'rental' | null
          niche: string | null
          target_audience: string
          tone: string
          // Legacy fields (will be deprecated)
          primary_goal: string | null
          usp: string | null
          team_size: string | null
          current_tools: string | null
          challenges: string | null
          segment_specific: Json | null
          // New extended field for progressive profiling
          extended: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          user_id: string
          business_name: string
          location: string
          segment?: 'hotel' | 'agency' | 'dmc' | 'dmo' | 'resort' | 'tour_guide' | 'attraction' | 'rental' | null
          niche?: string | null
          target_audience: string
          tone: string
          primary_goal?: string | null
          usp?: string | null
          team_size?: string | null
          current_tools?: string | null
          challenges?: string | null
          segment_specific?: Json | null
          extended?: Json | null
        }
        Update: {
          business_name?: string
          location?: string
          segment?: 'hotel' | 'agency' | 'dmc' | 'dmo' | 'resort' | 'tour_guide' | 'attraction' | 'rental' | null
          niche?: string | null
          target_audience?: string
          tone?: string
          primary_goal?: string | null
          usp?: string | null
          team_size?: string | null
          current_tools?: string | null
          challenges?: string | null
          segment_specific?: Json | null
          extended?: Json | null
        }
      }
      user_favorites: {
        Row: {
          id: string
          user_id: string
          item_type: 'expert' | 'tool' | 'prompt' | 'trail' | 'sop'
          item_id: string
          created_at: string
        }
        Insert: {
          user_id: string
          item_type: 'expert' | 'tool' | 'prompt' | 'trail' | 'sop'
          item_id: string
        }
        Update: {
          item_type?: 'expert' | 'tool' | 'prompt' | 'trail' | 'sop'
          item_id?: string
        }
      }
      trail_progress: {
        Row: {
          id: string
          user_id: string
          trail_id: string
          current_step: number
          completed_steps: number[]
          started_at: string
          completed_at: string | null
        }
        Insert: {
          user_id: string
          trail_id: string
          current_step?: number
          completed_steps?: number[]
        }
        Update: {
          current_step?: number
          completed_steps?: number[]
          completed_at?: string | null
        }
      }
    }
    Functions: {
      has_access: {
        Args: {
          p_user_id: string
          p_content_type: string
          p_segment: string
        }
        Returns: boolean
      }
      get_user_access: {
        Args: {
          p_user_id: string
        }
        Returns: {
          content_type: string
          segment_filter: string
        }[]
      }
    }
  }
}

// Helper types
export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type InsertTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type UpdateTables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']

export type User = Tables<'users'>
export type Product = Tables<'products'>
export type ProductAccess = Tables<'product_access'>
export type UserProduct = Tables<'user_products'>
export type BusinessDNA = Tables<'business_dna'>
export type UserFavorite = Tables<'user_favorites'>
export type TrailProgress = Tables<'trail_progress'>
