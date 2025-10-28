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
      generations: {
        Row: {
          id: string
          created_at: string
          mode: string
          prompt: string
          output: string
          tokens_used: number
          is_bookmarked: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          mode: string
          prompt: string
          output: string
          tokens_used: number
          is_bookmarked?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          mode?: string
          prompt?: string
          output?: string
          tokens_used?: number
          is_bookmarked?: boolean
        }
      }
    }
  }
}
