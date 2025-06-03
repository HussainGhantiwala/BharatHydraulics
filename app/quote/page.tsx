"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Quote, Send, Plus, Minus } from "lucide-react"
import { useSearchParams } from "next/navigation"

interface QuoteItem {
  id: string
  product: string
  quantity: number
  specifications: string
}

export default function QuotePage() {
  const searchParams = useSearchParams()
  const preSelectedProduct = searchParams.get("product")

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    projectDetails: "",
  })

  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([
    {
      id: "1",
      product: preSelectedProduct || "",
      quantity: 1,
      specifications: "",
    },
  ])

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [termsAccepted, setTermsAccepted] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!termsAccepted) {
      toast({
        title: "Terms Required",
        description: "Please accept the terms and conditions to continue.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Filter out empty quote items
      const validItems = quoteItems.filter((item) => item.product.trim() !== "")

      if (validItems.length === 0) {
        throw new Error("Please add at least one product to your quote request.")
      }

      // Prepare the data for insertion
      const quotationData = {
        customer_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company || null,
        items: validItems.map((item) => ({
          product: item.product,
          quantity: item.quantity,
          specifications: item.specifications || "",
        })),
        project_details: formData.projectDetails || null,
        status: "pending",
      }

      console.log("Submitting quotation data:", quotationData)

      // Insert quotation request into Supabase
      const { data, error } = await supabase.from("quotation_requests").insert([quotationData]).select()

      if (error) {
        console.error("Supabase error:", error)
        throw new Error(`Database error: ${error.message}`)
      }

      console.log("Quotation submitted successfully:", data)

      toast({
        title: "Quote Request Submitted!",
        description: "We'll send you a detailed quotation within 24 hours.",
      })

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        address: "",
        projectDetails: "",
      })
      setQuoteItems([{ id: "1", product: "", quantity: 1, specifications: "" }])
      setTermsAccepted(false)
    } catch (error: any) {
      console.error("Quote submission error:", error)
      toast({
        title: "Error",
        description: error.message || "Failed to submit quote request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }))
  }

  const addQuoteItem = () => {
    const newId = (quoteItems.length + 1).toString()
    setQuoteItems((prev) => [...prev, { id: newId, product: "", quantity: 1, specifications: "" }])
  }

  const removeQuoteItem = (id: string) => {
    if (quoteItems.length > 1) {
      setQuoteItems((prev) => prev.filter((item) => item.id !== id))
    }
  }

  const updateQuoteItem = (id: string, field: keyof QuoteItem, value: string | number) => {
    setQuoteItems((prev) => prev.map((item) => (item.id === id ? { ...item, [field]: value } : item)))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-800 dark:from-green-600 dark:to-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <Quote className="h-16 w-16 mx-auto mb-6" />
          <h1 className="text-5xl font-bold mb-6">Get Quote</h1>
          <p className="text-xl max-w-2xl mx-auto">
            Request a detailed quotation for your PVC pipe and fitting requirements
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="container mx-auto px-4 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl text-gray-900 dark:text-white">Request Quotation</CardTitle>
              {preSelectedProduct && (
                <p className="text-sm text-teal-600 dark:text-green-400">
                  Product "{preSelectedProduct}" has been pre-selected for your quote.
                </p>
              )}
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Personal Information */}
                <div>
                  <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Contact Information</h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        placeholder="Your full name"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        placeholder="your.email@example.com"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone Number *</Label>
                      <Input
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Your company name"
                      />
                    </div>
                  </div>
                  <div className="mt-6 space-y-2">
                    <Label htmlFor="address">Delivery Address</Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Complete delivery address with pincode"
                    />
                  </div>
                </div>

                {/* Product Requirements */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Requirements</h3>
                    <Button
                      type="button"
                      onClick={addQuoteItem}
                      variant="outline"
                      size="sm"
                      className="border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-950"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Item
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {quoteItems.map((item, index) => (
                      <Card key={item.id} className="p-4">
                        <div className="grid md:grid-cols-12 gap-4 items-end">
                          <div className="md:col-span-5 space-y-2">
                            <Label>Product Name *</Label>
                            <Input
                              value={item.product}
                              onChange={(e) => updateQuoteItem(item.id, "product", e.target.value)}
                              placeholder="e.g., PVC Pressure Pipe 110mm"
                              required
                            />
                          </div>
                          <div className="md:col-span-2 space-y-2">
                            <Label>Quantity *</Label>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) =>
                                updateQuoteItem(item.id, "quantity", Number.parseInt(e.target.value) || 1)
                              }
                              required
                            />
                          </div>
                          <div className="md:col-span-4 space-y-2">
                            <Label>Specifications</Label>
                            <Input
                              value={item.specifications}
                              onChange={(e) => updateQuoteItem(item.id, "specifications", e.target.value)}
                              placeholder="Size, pressure rating, etc."
                            />
                          </div>
                          <div className="md:col-span-1">
                            {quoteItems.length > 1 && (
                              <Button
                                type="button"
                                onClick={() => removeQuoteItem(item.id)}
                                variant="outline"
                                size="sm"
                                className="text-red-600 border-red-600 hover:bg-red-50"
                              >
                                <Minus className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Project Details */}
                <div className="space-y-2">
                  <Label htmlFor="projectDetails">Project Details</Label>
                  <Textarea
                    id="projectDetails"
                    name="projectDetails"
                    value={formData.projectDetails}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Please provide details about your project, timeline, special requirements, etc."
                  />
                </div>

                {/* Terms */}
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="terms"
                    checked={termsAccepted}
                    onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                    required
                  />
                  <Label htmlFor="terms" className="text-sm">
                    I agree to the terms and conditions and privacy policy *
                  </Label>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting || !termsAccepted}
                  className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700 text-white py-3"
                >
                  {isSubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Request Quotation
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  )
}
