"use client"

import { useState, useEffect } from "react"
import { supabase, isSupabaseConfigured, type Product } from "@/lib/supabase"

export function useSupabaseProducts() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      setLoading(true)

      // Check if Supabase is configured
      if (!isSupabaseConfigured() || !supabase) {
        throw new Error("Supabase not configured")
      }

      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

      if (error) {
        console.warn("Supabase products table not found, using localStorage fallback:", error.message)
        throw error
      }
      setProducts(data || [])
    } catch (error) {
      console.warn("Using localStorage fallback for products")
      // Fallback to localStorage with initial data
      const savedProducts = localStorage.getItem("catalog-products")
      if (savedProducts) {
        setProducts(JSON.parse(savedProducts))
      } else {
        // Use initial products if no saved data
        const initialProducts = [
          {
            id: "1",
            name: "PVC Drainage Pipe 110mm",
            description:
              "High-quality PVC drainage pipe, 110mm diameter, 6-meter length. Perfect for residential and commercial drainage systems.",
            price: 45.99,
            category: "Drainage Pipes",
            image: "/placeholder.svg?height=300&width=300&text=PVC+Pipe+110mm",
            featured: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "2",
            name: "PVC Elbow Joint 90°",
            description:
              "Durable 90-degree elbow joint for PVC pipes. Available in multiple sizes for various plumbing applications.",
            price: 8.99,
            category: "Pipe Fittings",
            image: "/placeholder.svg?height=300&width=300&text=Elbow+Joint",
            featured: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "3",
            name: "PVC Ball Valve 25mm",
            description:
              "Premium quality ball valve with lever handle. Suitable for water supply and irrigation systems.",
            price: 24.99,
            category: "Valves",
            image: "/placeholder.svg?height=300&width=300&text=Ball+Valve",
            featured: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "4",
            name: "PVC Pressure Pipe 50mm",
            description:
              "High-pressure PVC pipe for water supply systems. Meets Australian standards for potable water.",
            price: 32.99,
            category: "Pressure Pipes",
            image: "/placeholder.svg?height=300&width=300&text=Pressure+Pipe",
            featured: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "5",
            name: "PVC T-Junction",
            description:
              "Three-way T-junction fitting for connecting multiple pipe sections. Available in various sizes.",
            price: 12.99,
            category: "Pipe Fittings",
            image: "/placeholder.svg?height=300&width=300&text=T-Junction",
            featured: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "6",
            name: "PVC Pipe Cutter",
            description: "Professional-grade pipe cutter for clean, precise cuts on PVC pipes up to 63mm diameter.",
            price: 89.99,
            category: "Tools",
            image: "/placeholder.svg?height=300&width=300&text=Pipe+Cutter",
            featured: true,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "7",
            name: "PVC Solvent Cement",
            description:
              "High-strength solvent cement for permanent PVC pipe joints. Fast-setting formula for quick installation.",
            price: 16.99,
            category: "Adhesives",
            image: "/placeholder.svg?height=300&width=300&text=Solvent+Cement",
            featured: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
          {
            id: "8",
            name: "PVC Reducer Coupling",
            description:
              "Reducer coupling for connecting pipes of different diameters. Available in multiple size combinations.",
            price: 9.99,
            category: "Pipe Fittings",
            image: "/placeholder.svg?height=300&width=300&text=Reducer",
            featured: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ]
        setProducts(initialProducts)
        localStorage.setItem("catalog-products", JSON.stringify(initialProducts))
      }
    } finally {
      setLoading(false)
    }
  }

  const addProduct = async (productData: Omit<Product, "id" | "created_at" | "updated_at">) => {
    try {
      const { data, error } = await supabase.from("products").insert([productData]).select().single()

      if (error) {
        console.warn("Supabase insert failed, using localStorage:", error.message)
        throw error
      }
      setProducts((prev) => [data, ...prev])
      return { data, error: null }
    } catch (error) {
      console.warn("Using localStorage fallback for adding product")
      // Fallback to localStorage
      const newProduct = {
        ...productData,
        id: Date.now().toString(),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
      const updatedProducts = [newProduct, ...products]
      setProducts(updatedProducts)
      localStorage.setItem("catalog-products", JSON.stringify(updatedProducts))
      return { data: newProduct, error: null }
    }
  }

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const { data, error } = await supabase
        .from("products")
        .update({ ...productData, updated_at: new Date().toISOString() })
        .eq("id", id)
        .select()
        .single()

      if (error) throw error
      setProducts((prev) => prev.map((p) => (p.id === id ? data : p)))
      return { data, error: null }
    } catch (error) {
      console.error("Error updating product:", error)
      // Fallback to localStorage
      const updatedProducts = products.map((p) =>
        p.id === id ? { ...p, ...productData, updated_at: new Date().toISOString() } : p,
      )
      setProducts(updatedProducts)
      localStorage.setItem("catalog-products", JSON.stringify(updatedProducts))
      return { data: null, error: null }
    }
  }

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id)

      if (error) throw error
      setProducts((prev) => prev.filter((p) => p.id !== id))
      return { error: null }
    } catch (error) {
      console.error("Error deleting product:", error)
      // Fallback to localStorage
      const updatedProducts = products.filter((p) => p.id !== id)
      setProducts(updatedProducts)
      localStorage.setItem("catalog-products", JSON.stringify(updatedProducts))
      return { error: null }
    }
  }

  return {
    products,
    loading,
    addProduct,
    updateProduct,
    deleteProduct,
    refetch: fetchProducts,
  }
}
