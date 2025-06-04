"use client"

import { useState, useEffect } from "react"

interface Product {
  id: string
  name: string
  description: string
  price: number
  category: string
  image: string
  featured: boolean
}

const initialProducts: Product[] = [
  {
    id: "1",
    name: "PVC Drainage Pipe 110mm",
    description:
      "High-quality PVC drainage pipe, 110mm diameter, 6-meter length. Perfect for residential and commercial drainage systems.",
    price: 45.99,
    category: "Drainage Pipes",
    image: "/placeholder.svg?height=300&width=300&text=PVC+Pipe+110mm",
    featured: true,
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
  },
  {
    id: "3",
    name: "PVC Ball Valve 25mm",
    description: "Premium quality ball valve with lever handle. Suitable for water supply and irrigation systems.",
    price: 24.99,
    category: "Valves",
    image: "/placeholder.svg?height=300&width=300&text=Ball+Valve",
    featured: true,
  },
  {
    id: "4",
    name: "PVC Pressure Pipe 50mm",
    description: "High-pressure PVC pipe for water supply systems. Meets Australian standards for potable water.",
    price: 32.99,
    category: "Pressure Pipes",
    image: "/placeholder.svg?height=300&width=300&text=Pressure+Pipe",
    featured: false,
  },
  {
    id: "5",
    name: "PVC T-Junction",
    description: "Three-way T-junction fitting for connecting multiple pipe sections. Available in various sizes.",
    price: 12.99,
    category: "Pipe Fittings",
    image: "/placeholder.svg?height=300&width=300&text=T-Junction",
    featured: false,
  },
  {
    id: "6",
    name: "PVC Pipe Cutter",
    description: "Professional-grade pipe cutter for clean, precise cuts on PVC pipes up to 63mm diameter.",
    price: 89.99,
    category: "Tools",
    image: "/placeholder.svg?height=300&width=300&text=Pipe+Cutter",
    featured: true,
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
  },
]

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    const savedProducts = localStorage.getItem("catalog-products")
    if (savedProducts) {
      setProducts(JSON.parse(savedProducts))
    } else {
      setProducts(initialProducts)
      localStorage.setItem("catalog-products", JSON.stringify(initialProducts))
    }
  }, [])

  const addProduct = (productData: Omit<Product, "id">) => {
    const newProduct = {
      ...productData,
      id: Date.now().toString(),
    }
    const updatedProducts = [...products, newProduct]
    setProducts(updatedProducts)
    localStorage.setItem("catalog-products", JSON.stringify(updatedProducts))
  }

  const updateProduct = (id: string, productData: Omit<Product, "id">) => {
    const updatedProducts = products.map((product) => (product.id === id ? { ...productData, id } : product))
    setProducts(updatedProducts)
    localStorage.setItem("catalog-products", JSON.stringify(updatedProducts))
  }

  const deleteProduct = (id: string) => {
    const updatedProducts = products.filter((product) => product.id !== id)
    setProducts(updatedProducts)
    localStorage.setItem("catalog-products", JSON.stringify(updatedProducts))
  }

  return {
    products,
    addProduct,
    updateProduct,
    deleteProduct,
  }
}
