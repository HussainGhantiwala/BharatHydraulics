"use client"

import type React from "react"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { X, Send, Package } from "lucide-react"
import { createClient } from "@supabase/supabase-js"
import type { Product } from "@/contexts/product-context"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

interface QuotationModalProps {
  isOpen: boolean
  onClose: () => void
  product: Product
}

interface QuotationData {
  customerName: string
  customerEmail: string
  customerPhone: string
  company: string
  quantity: string
  preferredSize: string
  preferredMaterial: string
  additionalRequirements: string
}

export function QuotationModal({ isOpen, onClose, product }: QuotationModalProps) {
  const [formData, setFormData] = useState<QuotationData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    company: "",
    quantity: "",
    preferredSize: "",
    preferredMaterial: product.material || "",
    additionalRequirements: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError(null)

    // Validate required fields
    if (
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.quantity ||
      !formData.preferredSize ||
      !formData.preferredMaterial
    ) {
      setSubmitError("Please fill in all required fields.")
      setIsSubmitting(false)
      return
    }

    try {
      const { error } = await supabase.from("quotations").insert([
        {
          product_id: product.id,
          product_name: product.name,
          customer_name: formData.customerName,
          customer_email: formData.customerEmail,
          customer_phone: formData.customerPhone || null,
          company: formData.company || null,
          quantity: formData.quantity,
          preferred_size: formData.preferredSize,
          preferred_material: formData.preferredMaterial,
          additional_requirements: formData.additionalRequirements || null,
          status: "pending",
          created_at: new Date().toISOString(),
        },
      ])

      if (error) {
        console.error("Error saving quotation:", error)
        setSubmitError(`Error saving quotation: ${error.message}`)
      } else {
        // Reset form and close modal
        setFormData({
          customerName: "",
          customerEmail: "",
          customerPhone: "",
          company: "",
          quantity: "",
          preferredSize: "",
          preferredMaterial: product.material || "",
          additionalRequirements: "",
        })
        onClose()
        alert("🎉 Quotation request submitted successfully! We will contact you soon with pricing details.")
      }
    } catch (error) {
      console.error("Error:", error)
      setSubmitError(`Unexpected error: ${error}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="relative"
            >
              {/* Decorative background */}
              <div className="absolute inset-0 bg-gradient-to-br from-teal-50 to-blue-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg -z-10" />

              <DialogHeader className="space-y-4 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <motion.div
                      initial={{ rotate: 0 }}
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-8 h-8 bg-gradient-to-r from-teal-500 to-blue-500 dark:from-green-500 dark:to-emerald-500 rounded-full flex items-center justify-center"
                    >
                      <Package className="h-4 w-4 text-white" />
                    </motion.div>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                      Request Quotation
                    </DialogTitle>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-600 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
                <DialogDescription className="text-base text-gray-600 dark:text-gray-300">
                  Get a personalized quote for{" "}
                  <span className="font-semibold text-teal-600 dark:text-green-400">{product.name}</span>. Fill out the
                  details below and we'll provide you with competitive pricing.
                </DialogDescription>
              </DialogHeader>

              {submitError && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6"
                >
                  <p className="text-red-800 dark:text-red-200 text-sm">{submitError}</p>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                {/* Customer Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Customer Information</h3>

                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <Label htmlFor="customerName" className="text-sm font-medium">
                        Full Name *
                      </Label>
                      <Input
                        id="customerName"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                        className="border-gray-200 dark:border-gray-700 focus:border-teal-500 dark:focus:border-green-500"
                      />
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <Label htmlFor="customerEmail" className="text-sm font-medium">
                        Email Address *
                      </Label>
                      <Input
                        id="customerEmail"
                        name="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        required
                        placeholder="your.email@company.com"
                        className="border-gray-200 dark:border-gray-700 focus:border-teal-500 dark:focus:border-green-500"
                      />
                    </motion.div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Label htmlFor="customerPhone" className="text-sm font-medium">
                        Phone Number
                      </Label>
                      <Input
                        id="customerPhone"
                        name="customerPhone"
                        type="tel"
                        value={formData.customerPhone}
                        onChange={handleChange}
                        placeholder="+1 (555) 123-4567"
                        className="border-gray-200 dark:border-gray-700 focus:border-teal-500 dark:focus:border-green-500"
                      />
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.4 }}
                    >
                      <Label htmlFor="company" className="text-sm font-medium">
                        Company
                      </Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your company name"
                        className="border-gray-200 dark:border-gray-700 focus:border-teal-500 dark:focus:border-green-500"
                      />
                    </motion.div>
                  </div>
                </div>

                {/* Product Specifications */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Product Specifications</h3>

                  <div className="grid md:grid-cols-3 gap-4">
                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.5 }}
                    >
                      <Label htmlFor="quantity" className="text-sm font-medium">
                        Quantity *
                      </Label>
                      <Input
                        id="quantity"
                        name="quantity"
                        value={formData.quantity}
                        onChange={handleChange}
                        required
                        placeholder="e.g., 100 units"
                        className="border-gray-200 dark:border-gray-700 focus:border-teal-500 dark:focus:border-green-500"
                      />
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 }}
                    >
                      <Label htmlFor="preferredSize" className="text-sm font-medium">
                        Preferred Size *
                      </Label>
                      <Select
                        value={formData.preferredSize}
                        onValueChange={(value) => handleSelectChange("preferredSize", value)}
                      >
                        <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:border-teal-500 dark:focus:border-green-500">
                          <SelectValue placeholder="Select size" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1/2 inch">1/2"</SelectItem>
                          <SelectItem value="3/4 inch">3/4"</SelectItem>
                          <SelectItem value="1 inch">1"</SelectItem>
                          <SelectItem value="1.5 inch">1.5"</SelectItem>
                          <SelectItem value="2 inch">2"</SelectItem>
                          <SelectItem value="3 inch">3"</SelectItem>
                          <SelectItem value="4 inch">4"</SelectItem>
                          <SelectItem value="6 inch">6"</SelectItem>
                          <SelectItem value="8 inch">8"</SelectItem>
                          <SelectItem value="10 inch">10"</SelectItem>
                          <SelectItem value="12 inch">12"</SelectItem>
                          <SelectItem value="custom">Custom Size</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>

                    <motion.div
                      className="space-y-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.7 }}
                    >
                      <Label htmlFor="preferredMaterial" className="text-sm font-medium">
                        Preferred Material *
                      </Label>
                      <Select
                        value={formData.preferredMaterial}
                        onValueChange={(value) => handleSelectChange("preferredMaterial", value)}
                      >
                        <SelectTrigger className="border-gray-200 dark:border-gray-700 focus:border-teal-500 dark:focus:border-green-500">
                          <SelectValue placeholder="Select material" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PVC">PVC</SelectItem>
                          <SelectItem value="CPVC">CPVC</SelectItem>
                          <SelectItem value="ABS">ABS</SelectItem>
                          <SelectItem value="PVC with Steel Reinforcement">PVC with Steel Reinforcement</SelectItem>
                          <SelectItem value="PVC with Rubber Seals">PVC with Rubber Seals</SelectItem>
                          <SelectItem value="other">Other (specify in requirements)</SelectItem>
                        </SelectContent>
                      </Select>
                    </motion.div>
                  </div>
                </div>

                {/* Additional Requirements */}
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <Label htmlFor="additionalRequirements" className="text-sm font-medium">
                    Additional Requirements
                  </Label>
                  <Textarea
                    id="additionalRequirements"
                    name="additionalRequirements"
                    value={formData.additionalRequirements}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Please specify any special requirements, custom specifications, delivery timeline, or other details..."
                    className="border-gray-200 dark:border-gray-700 focus:border-teal-500 dark:focus:border-green-500 resize-none"
                  />
                </motion.div>

                <motion.div
                  className="flex gap-4 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 dark:from-green-600 dark:to-emerald-600 dark:hover:from-green-700 dark:hover:to-emerald-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <Send className="w-4 h-4 mr-2" />
                    )}
                    {isSubmitting ? "Submitting..." : "Submit Quotation Request"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors px-6"
                  >
                    Cancel
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  )
}
