"use client"

import { ProductGrid } from "@/components/product-grid"
import { CategoryFilter } from "@/components/category-filter"
import { HeroSection } from "@/components/hero-section"
import { QuotationSection } from "@/components/quotation-section"
import { UserDetailsModal } from "@/components/user-details-modal"
import { useState, useEffect } from "react"

export default function HomePage() {
  const [showUserModal, setShowUserModal] = useState(false)

  useEffect(() => {
    const hasProvidedDetails = localStorage.getItem("user-details-provided")
    if (!hasProvidedDetails) {
      setShowUserModal(true)
    }
  }, [])

  return (
    <div className="min-h-screen">
      <HeroSection />

      {/* Products Section */}
      <section id="products-section" className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-teal-600 dark:text-green-400">Our Product Range</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Explore our comprehensive collection of premium PVC pipes, fittings, and hydraulic solutions designed for
              residential, commercial, and industrial applications.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8">
            <aside className="lg:w-64">
              <CategoryFilter />
            </aside>
            <main className="flex-1">
              <ProductGrid />
            </main>
          </div>
        </div>
      </section>

      <QuotationSection />

      <UserDetailsModal isOpen={showUserModal} onClose={() => setShowUserModal(false)} />
    </div>
  )
}
