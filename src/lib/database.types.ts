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
      products: {
        Row: {
          id: string
          name: string | null
          category: string
          subcategory: string
          subsubcategory: string | null
          subsubsubcategory: string | null
          price: number | null
          images: string[]
          temporada: string | null
          marca: string | null
          description: string | null
          sizes: string[]
          created_at: string
          updated_at: string
          user_id: string
        }
        Insert: {
          id?: string
          name?: string | null
          category: string
          subcategory: string
          subsubcategory?: string | null
          subsubsubcategory?: string | null
          price?: number | null
          images: string[]
          temporada?: string | null
          marca?: string | null
          description?: string | null
          sizes: string[]
          created_at?: string
          updated_at?: string
          user_id?: string
        }
        Update: {
          id?: string
          name?: string | null
          category?: string
          subcategory?: string
          subsubcategory?: string | null
          subsubsubcategory?: string | null
          price?: number | null
          images?: string[]
          temporada?: string | null
          marca?: string | null
          description?: string | null
          sizes?: string[]
          created_at?: string
          updated_at?: string
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}