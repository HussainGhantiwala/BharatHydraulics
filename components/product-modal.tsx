"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Quote } from "lucide-react"
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

interface ProductModalProps {
  product: Product
  isOpen: boolean
  onClose: () => void
}

export function ProductModal({ product, isOpen, onClose }: ProductModalProps) {
  const router = useRouter()

  const handleQuoteRequest = () => {
    // Redirect to quote page with this product pre-filled
    router.push(`/quote?product=${encodeURIComponent(product.name)}`)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <img
              src={product.image_url || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-64 object-cover rounded-lg"
            />
          </div>

          <div className="space-y-4">
            <Badge className="bg-teal-600 dark:bg-green-600 text-white">{product.category}</Badge>

            <p className="text-gray-600 dark:text-gray-400">{product.description}</p>

            <div>
              <h4 className="font-semibold mb-2 text-gray-900 dark:text-white">Specifications:</h4>
              <ul className="space-y-1">
                {product.specifications.map((spec, index) => (
                  <li key={index} className="text-sm text-gray-600 dark:text-gray-400">
                    • {spec}
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4">
              <div className="text-2xl font-bold text-teal-600 dark:text-green-400 mb-4">{product.price}</div>

              <Button
                onClick={handleQuoteRequest}
                className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
              >
                <Quote className="mr-2 h-4 w-4" />
                Ask for Quotation
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
