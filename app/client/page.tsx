"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Edit, Trash2, Package, Tag, FileText, MessageSquare, Database } from "lucide-react"
import { useSupabaseProducts } from "@/hooks/use-supabase-products"
import { useCategories } from "@/hooks/use-categories"
import { useSupabaseQuotations } from "@/hooks/use-supabase-quotations"
import { useRouter } from "next/navigation"
import { ImageUpload } from "@/components/image-upload"
import { QuotationManagement } from "@/components/quotation-management"
import { FollowUpManagement } from "@/components/follow-up-management"
import { useSupabaseAuth } from "@/hooks/use-supabase-auth"
import { SupabaseConnectionStatus } from "@/components/supabase-connection-status"
import { SupabaseSetupGuide } from "@/components/supabase-setup-guide"

export default function ClientPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useSupabaseProducts()
  const { categories, addCategory, deleteCategory } = useCategories()
  const { quotations } = useSupabaseQuotations()
  const { user, signOut } = useSupabaseAuth()
  const router = useRouter()

  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    image: "",
    featured: false,
  })

  const [categoryForm, setCategoryForm] = useState({
    name: "",
    description: "",
  })

  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [showSetupGuide, setShowSetupGuide] = useState(false)

  useEffect(() => {
    const isAuthenticated = localStorage.getItem("client-authenticated")
    if (!isAuthenticated && !user) {
      router.push("/client/login")
    }
  }, [router, user])

  const handleProductSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingProduct) {
      await updateProduct(editingProduct, {
        ...productForm,
        price: Number.parseFloat(productForm.price),
      })
      setEditingProduct(null)
    } else {
      await addProduct({
        ...productForm,
        price: Number.parseFloat(productForm.price),
      })
    }
    setProductForm({ name: "", description: "", price: "", category: "", image: "", featured: false })
  }

  const handleCategorySubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addCategory(categoryForm)
    setCategoryForm({ name: "", description: "" })
  }

  const handleEditProduct = (product: any) => {
    setProductForm({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      category: product.category,
      image: product.image,
      featured: product.featured,
    })
    setEditingProduct(product.id)
  }

  const handleLogout = async () => {
    await signOut()
    localStorage.removeItem("client-authenticated")
    router.push("/client/login")
  }

  return (
    <div className="min-h-screen py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-4 mb-4">
              <h1 className="text-3xl font-bold text-teal-600 dark:text-green-400">Client Dashboard</h1>
              <SupabaseConnectionStatus />
            </div>
            <p className="text-gray-600 dark:text-gray-300">Bharat Hydraulics & Engineering Co.</p>
            <div className="flex justify-center gap-2 mt-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => setShowSetupGuide(!showSetupGuide)}
                className="border-teal-300 text-teal-600 hover:bg-teal-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950"
              >
                <Database className="h-4 w-4 mr-2" />
                {showSetupGuide ? "Hide" : "Show"} Supabase Setup
              </Button>
            </div>
          </div>

          {showSetupGuide && (
            <div className="mb-8">
              <SupabaseSetupGuide />
            </div>
          )}

          <Tabs defaultValue="products" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="products" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Products
              </TabsTrigger>
              <TabsTrigger value="categories" className="flex items-center gap-2">
                <Tag className="h-4 w-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="quotations" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Quotations
              </TabsTrigger>
              <TabsTrigger value="followups" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Follow-ups
              </TabsTrigger>
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              <Card className="border-teal-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-teal-600 dark:text-green-400">
                    <Plus className="h-5 w-5" />
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleProductSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="productName">Product Name</Label>
                        <Input
                          id="productName"
                          value={productForm.name}
                          onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                          required
                          className="border-teal-200 dark:border-green-800"
                        />
                      </div>
                      <div>
                        <Label htmlFor="productPrice">Price</Label>
                        <Input
                          id="productPrice"
                          type="number"
                          step="0.01"
                          value={productForm.price}
                          onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                          required
                          className="border-teal-200 dark:border-green-800"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="productCategory">Category</Label>
                      <Select
                        value={productForm.category}
                        onValueChange={(value) => setProductForm((prev) => ({ ...prev, category: value }))}
                      >
                        <SelectTrigger className="border-teal-200 dark:border-green-800">
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.name}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="productImage">Product Image</Label>
                      <ImageUpload
                        value={productForm.image}
                        onChange={(value) => setProductForm((prev) => ({ ...prev, image: value }))}
                      />
                    </div>
                    <div>
                      <Label htmlFor="productDescription">Description</Label>
                      <Textarea
                        id="productDescription"
                        value={productForm.description}
                        onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="border-teal-200 dark:border-green-800"
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="featured"
                        checked={productForm.featured}
                        onChange={(e) => setProductForm((prev) => ({ ...prev, featured: e.target.checked }))}
                        className="rounded border-teal-300 text-teal-600 focus:ring-teal-500"
                      />
                      <Label htmlFor="featured">Featured Product</Label>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="submit"
                        className="bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
                      >
                        {editingProduct ? "Update Product" : "Add Product"}
                      </Button>
                      {editingProduct && (
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setEditingProduct(null)
                            setProductForm({
                              name: "",
                              description: "",
                              price: "",
                              category: "",
                              image: "",
                              featured: false,
                            })
                          }}
                        >
                          Cancel
                        </Button>
                      )}
                      <Button type="button" variant="outline" onClick={handleLogout} className="ml-auto">
                        Logout
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-teal-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-teal-600 dark:text-green-400">Existing Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {products.map((product) => (
                      <div
                        key={product.id}
                        className="flex items-center justify-between p-4 border rounded-lg border-teal-200 dark:border-green-800"
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={product.image || "/placeholder.svg?height=60&width=60"}
                            alt={product.name}
                            className="w-15 h-15 object-cover rounded"
                          />
                          <div>
                            <h3 className="font-semibold">{product.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-300">{product.category}</p>
                            <p className="text-sm font-medium text-teal-600 dark:text-green-400">${product.price}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditProduct(product)}
                            className="border-teal-300 text-teal-600 hover:bg-teal-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteProduct(product.id)}
                            className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <Card className="border-teal-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-teal-600 dark:text-green-400">
                    <Plus className="h-5 w-5" />
                    Add New Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCategorySubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="categoryName">Category Name</Label>
                      <Input
                        id="categoryName"
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm((prev) => ({ ...prev, name: e.target.value }))}
                        required
                        className="border-teal-200 dark:border-green-800"
                      />
                    </div>
                    <div>
                      <Label htmlFor="categoryDescription">Description</Label>
                      <Textarea
                        id="categoryDescription"
                        value={categoryForm.description}
                        onChange={(e) => setCategoryForm((prev) => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="border-teal-200 dark:border-green-800"
                      />
                    </div>
                    <Button
                      type="submit"
                      className="bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
                    >
                      Add Category
                    </Button>
                  </form>
                </CardContent>
              </Card>

              <Card className="border-teal-200 dark:border-green-800">
                <CardHeader>
                  <CardTitle className="text-teal-600 dark:text-green-400">Existing Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className="flex items-center justify-between p-4 border rounded-lg border-teal-200 dark:border-green-800"
                      >
                        <div>
                          <h3 className="font-semibold">{category.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300">{category.description}</p>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => deleteCategory(category.id)}
                          className="border-red-300 text-red-600 hover:bg-red-50 dark:border-red-700 dark:text-red-400 dark:hover:bg-red-950"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="quotations" className="space-y-6">
              <QuotationManagement />
            </TabsContent>

            <TabsContent value="followups" className="space-y-6">
              <FollowUpManagement quotations={quotations} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}
