"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useProducts } from "@/contexts/product-context"
import {
  Plus,
  Save,
  Trash2,
  Lock,
  Eye,
  EyeOff,
  Edit,
  Users,
  BarChart3,
  Package,
  Tags,
  AlertCircle,
  RefreshCw,
  FileText,
  Mail,
  Clock,
  XCircle,
} from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import { ImageUpload } from "@/components/image-upload"
// Import EmailJS
import emailjs from "@emailjs/browser"
import { projectGetSourceForAsset } from "next/dist/build/swc/generated-native"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const ADMIN_PASSWORD = "admin123"

interface UserInquiry {
  id: string
  name: string
  email: string
  phone?: string
  location?: string
  message?: string
  created_at: string
}

interface Quotation {
  id: string
  product_id: string
  product_name: string
  customer_name: string
  customer_email: string
  customer_phone?: string
  company?: string
  quantity: string
  preferred_size: string
  preferred_material: string
  additional_requirements?: string
  status: "pending" | "quoted" | "accepted" | "rejected"
  admin_response?: string
  quoted_price?: number
  created_at: string
  updated_at: string
}

export default function AdminPage() {
  const {
    products,
    addProduct,
    removeProduct,
    updateProduct,
    categories,
    addCategory,
    removeCategory,
    loading,
    error,
    refreshData,
  } = useProducts()

  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [authError, setAuthError] = useState("")
  const [activeTab, setActiveTab] = useState("products")
  const [userInquiries, setUserInquiries] = useState<UserInquiry[]>([])
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [newCategory, setNewCategory] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [operationError, setOperationError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    material: "",
    sizeRange: "",
    pressureRating: "",
    temperatureRange: "",
    image: "",
    applications: "",
    additionalSpecs: "",
  })

  useEffect(() => {
    // Initialize EmailJS with the public key
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC1_KEY!)

    const authenticated = sessionStorage.getItem("admin_authenticated")
    if (authenticated === "true") {
      setIsAuthenticated(true)
      fetchUserInquiries()
      fetchQuotations()
    }
  }, [])

  const fetchUserInquiries = async () => {
    try {
      const { data, error } = await supabase
        .from("user_inquiries")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching user inquiries:", error)
        setOperationError(`Error fetching user inquiries: ${error.message}`)
      } else {
        setUserInquiries(data || [])
        setOperationError(null)
      }
    } catch (error) {
      console.error("Error:", error)
      setOperationError(`Unexpected error: ${error}`)
    }
  }

  const fetchQuotations = async () => {
    try {
      const { data, error } = await supabase.from("quotations").select("*").order("created_at", { ascending: false })

      if (error) {
        console.error("Error fetching quotations:", error)
        setOperationError(`Error fetching quotations: ${error.message}`)
      } else {
        setQuotations(data || [])
        setOperationError(null)
      }
    } catch (error) {
      console.error("Error:", error)
      setOperationError(`Unexpected error: ${error}`)
    }
  }

  const updateQuotationStatus = async (
    quotationId: string,
    status: string,
    adminResponse?: string,
    quotedPrice?: number,
  ) => {
    try {
      const updateData: any = { status }
      if (adminResponse) updateData.admin_response = adminResponse
      if (quotedPrice) updateData.quoted_price = quotedPrice

      const { error } = await supabase.from("quotations").update(updateData).eq("id", quotationId)

      if (error) {
        console.error("Error updating quotation:", error)
        setOperationError(`Error updating quotation: ${error.message}`)
      } else {
        await fetchQuotations()
        alert("Quotation updated successfully!")
      }
    } catch (error) {
      console.error("Error:", error)
      setOperationError(`Unexpected error: ${error}`)
    }
  }

  const sendQuotationEmail = async (
    quotation: Quotation,
    adminResponse: string,
    quotedPrice?: number,
  ) => {
    try {
      const templateParams = {
        to_email: quotation.customer_email,
        to_name: quotation.customer_name,
        customer_name: quotation.customer_name,
        customer_company: quotation.company || "N/A",
        customer_email: quotation.customer_email,
        customer_phone: quotation.customer_phone || "N/A",
        product_name: quotation.product_name,
        quantity: quotation.quantity,
        preferred_size: quotation.preferred_size,
        preferred_material: quotation.preferred_material,
        additional_requirements: quotation.additional_requirements || "None",
        quotation_details: adminResponse,
        quoted_price: quotedPrice ? `₹${quotedPrice}` : "To be discussed",
        request_date: new Date(quotation.created_at).toLocaleDateString(),
        quotation_date: new Date().toLocaleDateString(),
        from_name: process.env.NEXT_PUBLIC_EMAILJS_FROM_NAME!,
        company_email: process.env.NEXT_PUBLIC_EMAILJS_COMPANY_EMAIL!,
        company_phone: process.env.NEXT_PUBLIC_EMAILJS_COMPANY_PHONE!,
        company_address: process.env.NEXT_PUBLIC_EMAILJS_COMPANY_ADDRESS!,
      }

      const response = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE1_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE1_ID!,
        templateParams,
      )

      if (response.status === 200) {
        console.log("Email sent successfully:", response)
        alert("Quotation email sent successfully!")
      } else {
        throw new Error("Failed to send email")
      }
    } catch (error) {
      console.error("Error sending email:", error)
      setOperationError(`Failed to send email: ${error}`)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true)
      setAuthError("")
      sessionStorage.setItem("admin_authenticated", "true")
      fetchUserInquiries()
      fetchQuotations()
    } else {
      setAuthError("Invalid password. Please try again.")
      setPassword("")
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    sessionStorage.removeItem("admin_authenticated")
    setPassword("")
    setUserInquiries([])
    setQuotations([])
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setOperationError(null)

    if (
      !formData.name ||
      !formData.description ||
      !formData.category ||
      !formData.material ||
      !formData.sizeRange ||
      !formData.pressureRating ||
      !formData.temperatureRange
    ) {
      setOperationError("Please fill in all required fields.")
      setIsSubmitting(false)
      return
    }

    const productData = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      category: formData.category,
      material: formData.material.trim(),
      sizeRange: formData.sizeRange.trim(),
      pressureRating: formData.pressureRating.trim(),
      temperatureRange: formData.temperatureRange.trim(),
      image: formData.image.trim() || undefined,
      applications: formData.applications
        ? formData.applications
            .split("\n")
            .filter((app) => app.trim())
            .map((app) => app.trim())
        : undefined,
      additionalSpecs: formData.additionalSpecs
        ? formData.additionalSpecs
            .split("\n")
            .filter((spec) => spec.trim())
            .map((spec) => spec.trim())
        : undefined,
    }

    console.log("Submitting product data:", productData)

    try {
      let success = false
      if (editingProduct) {
        success = await updateProduct(editingProduct, productData)
        if (success) {
          setEditingProduct(null)
          alert("Product updated successfully!")
        }
      } else {
        success = await addProduct(productData)
        if (success) {
          alert("Product added successfully!")
        }
      }

      if (success) {
        setFormData({
          name: "",
          description: "",
          category: "",
          material: "",
          sizeRange: "",
          pressureRating: "",
          temperatureRange: "",
          image: "",
          applications: "",
          additionalSpecs: "",
        })
        setOperationError(null)
      } else {
        setOperationError(error || "Operation failed. Please try again.")
      }
    } catch (error) {
      console.error("Error:", error)
      setOperationError(`An unexpected error occurred: ${error}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (product: any) => {
    setEditingProduct(product.id)
    setFormData({
      name: product.name,
      description: product.description,
      category: product.category,
      material: product.material,
      sizeRange: product.sizeRange,
      pressureRating: product.pressureRating,
      temperatureRange: product.temperatureRange,
      image: product.image || "",
      applications: product.applications ? product.applications.join("\n") : "",
      additionalSpecs: product.additionalSpecs ? product.additionalSpecs.join("\n") : "",
    })
    setActiveTab("products")
    setOperationError(null)
  }

  const handleCancelEdit = () => {
    setEditingProduct(null)
    setFormData({
      name: "",
      description: "",
      category: "",
      material: "",
      sizeRange: "",
      pressureRating: "",
      temperatureRange: "",
      image: "",
      applications: "",
      additionalSpecs: "",
    })
    setOperationError(null)
  }

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    setOperationError(null)

    if (!newCategory.trim()) {
      setOperationError("Please enter a category name.")
      return
    }

    const success = await addCategory(newCategory.trim())
    if (success) {
      setNewCategory("")
      alert("Category added successfully!")
      setOperationError(null)
    } else {
      setOperationError(error || "Failed to add category. Please try again.")
    }
  }

  const handleRemoveCategory = async (category: string) => {
    if (window.confirm(`Are you sure you want to remove the category "${category}"?`)) {
      setOperationError(null)
      const success = await removeCategory(category)
      if (!success) {
        setOperationError(error || `Cannot remove category "${category}". It may be in use by existing products.`)
      }
    }
  }

  const handleRemoveProduct = async (productId: string) => {
    if (window.confirm(`Are you sure you want to remove this product?`)) {
      setOperationError(null)
      const success = await removeProduct(productId)
      if (success) {
        alert("Product removed successfully!")
        setOperationError(null)
      } else {
        setOperationError(error || "Failed to remove product. Please try again.")
      }
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (value: string) => {
    setFormData({
      ...formData,
      category: value,
    })
  }

  const handleRefresh = async () => {
    setOperationError(null)
    await refreshData()
    await fetchUserInquiries()
    await fetchQuotations()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100"
      case "quoted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100"
      case "accepted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-100"
    }
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center bg-gradient-to-br from-teal-50 to-blue-50 dark:from-gray-900 dark:to-green-950">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          <Card className="shadow-2xl border-0">
            <CardHeader className="text-center space-y-4">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                className="mx-auto w-16 h-16 bg-teal-100 dark:bg-green-900 rounded-full flex items-center justify-center"
              >
                <Lock className="h-8 w-8 text-teal-600 dark:text-green-400" />
              </motion.div>
              <CardTitle className="text-2xl font-bold">Admin Access</CardTitle>
              <CardDescription>Enter password to access the admin panel</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter admin password"
                      className="pr-10"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                {authError && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-600 text-sm"
                  >
                    {authError}
                  </motion.p>
                )}
                <Button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
                >
                  <Lock className="mr-2 h-4 w-4" />
                  Access Admin Panel
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen py-20 flex items-center justify-center">
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center">
          <div className="w-16 h-16 border-4 border-teal-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-lg text-gray-600 dark:text-gray-300">Loading admin panel...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div initial="initial" animate="animate" variants={fadeInUp} className="text-center mb-12">
          <div className="flex justify-between items-center mb-6">
            <div className="flex-1">
              <Badge
                variant="secondary"
                className="bg-teal-100 text-teal-800 dark:bg-green-900 dark:text-green-100 mb-4"
              >
                Admin Panel
              </Badge>
              <h1 className="text-4xl lg:text-5xl font-bold mb-6">
                Business
                <span className="text-teal-600 dark:text-green-400"> Management</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                Manage your products, categories, quotations, and view customer inquiries.
              </p>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleRefresh} variant="outline" className="ml-4">
                <RefreshCw className="mr-2 h-4 w-4" />
                Refresh
              </Button>
              <Button onClick={handleLogout} variant="outline">
                Logout
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Error Display */}
        {(error || operationError) && (
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
            <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <div className="flex items-center">
                <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 mr-2" />
                <p className="text-red-800 dark:text-red-200">{error || operationError}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Navigation Tabs */}
        <motion.div initial="initial" animate="animate" variants={fadeInUp} className="mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {[
              { id: "products", label: "Products", icon: Package },
              { id: "categories", label: "Categories", icon: Tags },
              { id: "quotations", label: "Quotations", icon: FileText },
              { id: "traffic", label: "User Traffic", icon: Users },
              { id: "analytics", label: "Analytics", icon: BarChart3 },
            ].map((tab) => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "outline"}
                onClick={() => setActiveTab(tab.id)}
                className={
                  activeTab === tab.id ? "bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700" : ""
                }
              >
                <tab.icon className="mr-2 h-4 w-4" />
                {tab.label}
                {tab.id === "quotations" && quotations.length > 0 && (
                  <Badge variant="secondary" className="ml-2 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100">
                    {quotations.filter((q) => q.status === "pending").length}
                  </Badge>
                )}
              </Button>
            ))}
          </div>
        </motion.div>

        {/* Products Tab */}
        {activeTab === "products" && (
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Add/Edit Product Form */}
            <motion.div initial="initial" animate="animate" variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    {editingProduct ? <Edit className="mr-2 h-6 w-6" /> : <Plus className="mr-2 h-6 w-6" />}
                    {editingProduct ? "Edit Product" : "Add New Product"}
                  </CardTitle>
                  <CardDescription>
                    {editingProduct
                      ? "Update the product information below."
                      : "Fill out the form below to add a new product to your catalogue."}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Product Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="e.g., Heavy Duty PVC Pipe Clamp"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        required
                        rows={3}
                        placeholder="Detailed product description..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category">Category *</Label>
                      <Select value={formData.category} onValueChange={handleSelectChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="material">Material *</Label>
                        <Input
                          id="material"
                          name="material"
                          value={formData.material}
                          onChange={handleChange}
                          required
                          placeholder="e.g., PVC, CPVC, ABS"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="sizeRange">Size Range *</Label>
                        <Input
                          id="sizeRange"
                          name="sizeRange"
                          value={formData.sizeRange}
                          onChange={handleChange}
                          required
                          placeholder="e.g., 1/2\"
                        />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pressureRating">Pressure Rating *</Label>
                        <Input
                          id="pressureRating"
                          name="pressureRating"
                          value={formData.pressureRating}
                          onChange={handleChange}
                          required
                          placeholder="e.g., 200 PSI"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="temperatureRange">Temperature Range *</Label>
                        <Input
                          id="temperatureRange"
                          name="temperatureRange"
                          value={formData.temperatureRange}
                          onChange={handleChange}
                          required
                          placeholder="e.g., -10°C to 60°C"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="image">Product Image</Label>
                      <ImageUpload
                        onImageUpload={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
                        currentImage={formData.image}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="applications">Applications (one per line)</Label>
                      <Textarea
                        id="applications"
                        name="applications"
                        value={formData.applications}
                        onChange={handleChange}
                        rows={4}
                        placeholder="Water supply systems\nIndustrial piping\nChemical processing\nHVAC systems"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="additionalSpecs">Additional Specifications (one per line)</Label>
                      <Textarea
                        id="additionalSpecs"
                        name="additionalSpecs"
                        value={formData.additionalSpecs}
                        onChange={handleChange}
                        rows={4}
                        placeholder="NSF certified\nUV resistant\nCorrosion resistant\nEasy installation"
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        type="submit"
                        className="flex-1 bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
                        size="lg"
                        disabled={isSubmitting}
                      >
                        <Save className="mr-2 h-4 w-4" />
                        {isSubmitting ? "Saving..." : editingProduct ? "Update Product" : "Add Product"}
                      </Button>
                      {editingProduct && (
                        <Button type="button" variant="outline" onClick={handleCancelEdit} size="lg">
                          Cancel
                        </Button>
                      )}
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Product List */}
            <motion.div initial="initial" animate="animate" variants={fadeInUp}>
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">Current Products ({products.length})</CardTitle>
                  <CardDescription>Manage your existing product catalogue.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    {products.map((product) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="flex items-center justify-between p-4 border rounded-lg hover:shadow-md transition-shadow"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{product.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{product.category}</p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(product)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveProduct(product.id)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </motion.div>
                    ))}

                    {products.length === 0 && (
                      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                        No products added yet. Add your first product using the form.
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <motion.div initial="initial" animate="animate" variants={fadeInUp} className="max-w-2xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Tags className="mr-2 h-6 w-6" />
                  Manage Categories
                </CardTitle>
                <CardDescription>Add new product categories and view existing ones.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Add Category Form */}
                <form onSubmit={handleAddCategory} className="flex gap-4">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="Enter new category name"
                    className="flex-1"
                  />
                  <Button
                    type="submit"
                    className="bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add Category
                  </Button>
                </form>

                {/* Categories List */}
                <div>
                  <h3 className="text-lg font-semibold mb-4">Current Categories ({categories.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {categories.map((category, index) => (
                      <div
                        key={index}
                        className="flex items-center gap-2 bg-teal-100 dark:bg-green-900 rounded-full pr-2"
                      >
                        <Badge
                          variant="secondary"
                          className="flex-1 justify-center py-2 px-4 text-sm bg-transparent text-teal-800 dark:text-green-100"
                        >
                          {category}
                        </Badge>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveCategory(category)}
                          className="h-6 w-6 p-0 rounded-full text-red-600 hover:text-red-700 hover:bg-red-100 dark:hover:bg-red-900"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quotations Tab */}
        {activeTab === "quotations" && (
          <motion.div initial="initial" animate="animate" variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <FileText className="mr-2 h-6 w-6" />
                  Quotation Requests ({quotations.length})
                </CardTitle>
                <CardDescription>Manage customer quotation requests and provide pricing.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6 max-h-96 overflow-y-auto">
                  {quotations.map((quotation) => (
                    <motion.div
                      key={quotation.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-6 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h4 className="font-semibold text-lg">{quotation.product_name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Request from {quotation.customer_name}
                          </p>
                        </div>
                        <Badge className={getStatusColor(quotation.status)}>
                          {quotation.status.charAt(0).toUpperCase() + quotation.status.slice(1)}
                        </Badge>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <h5 className="font-medium mb-2">Customer Details</h5>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="font-medium">Email:</span> {quotation.customer_email}
                            </p>
                            {quotation.customer_phone && (
                              <p>
                                <span className="font-medium">Phone:</span> {quotation.customer_phone}
                              </p>
                            )}
                            {quotation.company && (
                              <p>
                                <span className="font-medium">Company:</span> {quotation.company}
                              </p>
                            )}
                          </div>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Requirements</h5>
                          <div className="space-y-1 text-sm">
                            <p>
                              <span className="font-medium">Quantity:</span> {quotation.quantity}
                            </p>
                            <p>
                              <span className="font-medium">Size:</span> {quotation.preferred_size}
                            </p>
                            <p>
                              <span className="font-medium">Material:</span> {quotation.preferred_material}
                            </p>
                          </div>
                        </div>
                      </div>

                      {quotation.additional_requirements && (
                        <div className="mb-4">
                          <h5 className="font-medium mb-2">Additional Requirements</h5>
                          <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-md">
                            {quotation.additional_requirements}
                          </p>
                        </div>
                      )}

                      <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {new Date(quotation.created_at).toLocaleDateString()} at{" "}
                          {new Date(quotation.created_at).toLocaleTimeString()}
                        </span>
                      </div>

                      {quotation.status === "pending" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              const response = prompt("Enter your response to the customer:")
                              const price = prompt("Enter quoted price (optional):")
                              if (response) {
                                updateQuotationStatus(
                                  quotation.id,
                                  "quoted",
                                  response,
                                  price ? Number.parseFloat(price) : undefined,
                                )
                                sendQuotationEmail(
                                  quotation,
                                  response,
                                  price ? Number.parseFloat(price) : undefined,
                                )
                              }
                            }}
                            className="bg-blue-600 hover:bg-blue-700"
                          >
                            <Mail className="mr-1 h-3 w-3" />
                            Send Quote
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateQuotationStatus(quotation.id, "rejected")}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                          >
                            <XCircle className="mr-1 h-3 w-3" />
                            Reject
                          </Button>
                        </div>
                      )}

                      {quotation.admin_response && (
                        <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-md">
                          <h5 className="font-medium text-blue-800 dark:text-blue-200 mb-1">Admin Response</h5>
                          <p className="text-sm text-blue-700 dark:text-blue-300">{quotation.admin_response}</p>
                          {quotation.quoted_price && (
                            <p className="text-sm font-medium text-blue-800 dark:text-blue-200 mt-1">
                              Quoted Price: ${quotation.quoted_price}
                            </p>
                          )}
                        </div>
                      )}
                    </motion.div>
                  ))}

                  {quotations.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No quotation requests yet. Quotation requests will appear here when customers submit them.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* User Traffic Tab */}
        {activeTab === "traffic" && (
          <motion.div initial="initial" animate="animate" variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Users className="mr-2 h-6 w-6" />
                  User Inquiries ({userInquiries.length})
                </CardTitle>
                <CardDescription>View and manage user inquiries from the welcome modal.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {userInquiries.map((inquiry) => (
                    <motion.div
                      key={inquiry.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 border rounded-lg hover:shadow-md transition-shadow"
                    >
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-lg">{inquiry.name}</h4>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{inquiry.email}</p>
                          {inquiry.phone && <p className="text-sm text-gray-600 dark:text-gray-400">{inquiry.phone}</p>}
                          {inquiry.location && (
                            <p className="text-sm text-gray-600 dark:text-gray-400">{inquiry.location}</p>
                          )}
                        </div>
                        <div>
                          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                            {new Date(inquiry.created_at).toLocaleDateString()} at{" "}
                            {new Date(inquiry.created_at).toLocaleTimeString()}
                          </p>
                          {inquiry.message && (
                            <p className="text-sm bg-gray-50 dark:bg-gray-800 p-3 rounded-md">{inquiry.message}</p>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {userInquiries.length === 0 && (
                    <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                      No user inquiries yet. User inquiries will appear here when visitors submit the welcome modal.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Analytics Tab */}
        {activeTab === "analytics" && (
          <motion.div initial="initial" animate="animate" variants={fadeInUp}>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Total Products</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-teal-600 dark:text-green-400">{products.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-teal-600 dark:text-green-400">{categories.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">Quotation Requests</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-teal-600 dark:text-green-400">{quotations.length}</div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium">User Inquiries</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-teal-600 dark:text-green-400">{userInquiries.length}</div>
                </CardContent>
              </Card>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <BarChart3 className="mr-2 h-6 w-6" />
                    Products by Category
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {categories.map((category) => {
                      const count = products.filter((product) => product.category === category).length
                      const percentage = products.length > 0 ? (count / products.length) * 100 : 0
                      return (
                        <div key={category} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>{category}</span>
                            <span>{count} products</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-teal-600 dark:bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center">
                    <FileText className="mr-2 h-6 w-6" />
                    Quotation Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {["pending", "quoted", "accepted", "rejected"].map((status) => {
                      const count = quotations.filter((quotation) => quotation.status === status).length
                      const percentage = quotations.length > 0 ? (count / quotations.length) * 100 : 0
                      return (
                        <div key={status} className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="capitalize">{status}</span>
                            <span>{count} requests</span>
                          </div>
                          <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                            <div
                              className="bg-teal-600 dark:bg-green-600 h-2 rounded-full transition-all duration-300"
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}