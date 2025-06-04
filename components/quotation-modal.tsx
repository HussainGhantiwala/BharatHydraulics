"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { FileText, User, Mail, Phone, Building, Package } from "lucide-react"

interface QuotationModalProps {
  product: {
    id: string
    name: string
    description: string
    price: number
    category: string
    image: string
    featured: boolean
  }
  isOpen: boolean
  onClose: () => void
}

export function QuotationModal({ product, isOpen, onClose }: QuotationModalProps) {
  const [quotationData, setQuotationData] = useState({
    customerName: "",
    email: "",
    phone: "",
    company: "",
    quantity: "",
    urgency: "",
    additionalRequirements: "",
    projectDetails: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const quotationRequest = {
      id: Date.now().toString(),
      product: product,
      customer: quotationData,
      requestDate: new Date().toISOString(),
      status: "pending",
    }

    // Save to localStorage for client to see
    const existingQuotations = JSON.parse(localStorage.getItem("quotation-requests") || "[]")
    existingQuotations.push(quotationRequest)
    localStorage.setItem("quotation-requests", JSON.stringify(existingQuotations))

    alert("Quotation request submitted successfully! We'll get back to you within 24 hours.")
    onClose()
    setQuotationData({
      customerName: "",
      email: "",
      phone: "",
      company: "",
      quantity: "",
      urgency: "",
      additionalRequirements: "",
      projectDetails: "",
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl text-teal-600 dark:text-green-400 flex items-center gap-2">
            <FileText className="h-6 w-6" />
            Request Quotation
          </DialogTitle>
          <p className="text-gray-600 dark:text-gray-300">Get a personalized quote for your PVC pipe requirements</p>
        </DialogHeader>

        <div className="mb-6 p-4 bg-teal-50 dark:bg-green-950 rounded-lg border border-teal-200 dark:border-green-800">
          <div className="flex items-center gap-4">
            <img
              src={product.image || "/placeholder.svg?height=80&width=80"}
              alt={product.name}
              className="w-20 h-20 object-cover rounded"
            />
            <div className="flex-1">
              <h3 className="font-semibold text-lg">{product.name}</h3>
              <Badge
                variant="secondary"
                className="mb-2 bg-teal-100 text-teal-800 dark:bg-green-900 dark:text-green-200"
              >
                {product.category}
              </Badge>
              <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">{product.description}</p>
              <p className="text-lg font-bold text-teal-600 dark:text-green-400 mt-2">Base Price: ${product.price}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="customerName">Full Name *</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="customerName"
                  value={quotationData.customerName}
                  onChange={(e) => setQuotationData((prev) => ({ ...prev, customerName: e.target.value }))}
                  className="pl-10 border-teal-200 dark:border-green-800"
                  placeholder="Your full name"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address *</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={quotationData.email}
                  onChange={(e) => setQuotationData((prev) => ({ ...prev, email: e.target.value }))}
                  className="pl-10 border-teal-200 dark:border-green-800"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number *</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={quotationData.phone}
                  onChange={(e) => setQuotationData((prev) => ({ ...prev, phone: e.target.value }))}
                  className="pl-10 border-teal-200 dark:border-green-800"
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="company">Company Name</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="company"
                  value={quotationData.company}
                  onChange={(e) => setQuotationData((prev) => ({ ...prev, company: e.target.value }))}
                  className="pl-10 border-teal-200 dark:border-green-800"
                  placeholder="Your company name"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="quantity">Quantity Required *</Label>
              <div className="relative">
                <Package className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="quantity"
                  value={quotationData.quantity}
                  onChange={(e) => setQuotationData((prev) => ({ ...prev, quantity: e.target.value }))}
                  className="pl-10 border-teal-200 dark:border-green-800"
                  placeholder="e.g., 100 meters, 50 pieces"
                  required
                />
              </div>
            </div>
            <div>
              <Label htmlFor="urgency">Project Urgency</Label>
              <Select
                value={quotationData.urgency}
                onValueChange={(value) => setQuotationData((prev) => ({ ...prev, urgency: value }))}
              >
                <SelectTrigger className="border-teal-200 dark:border-green-800">
                  <SelectValue placeholder="Select urgency level" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="standard">Standard (2-3 weeks)</SelectItem>
                  <SelectItem value="urgent">Urgent (1 week)</SelectItem>
                  <SelectItem value="emergency">Emergency (2-3 days)</SelectItem>
                  <SelectItem value="flexible">Flexible timeline</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="projectDetails">Project Details</Label>
            <Textarea
              id="projectDetails"
              value={quotationData.projectDetails}
              onChange={(e) => setQuotationData((prev) => ({ ...prev, projectDetails: e.target.value }))}
              className="border-teal-200 dark:border-green-800"
              placeholder="Brief description of your project (e.g., residential drainage, commercial plumbing)"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="additionalRequirements">Additional Requirements</Label>
            <Textarea
              id="additionalRequirements"
              value={quotationData.additionalRequirements}
              onChange={(e) => setQuotationData((prev) => ({ ...prev, additionalRequirements: e.target.value }))}
              className="border-teal-200 dark:border-green-800"
              placeholder="Any specific requirements, certifications needed, delivery preferences, etc."
              rows={3}
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-lg">
            <h4 className="font-semibold mb-2 text-teal-600 dark:text-green-400">What happens next?</h4>
            <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
              <li>• Our team will review your requirements within 2 hours</li>
              <li>• You'll receive a detailed quotation via email within 24 hours</li>
              <li>• Bulk pricing and delivery options will be included</li>
              <li>• Technical specifications and certifications provided</li>
            </ul>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
            >
              Submit Quotation Request
            </Button>
            <Button type="button" variant="outline" onClick={onClose} className="border-gray-300 dark:border-gray-600">
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
