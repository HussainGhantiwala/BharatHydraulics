"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { FileText, Mail, Phone, Building, Package, Calendar, Send, Eye } from "lucide-react"

interface QuotationRequest {
  id: string
  product: {
    id: string
    name: string
    description: string
    price: number
    category: string
    image: string
  }
  customer: {
    customerName: string
    email: string
    phone: string
    company: string
    quantity: string
    urgency: string
    additionalRequirements: string
    projectDetails: string
  }
  requestDate: string
  status: string
}

export function QuotationManagement() {
  const [quotations, setQuotations] = useState<QuotationRequest[]>([])
  const [selectedQuotation, setSelectedQuotation] = useState<QuotationRequest | null>(null)
  const [showResponseModal, setShowResponseModal] = useState(false)
  const [responseData, setResponseData] = useState({
    quotedPrice: "",
    validityPeriod: "",
    deliveryTime: "",
    terms: "",
    additionalNotes: "",
  })

  useEffect(() => {
    const loadQuotations = () => {
      const savedQuotations = JSON.parse(localStorage.getItem("quotation-requests") || "[]")
      setQuotations(savedQuotations)
    }

    loadQuotations()
    // Listen for storage changes to update in real-time
    window.addEventListener("storage", loadQuotations)
    return () => window.removeEventListener("storage", loadQuotations)
  }, [])

  const handleSendQuotation = (quotation: QuotationRequest) => {
    setSelectedQuotation(quotation)
    setResponseData({
      quotedPrice: (quotation.product.price * 0.9).toFixed(2), // Example bulk discount
      validityPeriod: "30 days",
      deliveryTime: quotation.customer.urgency === "emergency" ? "2-3 days" : "1-2 weeks",
      terms: "Payment: 30% advance, 70% on delivery. Warranty: 2 years.",
      additionalNotes: "",
    })
    setShowResponseModal(true)
  }

  const handleSubmitQuotation = (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedQuotation) return

    // Update quotation status
    const updatedQuotations = quotations.map((q) => (q.id === selectedQuotation.id ? { ...q, status: "quoted" } : q))
    setQuotations(updatedQuotations)
    localStorage.setItem("quotation-requests", JSON.stringify(updatedQuotations))

    // In a real app, this would send an email
    const emailContent = `
Dear ${selectedQuotation.customer.customerName},

Thank you for your interest in our ${selectedQuotation.product.name}.

QUOTATION DETAILS:
Product: ${selectedQuotation.product.name}
Quantity: ${selectedQuotation.customer.quantity}
Quoted Price: $${responseData.quotedPrice}
Validity: ${responseData.validityPeriod}
Delivery Time: ${responseData.deliveryTime}

Terms & Conditions:
${responseData.terms}

${responseData.additionalNotes ? `Additional Notes:\n${responseData.additionalNotes}` : ""}

Best regards,
PVC Pro Solutions Team
    `

    // Simulate email sending
    console.log("Email sent to:", selectedQuotation.customer.email)
    console.log("Email content:", emailContent)

    alert(`Quotation sent successfully to ${selectedQuotation.customer.email}!`)
    setShowResponseModal(false)
    setSelectedQuotation(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "quoted":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "emergency":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "urgent":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
    }
  }

  return (
    <>
      <Card className="border-teal-200 dark:border-green-800">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-teal-600 dark:text-green-400">
            <FileText className="h-5 w-5" />
            Quotation Requests ({quotations.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {quotations.length === 0 ? (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No quotation requests yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {quotations.map((quotation) => (
                <div
                  key={quotation.id}
                  className="border rounded-lg p-4 border-teal-200 dark:border-green-800 hover:bg-teal-50 dark:hover:bg-green-950 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={quotation.product.image || "/placeholder.svg?height=60&width=60"}
                        alt={quotation.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <h3 className="font-semibold text-lg">{quotation.product.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{quotation.product.category}</p>
                        <div className="flex gap-2 mt-1">
                          <Badge className={getStatusColor(quotation.status)}>{quotation.status}</Badge>
                          {quotation.customer.urgency && (
                            <Badge className={getUrgencyColor(quotation.customer.urgency)}>
                              {quotation.customer.urgency}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(quotation.requestDate).toLocaleDateString()}
                      </div>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Building className="h-4 w-4 text-teal-600 dark:text-green-400" />
                        <span className="font-medium">{quotation.customer.customerName}</span>
                        {quotation.customer.company && <span>({quotation.customer.company})</span>}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mail className="h-4 w-4 text-teal-600 dark:text-green-400" />
                        <span>{quotation.customer.email}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-4 w-4 text-teal-600 dark:text-green-400" />
                        <span>{quotation.customer.phone}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="h-4 w-4 text-teal-600 dark:text-green-400" />
                        <span>Quantity: {quotation.customer.quantity}</span>
                      </div>
                      {quotation.customer.projectDetails && (
                        <div className="text-sm">
                          <span className="font-medium">Project:</span> {quotation.customer.projectDetails}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleSendQuotation(quotation)}
                      disabled={quotation.status === "quoted"}
                      className="bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      {quotation.status === "quoted" ? "Quotation Sent" : "Send Quotation"}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedQuotation(quotation)}
                      className="border-teal-300 text-teal-600 hover:bg-teal-50 dark:border-green-700 dark:text-green-400 dark:hover:bg-green-950"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quotation Response Modal */}
      <Dialog open={showResponseModal} onOpenChange={setShowResponseModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-teal-600 dark:text-green-400">Send Quotation Response</DialogTitle>
          </DialogHeader>

          {selectedQuotation && (
            <form onSubmit={handleSubmitQuotation} className="space-y-4">
              <div className="bg-teal-50 dark:bg-green-950 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Customer: {selectedQuotation.customer.customerName}</h3>
                <p className="text-sm">Product: {selectedQuotation.product.name}</p>
                <p className="text-sm">Quantity: {selectedQuotation.customer.quantity}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="quotedPrice">Quoted Price ($)</Label>
                  <Input
                    id="quotedPrice"
                    type="number"
                    step="0.01"
                    value={responseData.quotedPrice}
                    onChange={(e) => setResponseData((prev) => ({ ...prev, quotedPrice: e.target.value }))}
                    className="border-teal-200 dark:border-green-800"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="validityPeriod">Validity Period</Label>
                  <Input
                    id="validityPeriod"
                    value={responseData.validityPeriod}
                    onChange={(e) => setResponseData((prev) => ({ ...prev, validityPeriod: e.target.value }))}
                    className="border-teal-200 dark:border-green-800"
                    placeholder="e.g., 30 days"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="deliveryTime">Delivery Time</Label>
                <Input
                  id="deliveryTime"
                  value={responseData.deliveryTime}
                  onChange={(e) => setResponseData((prev) => ({ ...prev, deliveryTime: e.target.value }))}
                  className="border-teal-200 dark:border-green-800"
                  placeholder="e.g., 1-2 weeks"
                  required
                />
              </div>

              <div>
                <Label htmlFor="terms">Terms & Conditions</Label>
                <Textarea
                  id="terms"
                  value={responseData.terms}
                  onChange={(e) => setResponseData((prev) => ({ ...prev, terms: e.target.value }))}
                  className="border-teal-200 dark:border-green-800"
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="additionalNotes">Additional Notes</Label>
                <Textarea
                  id="additionalNotes"
                  value={responseData.additionalNotes}
                  onChange={(e) => setResponseData((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                  className="border-teal-200 dark:border-green-800"
                  rows={3}
                  placeholder="Any additional information or special offers..."
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="flex-1 bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Send Quotation Email
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowResponseModal(false)}
                  className="border-gray-300 dark:border-gray-600"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
