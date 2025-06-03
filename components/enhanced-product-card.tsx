"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Quote, Eye, Star, ArrowRight } from "lucide-react"

interface Product {
  id: string
  name: string
  category: string
  price: string
  image_url: string
  description: string
  specifications: string[]
}

interface EnhancedProductCardProps {
  product: Product
  onViewDetails: (product: Product) => void
  onRequestQuote: (product: Product) => void
}

export function EnhancedProductCard({ product, onViewDetails, onRequestQuote }: EnhancedProductCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Card
      className="group cursor-pointer transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-rotate-1 bg-white dark:bg-gray-800 border-0 shadow-lg overflow-hidden relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={() => onViewDetails(product)}
    >
      <CardContent className="p-0 relative">
        {/* Image Container */}
        <div className="relative overflow-hidden h-56">
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-125 group-hover:rotate-3"
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Category Badge */}
          <Badge className="absolute top-4 left-4 bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-green-500 dark:to-emerald-500 text-white border-0 shadow-lg transform transition-all duration-300 group-hover:scale-110">
            {product.category}
          </Badge>

          {/* Premium Badge */}
          <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center shadow-lg">
              <Star className="h-3 w-3 mr-1" />
              Premium
            </div>
          </div>

          {/* Hover Action Buttons */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
            <div className="flex gap-3">
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation()
                  onViewDetails(product)
                }}
                className="bg-white/95 text-gray-900 hover:bg-white shadow-xl transform hover:scale-110 transition-all duration-300 backdrop-blur-sm"
              >
                <Eye className="h-4 w-4 mr-2" />
                View Details
              </Button>
              <Button
                size="sm"
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 dark:from-green-600 dark:to-emerald-600 dark:hover:from-green-700 dark:hover:to-emerald-700 shadow-xl transform hover:scale-110 transition-all duration-300"
                onClick={(e) => {
                  e.stopPropagation()
                  onRequestQuote(product)
                }}
              >
                <Quote className="h-4 w-4 mr-2" />
                Get Quote
              </Button>
            </div>
          </div>

          {/* Animated Border */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-teal-400 dark:group-hover:border-green-400 transition-all duration-500 rounded-lg opacity-0 group-hover:opacity-100" />
        </div>

        {/* Content */}
        <div className="p-6 relative">
          {/* Animated Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-green-950 dark:to-emerald-950 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-b-lg" />

          <div className="relative z-10">
            <h3 className="font-bold text-lg mb-3 text-gray-900 dark:text-white group-hover:text-teal-600 dark:group-hover:text-green-400 transition-colors duration-300 line-clamp-2">
              {product.name}
            </h3>

            <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3 group-hover:text-gray-700 dark:group-hover:text-gray-300 transition-colors duration-300">
              {product.description}
            </p>

            {/* Specifications Preview */}
            <div className="mb-4 opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-2 group-hover:translate-y-0">
              <div className="flex flex-wrap gap-1">
                {product.specifications.slice(0, 2).map((spec, index) => (
                  <span
                    key={index}
                    className="text-xs bg-teal-100 dark:bg-green-900 text-teal-700 dark:text-green-300 px-2 py-1 rounded-full"
                  >
                    {spec.split(":")[0]}
                  </span>
                ))}
                {product.specifications.length > 2 && (
                  <span className="text-xs text-teal-600 dark:text-green-400 px-2 py-1">
                    +{product.specifications.length - 2} more
                  </span>
                )}
              </div>
            </div>

            {/* Price and CTA */}
            <div className="flex justify-between items-center">
              <div>
                <span className="font-bold text-xl text-teal-600 dark:text-green-400 group-hover:text-teal-700 dark:group-hover:text-green-300 transition-colors duration-300">
                  {product.price}
                </span>
                <div className="text-xs text-gray-500 dark:text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mt-1">
                  Click for details
                </div>
              </div>

              <div className="opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-x-4 group-hover:translate-x-0">
                <ArrowRight className="h-5 w-5 text-teal-600 dark:text-green-400" />
              </div>
            </div>
          </div>
        </div>

        {/* Shine Effect */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        </div>
      </CardContent>
    </Card>
  )
}
