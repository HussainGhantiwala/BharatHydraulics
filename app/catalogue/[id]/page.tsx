"use client"

import { useParams } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useProducts } from "@/contexts/product-context"
import { ArrowLeft, Download, Share2, ShoppingCart } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { QuotationModal } from "@/components/quotation-modal"
import type { Product } from "@/contexts/product-context"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

export default function ProductDetailPage() {
  const params = useParams()
  const { products } = useProducts()
  const product = products.find((p) => p.id === params.id)
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false)

  const handleQuotationClick = () => {
    setIsQuotationModalOpen(true)
  }

  const closeQuotationModal = () => {
    setIsQuotationModalOpen(false)
  }

  if (!product) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <Button asChild>
            <Link href="/catalogue">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Catalogue
            </Link>
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        <motion.div initial="initial" animate="animate" variants={fadeInUp} className="mb-8">
          <Button asChild variant="outline">
            <Link href="/catalogue">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Catalogue
            </Link>
          </Button>
        </motion.div>

        <motion.div initial="initial" animate="animate" variants={fadeInUp} className="grid lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <div className="relative">
              <Image
                src={product.image || "/placeholder.svg?height=500&width=600"}
                alt={product.name}
                width={600}
                height={500}
                className="w-full rounded-lg shadow-lg"
              />
              <Badge className="absolute top-4 left-4 bg-teal-600 dark:bg-green-600">{product.category}</Badge>
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold mb-4">{product.name}</h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed">{product.description}</p>
            </div>

            {/* Specifications */}
            <Card>
              <CardHeader>
                <CardTitle>Technical Specifications</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Material</span>
                    <p className="font-medium">{product.material}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Size Range</span>
                    <p className="font-medium">{product.sizeRange}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Pressure Rating</span>
                    <p className="font-medium">{product.pressureRating}</p>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600 dark:text-gray-400">Temperature Range</span>
                    <p className="font-medium">{product.temperatureRange}</p>
                  </div>
                </div>

                {product.additionalSpecs && (
                  <div className="pt-4 border-t">
                    <h4 className="font-medium mb-2">Additional Specifications</h4>
                    <ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                      {product.additionalSpecs.map((spec, index) => (
                        <li key={index}>• {spec}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Applications */}
            {product.applications && (
              <Card>
                <CardHeader>
                  <CardTitle>Applications</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {product.applications.map((app, index) => (
                      <li key={index} className="flex items-start">
                        <span className="text-tecal-600 dark:text-green-400 mr-2">•</span>
                        {app}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                onClick={handleQuotationClick}
                className="flex-1 bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
              >
                <ShoppingCart className="mr-2 h-4 w-4" />
                Request Quote
              </Button>
              <Button variant="outline" className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                Download Specs
              </Button>
              <Button variant="outline">
                <Share2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Quotation Modal */}
        <QuotationModal isOpen={isQuotationModalOpen} onClose={closeQuotationModal} product={product} />
      </div>
    </div>
  )
} 