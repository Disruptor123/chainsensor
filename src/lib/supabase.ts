import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          bio: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          bio?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          bio?: string | null
          updated_at?: string
        }
      }
      datasets: {
        Row: {
          id: string
          user_id: string
          name: string
          type: string
          size: string
          content: string | null
          status: 'processing' | 'processed' | 'error'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          type: string
          size: string
          content?: string | null
          status?: 'processing' | 'processed' | 'error'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          type?: string
          size?: string
          content?: string | null
          status?: 'processing' | 'processed' | 'error'
          updated_at?: string
        }
      }
      sensors: {
        Row: {
          id: string
          user_id: string
          name: string
          dataset_id: string
          logic: any
          api_endpoint: string | null
          status: 'active' | 'inactive'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          dataset_id: string
          logic: any
          api_endpoint?: string | null
          status?: 'active' | 'inactive'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          dataset_id?: string
          logic?: any
          api_endpoint?: string | null
          status?: 'active' | 'inactive'
          updated_at?: string
        }
      }
      activities: {
        Row: {
          id: string
          user_id: string
          action: string
          type: string
          dataset_id: string | null
          sensor_id: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          action: string
          type: string
          dataset_id?: string | null
          sensor_id?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          action?: string
          type?: string
          dataset_id?: string | null
          sensor_id?: string | null
        }
      }
      deployments: {
        Row: {
          id: string
          user_id: string
          sensor_id: string
          platform: string
          api_endpoint: string
          status: 'deploying' | 'deployed' | 'error'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          sensor_id: string
          platform: string
          api_endpoint: string
          status?: 'deploying' | 'deployed' | 'error'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          sensor_id?: string
          platform?: string
          api_endpoint?: string
          status?: 'deploying' | 'deployed' | 'error'
          updated_at?: string
        }
      }
      api_keys: {
        Row: {
          id: string
          user_id: string
          name: string
          key_hash: string
          key_preview: string
          created_at: string
          last_used: string | null
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          key_hash: string
          key_preview: string
          created_at?: string
          last_used?: string | null
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          key_hash?: string
          key_preview?: string
          last_used?: string | null
        }
      }
      marketplace_datasets: {
        Row: {
          id: string
          name: string
          description: string
          type: string
          size: string
          format: string
          rating: number
          downloads: number
          author: string
          tags: string[]
          preview: string
          content: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          type: string
          size: string
          format: string
          rating?: number
          downloads?: number
          author: string
          tags: string[]
          preview: string
          content?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          type?: string
          size?: string
          format?: string
          rating?: number
          downloads?: number
          author?: string
          tags?: string[]
          preview?: string
          content?: string | null
          updated_at?: string
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          email: boolean
          push: boolean
          sms: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          email?: boolean
          push?: boolean
          sms?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          email?: boolean
          push?: boolean
          sms?: boolean
          updated_at?: string
        }
      }
    }
  }
}