"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Star, FileText, Heart } from "lucide-react"
import { QuotationModal } from "@/components/quotation-modal"

interface ProductModalProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    category: string
    image: string
    featured: boolean
  }
  isOpen: boolean
  onClose: () => void
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const [showQuotationModal, setShowQuotationModal] = useState(false)

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl text-teal-600 dark:text-green-400">{product.name}</DialogTitle>
          </DialogHeader>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="relative">
                {product.featured && (
                  <Badge className="absolute top-2 left-2 z-10 bg-teal-600 dark:bg-green-600">Featured</Badge>
                )}
                <img
                  src={product.image || "/placeholder.svg?height=400&width=400"}
                  alt={product.name}
                  className="w-full h-80 object-cover rounded-lg"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {[...Array(3)].map((_, i) => (
                  <img
                    key={i}
                    src={product.image || `/placeholder.svg?height=100&width=100&text=View${i + 1}`}
                    alt={`${product.name} view ${i + 1}`}
                    className="w-full h-20 object-cover rounded cursor-pointer hover:opacity-80 transition-opacity"
                  />
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Badge
                    variant="secondary"
                    className="bg-teal-100 text-teal-800 dark:bg-green-900 dark:text-green-200"
                  >
                    {product.category}
                  </Badge>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                    <span className="text-sm text-gray-600 dark:text-gray-300 ml-2">(4.5/5)</span>
                  </div>
                </div>

                <div className="text-3xl font-bold text-teal-600 dark:text-green-400 mb-4">
                  Starting from ${product.price}
                </div>

                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-semibold mb-2">Product Features:</h4>
                  <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <li>High-quality materials and construction</li>
                    <li>Meets industry standards and certifications</li>
                    <li>Available in multiple sizes and specifications</li>
                    <li>Bulk pricing available for large orders</li>
                    <li>Fast delivery and professional support</li>
                  </ul>
                </div>

                <div className="flex space-x-3">
                  <Button
                    className="flex-1 bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
                    onClick={() => setShowQuotationModal(true)}
                  >
                    <FileText className="mr-2 h-4 w-4" />
                    Ask for Quotation
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    className="border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-950"
                  >
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>

                <div className="text-sm text-gray-500 dark:text-gray-400">
                  <p>✓ Free quotation within 24 hours</p>
                  <p>✓ Bulk pricing and delivery options</p>
                  <p>✓ Technical specifications included</p>
                  <p>✓ Professional installation support available</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <QuotationModal product={product} isOpen={showQuotationModal} onClose={() => setShowQuotationModal(false)} />
    </>
  )
}
