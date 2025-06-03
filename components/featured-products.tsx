"use client"

import { useState, useEffect } from "react"
import { ProductModal } from "@/components/product-modal"
import { EnhancedProductCard } from "@/components/enhanced-product-card"
import { supabase } from "@/lib/supabase"
import { Loader2, Sparkles } from "lucide-react"
import { useRouter } from "next/navigation"

interface Product {
  id: string
  name: string
  category: string
  price: string
  image_url: string
  description: string
  specifications: string[]
}

export function FeaturedProducts() {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase
          .from("products")
          .select("*")
          .eq("status", "active")
          .limit(4)
          .order("created_at", { ascending: false })

        if (error) throw error
        setProducts(data || [])
      } catch (error) {
        console.error("Error fetching products:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProducts()
  }, [])

  const handleRequestQuote = (product: Product) => {
    router.push(`/quote?product=${encodeURIComponent(product.name)}`)
  }

  if (isLoading) {
    return (
      <section className="py-20 bg-gradient-to-br from-gray-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-green-950 dark:to-emerald-950">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 dark:from-green-500 dark:to-emerald-500 rounded-full mb-4">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Discover our premium range of PVC pipes and fittings designed for excellence
            </p>
          </div>
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-teal-600 dark:text-green-400" />
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-teal-50 to-cyan-50 dark:from-gray-900 dark:via-green-950 dark:to-emerald-950">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-teal-500 to-cyan-500 dark:from-green-500 dark:to-emerald-500 rounded-full mb-4 animate-pulse">
            <Sparkles className="h-6 w-6 text-white" />
          </div>
          <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
            Featured Products
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Discover our premium range of PVC pipes and fittings designed for excellence
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-green-400 dark:to-emerald-400 mx-auto mt-4 rounded-full"></div>
        </div>

        {products.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400 text-lg">No products available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <div key={product.id} className="animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                <EnhancedProductCard
                  product={product}
                  onViewDetails={setSelectedProduct}
                  onRequestQuote={handleRequestQuote}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </section>
  )
}
