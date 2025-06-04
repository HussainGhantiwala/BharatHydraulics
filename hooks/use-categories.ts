"use client"

import { useState, useEffect } from "react"

interface Category {
  id: string
  name: string
  description: string
}

const initialCategories: Category[] = [
  {
    id: "1",
    name: "Drainage Pipes",
    description: "PVC pipes for drainage and sewer systems",
  },
  {
    id: "2",
    name: "Pressure Pipes",
    description: "High-pressure pipes for water supply systems",
  },
  {
    id: "3",
    name: "Pipe Fittings",
    description: "Elbows, tees, reducers and other pipe connections",
  },
  {
    id: "4",
    name: "Valves",
    description: "Ball valves, gate valves and flow control devices",
  },
  {
    id: "5",
    name: "Tools",
    description: "Pipe cutting and installation tools",
  },
  {
    id: "6",
    name: "Adhesives",
    description: "Solvent cements and pipe joining compounds",
  },
]

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([])

  useEffect(() => {
    const savedCategories = localStorage.getItem("catalog-categories")
    if (savedCategories) {
      setCategories(JSON.parse(savedCategories))
    } else {
      setCategories(initialCategories)
      localStorage.setItem("catalog-categories", JSON.stringify(initialCategories))
    }
  }, [])

  const addCategory = (categoryData: Omit<Category, "id">) => {
    const newCategory = {
      ...categoryData,
      id: Date.now().toString(),
    }
    const updatedCategories = [...categories, newCategory]
    setCategories(updatedCategories)
    localStorage.setItem("catalog-categories", JSON.stringify(updatedCategories))
  }

  const deleteCategory = (id: string) => {
    const updatedCategories = categories.filter((category) => category.id !== id)
    setCategories(updatedCategories)
    localStorage.setItem("catalog-categories", JSON.stringify(updatedCategories))
  }

  return {
    categories,
    addCategory,
    deleteCategory,
  }
}
