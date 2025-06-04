"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star } from "lucide-react"

interface ProductCardProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    category: string
    image: string
    featured: boolean
  }
  onClick: () => void
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  return (
    <Card
      className="group cursor-pointer border-teal-200 dark:border-green-800 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 hover:scale-105"
      onClick={onClick}
    >
      <CardContent className="p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          {product.featured && (
            <Badge className="absolute top-2 left-2 z-10 bg-teal-600 dark:bg-green-600">Featured</Badge>
          )}
          <img
            src={product.image || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>

        <div className="p-4">
          <div className="flex items-center justify-between mb-2">
            <Badge
              variant="secondary"
              className="text-xs bg-teal-100 text-teal-800 dark:bg-green-900 dark:text-green-200"
            >
              {product.category}
            </Badge>
            <div className="flex items-center space-x-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm text-gray-600 dark:text-gray-300">4.5</span>
            </div>
          </div>

          <h3 className="font-semibold text-lg mb-2 group-hover:text-teal-600 dark:group-hover:text-green-400 transition-colors">
            {product.name}
          </h3>

          <p className="text-gray-600 dark:text-gray-300 text-sm mb-3 line-clamp-2">{product.description}</p>

          <div className="flex items-center justify-between">
            <span className="text-2xl font-bold text-teal-600 dark:text-green-400">${product.price}</span>
            <span className="text-sm text-gray-500 dark:text-gray-400">Click to view</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
