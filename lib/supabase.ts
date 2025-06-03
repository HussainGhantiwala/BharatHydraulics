import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Product {
  id: string
  name: string
  category: string
  price: string
  image_url: string
  description: string
  specifications: string[]
  status: "active" | "inactive"
  created_at: string
  updated_at: string
}

export interface QuotationRequest {
  id: string
  customer_name: string
  email: string
  phone: string
  company: string
  items: Array<{
    product: string
    quantity: number
    specifications: string
  }>
  project_details: string
  status: "pending" | "quoted" | "completed"
  created_at: string
  updated_at: string
}

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  company: string
  address: string
  created_at: string
}
