"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Upload, Plus, Minus } from "lucide-react"

interface Product {
  name: string
  category: string
  price: string
  image_url: string
  description: string
  specifications: string[]
  status: "active" | "inactive"
}

interface AddProductModalProps {
  isOpen: boolean
  onClose: () => void
  onAdd: () => void
  categories: string[]
}

export function AddProductModal({ isOpen, onClose, onAdd, categories }: AddProductModalProps) {
  const [formData, setFormData] = useState<Product>({
    name: "",
    category: "",
    price: "Contact for Quote",
    image_url: "/placeholder.svg?height=300&width=300",
    description: "",
    specifications: [""],
    status: "active",
  })
  const [newCategory, setNewCategory] = useState("")
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      if (!formData.name || !formData.category || !formData.description) {
        throw new Error("Please fill in all required fields.")
      }

      // Filter out empty specifications
      const filteredSpecs = formData.specifications.filter((spec) => spec.trim() !== "")

      // Insert product into Supabase
      const { data, error } = await supabase
        .from("products")
        .insert([
          {
            name: formData.name,
            category: formData.category,
            price: formData.price,
            image_url: formData.image_url,
            description: formData.description,
            specifications: filteredSpecs,
            status: formData.status,
          },
        ])
        .select()

      if (error) throw error

      toast({
        title: "Product Added",
        description: "Product has been successfully added to the catalog.",
      })

      // Reset form
      setFormData({
        name: "",
        category: "",
        price: "Contact for Quote",
        image_url: "/placeholder.svg?height=300&width=300",
        description: "",
        specifications: [""],
        status: "active",
      })
      setImageFile(null)
      onAdd() // Refresh the products list
      onClose()
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return

    try {
      const { error } = await supabase.from("categories").insert([{ name: newCategory.trim() }])

      if (error) throw error

      toast({
        title: "Category Added",
        description: `Category "${newCategory}" has been added successfully.`,
      })

      setNewCategory("")
      setIsAddingCategory(false)
      // The parent component should refresh categories
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      })
    }
  }

  const handleChange = (field: keyof Product, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSpecificationChange = (index: number, value: string) => {
    const newSpecs = [...formData.specifications]
    newSpecs[index] = value
    setFormData((prev) => ({
      ...prev,
      specifications: newSpecs,
    }))
  }

  const addSpecification = () => {
    setFormData((prev) => ({
      ...prev,
      specifications: [...prev.specifications, ""],
    }))
  }

  const removeSpecification = (index: number) => {
    if (formData.specifications.length > 1) {
      const newSpecs = formData.specifications.filter((_, i) => i !== index)
      setFormData((prev) => ({
        ...prev,
        specifications: newSpecs,
      }))
    }
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      // In a real app, you would upload this to Supabase Storage
      // For now, we'll just use a placeholder
      const reader = new FileReader()
      reader.onload = (e) => {
        setFormData((prev) => ({
          ...prev,
          image_url: e.target?.result as string,
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">Add New Product</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="e.g., PVC Pressure Pipe 110mm"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <div className="flex gap-2">
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleChange("category", value)}
                  disabled={isAddingCategory}
                >
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setIsAddingCategory(!isAddingCategory)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {isAddingCategory && (
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    placeholder="New category name"
                    className="flex-1"
                  />
                  <Button type="button" size="sm" onClick={handleAddCategory}>
                    Add
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setIsAddingCategory(false)
                      setNewCategory("")
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleChange("description", e.target.value)}
              placeholder="Detailed product description..."
              rows={3}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image">Product Image</Label>
            <div className="flex items-center gap-4">
              <Input id="image" type="file" accept="image/*" onChange={handleImageUpload} className="flex-1" />
              <Button type="button" variant="outline" size="sm">
                <Upload className="h-4 w-4 mr-2" />
                Choose from Device
              </Button>
            </div>
            {formData.image_url && (
              <img
                src={formData.image_url || "/placeholder.svg"}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg mt-2"
              />
            )}
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <Label>Specifications</Label>
              <Button type="button" onClick={addSpecification} variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Add Spec
              </Button>
            </div>

            {formData.specifications.map((spec, index) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={spec}
                  onChange={(e) => handleSpecificationChange(index, e.target.value)}
                  placeholder="e.g., Diameter: 110mm"
                  className="flex-1"
                />
                {formData.specifications.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeSpecification(index)}
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-600"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="price">Price</Label>
              <Input
                id="price"
                value={formData.price}
                onChange={(e) => handleChange("price", e.target.value)}
                placeholder="Contact for Quote"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status}
                onValueChange={(value: "active" | "inactive") => handleChange("status", value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
            >
              {isSubmitting ? "Adding..." : "Add Product"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
