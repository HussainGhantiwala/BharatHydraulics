import { createClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Validate environment variables
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set.",
  )
}

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Helper function to check connection
export const testSupabaseConnection = async () => {
  try {
    const { data, error } = await supabase.from("products").select("count").limit(1)
    if (error) throw error
    return { connected: true, error: null }
  } catch (error) {
    return { connected: false, error: error.message }
  }
}

// Database types with proper Supabase types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string | null
          price: number
          category: string
          image: string | null
          featured: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          price: number
          category: string
          image?: string | null
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          price?: number
          category?: string
          image?: string | null
          featured?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      categories: {
        Row: {
          id: string
          name: string
          description: string | null
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          created_at?: string
        }
      }
      quotation_requests: {
        Row: {
          id: string
          product_id: string | null
          customer_name: string
          email: string
          phone: string | null
          company: string | null
          quantity: string
          urgency: string | null
          additional_requirements: string | null
          project_details: string | null
          status: "pending" | "quoted" | "followed_up" | "closed"
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id?: string | null
          customer_name: string
          email: string
          phone?: string | null
          company?: string | null
          quantity: string
          urgency?: string | null
          additional_requirements?: string | null
          project_details?: string | null
          status?: "pending" | "quoted" | "followed_up" | "closed"
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string | null
          customer_name?: string
          email?: string
          phone?: string | null
          company?: string | null
          quantity?: string
          urgency?: string | null
          additional_requirements?: string | null
          project_details?: string | null
          status?: "pending" | "quoted" | "followed_up" | "closed"
          created_at?: string
          updated_at?: string
        }
      }
      follow_ups: {
        Row: {
          id: string
          quotation_id: string
          message: string
          follow_up_date: string
          completed: boolean
          created_at: string
        }
        Insert: {
          id?: string
          quotation_id: string
          message: string
          follow_up_date: string
          completed?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          quotation_id?: string
          message?: string
          follow_up_date?: string
          completed?: boolean
          created_at?: string
        }
      }
    }
  }
}

export type Product = Database["public"]["Tables"]["products"]["Row"]
export type ProductInsert = Database["public"]["Tables"]["products"]["Insert"]
export type ProductUpdate = Database["public"]["Tables"]["products"]["Update"]

export type Category = Database["public"]["Tables"]["categories"]["Row"]
export type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"]

export type QuotationRequest = Database["public"]["Tables"]["quotation_requests"]["Row"] & {
  product?: Product
}
export type QuotationRequestInsert = Database["public"]["Tables"]["quotation_requests"]["Insert"]

export type FollowUp = Database["public"]["Tables"]["follow_ups"]["Row"]
export type FollowUpInsert = Database["public"]["Tables"]["follow_ups"]["Insert"]
