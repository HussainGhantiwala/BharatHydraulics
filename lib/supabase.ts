import { createClient } from "@supabase/supabase-js"

// Use placeholder values if environment variables are not set
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://placeholder.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "placeholder-key"

// Only create Supabase client if proper credentials are provided
export const supabase = supabaseUrl.includes("placeholder") ? null : createClient(supabaseUrl, supabaseAnonKey)

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return (
    supabase !== null &&
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes("placeholder")
  )
}

// Database types
export interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  featured: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  description: string
  created_at: string
}

export interface QuotationRequest {
  id: string
  product_id: string
  customer_name: string
  email: string
  phone: string
  company: string
  quantity: string
  urgency: string
  additional_requirements: string
  project_details: string
  status: "pending" | "quoted" | "followed_up" | "closed"
  created_at: string
  updated_at: string
  product?: Product
}

export interface FollowUp {
  id: string
  quotation_id: string
  message: string
  follow_up_date: string
  completed: boolean
  created_at: string
}
