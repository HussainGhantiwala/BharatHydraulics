"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AddProductModal } from "@/components/add-product-modal"
import { QuotationRequests } from "@/components/quotation-requests"
import { VisitorManagement } from "@/components/visitor-management"
import { ProfileSettings } from "@/components/profile-settings"
import { supabase } from "@/lib/supabase"
import { AuthService } from "@/lib/auth"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Plus, Package, Quote, Users, TrendingUp, Eye, Edit, Trash2, Loader2, LogOut } from "lucide-react"

interface Product {
  id: string
  name: string
  category: string
  price: string
  image_url: string
  description: string
  specifications: string[]
  status: "active" | "inactive"
  created_at: string
}

export default function ClientDashboard() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [quotationCount, setQuotationCount] = useState(0)
  const [visitorCount, setVisitorCount] = useState(0)
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [currentUser, setCurrentUser] = useState<any>(null)
  const { toast } = useToast()
  const router = useRouter()

  // Check authentication
  useEffect(() => {
    const authData = AuthService.getStoredAuthData()
    if (!authData) {
      router.push("/client")
      return
    }
    setCurrentUser(authData.user)
  }, [router])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch products: " + error.message,
        variant: "destructive",
      })
    }
  }

  const fetchCategories = async () => {
    try {
      const { data, error } = await supabase.from("categories").select("name").order("name")

      if (error) throw error
      setCategories(data?.map((cat) => cat.name) || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch categories: " + error.message,
        variant: "destructive",
      })
    }
  }

  const fetchQuotationCount = async () => {
    try {
      const { count, error } = await supabase.from("quotation_requests").select("*", { count: "exact", head: true })

      if (error) throw error
      setQuotationCount(count || 0)
    } catch (error: any) {
      console.error("Failed to fetch quotation count:", error.message)
    }
  }

  const fetchVisitorCount = async () => {
    try {
      const { count, error } = await supabase.from("customers").select("*", { count: "exact", head: true })

      if (error) throw error
      setVisitorCount(count || 0)
    } catch (error: any) {
      console.error("Failed to fetch visitor count:", error.message)
    }
  }

  const deleteProduct = async (productId: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", productId)

      if (error) throw error

      toast({
        title: "Product Deleted",
        description: "Product has been successfully deleted.",
      })

      fetchProducts() // Refresh the list
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to delete product: " + error.message,
        variant: "destructive",
      })
    }
  }

  const handleLogout = () => {
    AuthService.logout()
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    })
    router.push("/client")
  }

  useEffect(() => {
    if (currentUser) {
      const loadData = async () => {
        setIsLoading(true)
        await Promise.all([fetchProducts(), fetchCategories(), fetchQuotationCount(), fetchVisitorCount()])
        setIsLoading(false)
      }

      loadData()
    }
  }, [currentUser])

  const stats = [
    { title: "Total Products", value: products.length, icon: Package, color: "text-blue-600" },
    {
      title: "Active Products",
      value: products.filter((p) => p.status === "active").length,
      icon: TrendingUp,
      color: "text-green-600",
    },
    { title: "Quote Requests", value: quotationCount, icon: Quote, color: "text-orange-600" },
    { title: "Website Visitors", value: visitorCount, icon: Users, color: "text-purple-600" },
  ]

  const handleProductAdded = () => {
    fetchProducts()
    fetchCategories() // Refresh categories in case a new one was added
    fetchVisitorCount() // Refresh visitor count
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-600 dark:text-green-400" />
          <p className="text-gray-600 dark:text-gray-400">Checking authentication...</p>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-600 dark:text-green-400" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Client Dashboard</h1>
            <p className="text-gray-600 dark:text-gray-400">
              Welcome back, {currentUser.full_name || currentUser.username}
            </p>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setIsAddProductOpen(true)}
              className="bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Product
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{stat.title}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                  <stat.icon className={`h-8 w-8 ${stat.color}`} />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Main Content */}
        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="products">Products</TabsTrigger>
            <TabsTrigger value="quotations">Quotations</TabsTrigger>
            <TabsTrigger value="visitors">Visitors</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Product Management</CardTitle>
              </CardHeader>
              <CardContent>
                {products.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">No products found</p>
                    <Button
                      onClick={() => setIsAddProductOpen(true)}
                      className="bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Your First Product
                    </Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {products.map((product) => (
                      <Card key={product.id} className="group">
                        <CardContent className="p-0">
                          <div className="relative">
                            <img
                              src={product.image_url || "/placeholder.svg"}
                              alt={product.name}
                              className="w-full h-48 object-cover rounded-t-lg"
                            />
                            <Badge
                              className={`absolute top-3 right-3 ${
                                product.status === "active" ? "bg-green-600" : "bg-gray-600"
                              }`}
                            >
                              {product.status}
                            </Badge>
                          </div>

                          <div className="p-4">
                            <h3 className="font-semibold text-lg mb-2 text-gray-900 dark:text-white">{product.name}</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{product.category}</p>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                              {product.description}
                            </p>

                            <div className="flex justify-between items-center">
                              <span className="font-bold text-teal-600 dark:text-green-400">{product.price}</span>
                              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button size="sm" variant="outline">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button size="sm" variant="outline">
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="text-red-600 border-red-600"
                                  onClick={() => deleteProduct(product.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="quotations">
            <QuotationRequests />
          </TabsContent>

          <TabsContent value="visitors">
            <VisitorManagement />
          </TabsContent>

          <TabsContent value="settings">
            <ProfileSettings user={currentUser} />
          </TabsContent>
        </Tabs>
      </div>

      <AddProductModal
        isOpen={isAddProductOpen}
        onClose={() => setIsAddProductOpen(false)}
        onAdd={handleProductAdded}
        categories={categories}
      />
    </div>
  )
}
