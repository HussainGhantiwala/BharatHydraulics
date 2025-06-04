"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useCategories } from "@/hooks/use-categories"
import { useRouter, useSearchParams } from "next/navigation"

export function CategoryFilter() {
  const { categories } = useCategories()
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentCategory = searchParams.get("category")

  const handleCategoryClick = (categoryName: string) => {
    if (currentCategory === categoryName.toLowerCase()) {
      router.push("/")
    } else {
      router.push(`/?category=${categoryName.toLowerCase()}`)
    }
  }

  return (
    <Card className="border-teal-200 dark:border-green-800">
      <CardHeader>
        <CardTitle className="text-teal-600 dark:text-green-400">Categories</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Button
          variant={!currentCategory ? "default" : "ghost"}
          className={`w-full justify-start ${
            !currentCategory
              ? "bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
              : "hover:bg-teal-50 dark:hover:bg-green-950"
          }`}
          onClick={() => router.push("/")}
        >
          All Products
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={currentCategory === category.name.toLowerCase() ? "default" : "ghost"}
            className={`w-full justify-start ${
              currentCategory === category.name.toLowerCase()
                ? "bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
                : "hover:bg-teal-50 dark:hover:bg-green-950"
            }`}
            onClick={() => handleCategoryClick(category.name)}
          >
            {category.name}
          </Button>
        ))}
      </CardContent>
    </Card>
  )
}
