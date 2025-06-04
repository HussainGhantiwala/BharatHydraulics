"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, Clock, CheckCircle, Users } from "lucide-react"
import { useSupabaseProducts } from "@/hooks/use-supabase-products"
import { useState } from "react"
import { QuotationModal } from "@/components/quotation-modal"

export function QuotationSection() {
  const { products } = useSupabaseProducts()
  const [selectedProduct, setSelectedProduct] = useState<any>(null)
  const [showQuotationModal, setShowQuotationModal] = useState(false)

  const featuredProducts = products.filter((product) => product.featured).slice(0, 6)

  const handleQuotationRequest = (product: any) => {
    setSelectedProduct(product)
    setShowQuotationModal(true)
  }

  return (
    <>
      <section id="quotation-section" className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 text-teal-600 dark:text-green-400">
                Get Your Custom Quotation
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                Request personalized quotes for bulk orders, custom specifications, or project-specific requirements.
                Our experts will provide competitive pricing within 24 hours.
              </p>
            </div>

            {/* Process Steps */}
            <div className="grid md:grid-cols-4 gap-6 mb-12">
              {[
                { icon: FileText, title: "Submit Request", desc: "Fill out quotation form" },
                { icon: Clock, title: "Quick Review", desc: "2-hour response time" },
                { icon: Users, title: "Expert Analysis", desc: "Technical evaluation" },
                { icon: CheckCircle, title: "Custom Quote", desc: "Detailed pricing & terms" },
              ].map((step, index) => (
                <Card key={step.title} className="text-center border-teal-200 dark:border-green-800">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bg-teal-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
                      <step.icon className="h-8 w-8 text-teal-600 dark:text-green-400" />
                    </div>
                    <h3 className="font-semibold mb-2">{step.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-300">{step.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Featured Products for Quotation */}
            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-6 text-center text-teal-600 dark:text-green-400">
                Popular Products for Quotation
              </h3>
              <div className="grid md:grid-cols-3 lg:grid-cols-6 gap-4">
                {featuredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className="cursor-pointer border-teal-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
                  >
                    <CardContent className="p-4">
                      <img
                        src={product.image || "/placeholder.svg?height=120&width=120"}
                        alt={product.name}
                        className="w-full h-24 object-cover rounded mb-3"
                      />
                      <h4 className="font-semibold text-sm mb-2 line-clamp-2">{product.name}</h4>
                      <p className="text-xs text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                        {product.description}
                      </p>
                      <Button
                        size="sm"
                        onClick={() => handleQuotationRequest(product)}
                        className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700 text-xs"
                      >
                        Get Quote
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            {/* Benefits */}
            <div className="bg-teal-50 dark:bg-green-950 rounded-lg p-8">
              <h3 className="text-xl font-bold mb-6 text-center text-teal-600 dark:text-green-400">
                Why Choose Our Quotation Service?
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  "Competitive bulk pricing",
                  "Technical specifications included",
                  "Flexible delivery options",
                  "Professional installation support",
                  "Quality certifications provided",
                  "Custom product modifications",
                  "Project consultation included",
                  "Long-term partnership benefits",
                ].map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <CheckCircle className="h-5 w-5 text-teal-600 dark:text-green-400 flex-shrink-0" />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {selectedProduct && (
        <QuotationModal
          product={selectedProduct}
          isOpen={showQuotationModal}
          onClose={() => setShowQuotationModal(false)}
        />
      )}
    </>
  )
}
