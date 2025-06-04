"use client"

import { useState } from "react"
import { ProductCard } from "@/components/product-card"
import { ProductModal } from "@/components/product-modal"
import { useProducts } from "@/hooks/use-products"
import { useSearchParams } from "next/navigation"

export function ProductGrid() {
  const { products } = useProducts()
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const searchParams = useSearchParams()
  const categoryFilter = searchParams.get("category")

  const filteredProducts = categoryFilter
    ? products.filter((product) => product.category.toLowerCase() === categoryFilter.toLowerCase())
    : products

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} onClick={() => setSelectedProduct(product)} />
        ))}
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </>
  )
}
