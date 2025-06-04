"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { supabase } from "@/lib/supabase"
import { Mail, Eye, Clock, CheckCircle, Phone, Building, Loader2 } from "lucide-react"
import emailjs from '@emailjs/browser'

interface QuotationRequest {
  id: string
  customer_name: string
  email: string
  phone: string
  company: string
  items: Array<{
    product: string
    quantity: number
    specifications: string
  }>
  project_details: string
  status: "pending" | "quoted" | "completed"
  created_at: string
}

export function QuotationRequests() {
  const [requests, setRequests] = useState<QuotationRequest[]>([])
  const [selectedRequest, setSelectedRequest] = useState<QuotationRequest | null>(null)
  const [quotationText, setQuotationText] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSending, setIsSending] = useState(false)
  const { toast } = useToast()

  // Initialize EmailJS
  useEffect(() => {
    // Replace with your EmailJS public key
    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC1_KEY || "YOUR_PUBLIC_KEY")
  }, [])

  const fetchQuotationRequests = async () => {
    try {
      const { data, error } = await supabase
        .from("quotation_requests")
        .select("*")
        .order("created_at", { ascending: false })

      if (error) throw error
      setRequests(data || [])
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to fetch quotation requests: " + error.message,
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchQuotationRequests()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "quoted":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "completed":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />
      case "quoted":
        return <Mail className="h-4 w-4" />
      case "completed":
        return <CheckCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const formatItemsForEmail = (items: QuotationRequest['items']) => {
    return items.map((item, index) => 
      `${index + 1}. ${item.product} (Quantity: ${item.quantity})${item.specifications ? `\n   Specifications: ${item.specifications}` : ''}`
    ).join('\n\n')
  }

  const sendQuotation = async () => {
    if (!selectedRequest || !quotationText.trim()) {
      toast({
        title: "Error",
        description: "Please enter quotation details.",
        variant: "destructive",
      })
      return
    }

    setIsSending(true)

    try {
      // Prepare email template parameters
      const templateParams = {
        // Customer details (TO)
        to_name: selectedRequest.customer_name,
        to_email: selectedRequest.email, // This is where the email will be sent
        
        // Email content
        customer_name: selectedRequest.customer_name,
        customer_email: selectedRequest.email,
        customer_phone: selectedRequest.phone,
        customer_company: selectedRequest.company,
        requested_items: formatItemsForEmail(selectedRequest.items),
        project_details: selectedRequest.project_details || 'No additional project details provided',
        quotation_details: quotationText,
        request_date: new Date(selectedRequest.created_at).toLocaleDateString(),
        quotation_date: new Date().toLocaleDateString(),
        
        // Your company details (FROM)
        from_name: process.env.NEXT_PUBLIC_COMPANY_NAME || "Your Company Name",
        company_email: process.env.NEXT_PUBLIC_COMPANY_EMAIL || "your-email@company.com",
        company_phone: process.env.NEXT_PUBLIC_COMPANY_PHONE || "Your Phone Number",
        company_address: process.env.NEXT_PUBLIC_COMPANY_ADDRESS || "Your Company Address",
      }

      // Send email using EmailJS
      console.log("Sending email with params:", {
        serviceId: process.env.NEXT_PUBLIC_EMAILJS_SERVICE1_ID,
        templateId: process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE1_ID,
        to_email: templateParams.to_email
      })
      
      const emailResponse = await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE1_ID || "YOUR_SERVICE_ID",
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE1_ID || "YOUR_TEMPLATE_ID",
        templateParams
      )

      console.log("Email response:", emailResponse)

      if (emailResponse.status === 200) {
        // Update request status in Supabase only after successful email send
        const { error } = await supabase
          .from("quotation_requests")
          .update({ 
            status: "quoted"
          })
          .eq("id", selectedRequest.id)

        if (error) throw error

        // Update local state
        setRequests((prev) =>
          prev.map((req) => (req.id === selectedRequest.id ? { ...req, status: "quoted" as const } : req)),
        )

        toast({
          title: "Quotation Sent Successfully!",
          description: `Quotation has been sent to ${selectedRequest.email}`,
        })

        setSelectedRequest(null)
        setQuotationText("")
      } else {
        throw new Error("Failed to send email")
      }
    } catch (error: any) {
      console.error("Email sending error:", error)
      
      let errorMessage = "Failed to send quotation"
      
      if (error.text) {
        errorMessage = error.text
      } else if (error.message) {
        errorMessage = error.message
      } else if (typeof error === 'string') {
        errorMessage = error
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setIsSending(false)
    }
  }

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-teal-600 dark:text-green-400" />
            <p className="text-gray-600 dark:text-gray-400">Loading quotation requests...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Quotation Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {requests.length === 0 ? (
              <div className="text-center py-12">
                <Mail className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400 text-lg">No quotation requests yet.</p>
              </div>
            ) : (
              requests.map((request) => (
                <Card key={request.id} className="border-l-4 border-l-teal-500 dark:border-l-green-500">
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                            {request.customer_name}
                          </h3>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1 capitalize">{request.status}</span>
                          </Badge>
                        </div>

                        <div className="grid md:grid-cols-3 gap-4 text-sm text-gray-600 dark:text-gray-400 mb-4">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            {request.email}
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            {request.phone}
                          </div>
                          <div className="flex items-center gap-2">
                            <Building className="h-4 w-4" />
                            {request.company}
                          </div>
                        </div>

                        <div className="mb-4">
                          <h4 className="font-medium text-gray-900 dark:text-white mb-2">Requested Items:</h4>
                          <div className="space-y-2">
                            {request.items.map((item, index) => (
                              <div key={index} className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg">
                                <div className="flex justify-between items-start">
                                  <div>
                                    <span className="font-medium">{item.product}</span>
                                    <span className="text-gray-600 dark:text-gray-400 ml-2">
                                      (Qty: {item.quantity})
                                    </span>
                                  </div>
                                </div>
                                {item.specifications && (
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{item.specifications}</p>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>

                        {request.project_details && (
                          <div className="mb-4">
                            <h4 className="font-medium text-gray-900 dark:text-white mb-2">Project Details:</h4>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{request.project_details}</p>
                          </div>
                        )}

                        <p className="text-xs text-gray-500 dark:text-gray-500">
                          Requested on: {new Date(request.created_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline" onClick={() => setSelectedRequest(request)}>
                          <Eye className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                        {request.status === "pending" && (
                          <Button
                            size="sm"
                            className="bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
                            onClick={() => {
                              setSelectedRequest(request)
                              setQuotationText("")
                            }}
                          >
                            <Mail className="h-4 w-4 mr-2" />
                            Send Quote
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Quotation Modal */}
      {selectedRequest && (
        <Dialog open={!!selectedRequest} onOpenChange={() => setSelectedRequest(null)}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                Send Quotation - {selectedRequest.customer_name}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6">
              {/* Customer Details */}
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Customer Information</h3>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Name:</strong> {selectedRequest.customer_name}
                  </div>
                  <div>
                    <strong>Company:</strong> {selectedRequest.company}
                  </div>
                  <div>
                    <strong>Email:</strong> {selectedRequest.email}
                  </div>
                  <div>
                    <strong>Phone:</strong> {selectedRequest.phone}
                  </div>
                </div>
              </div>

              {/* Requested Items */}
              <div>
                <h3 className="font-semibold mb-3 text-gray-900 dark:text-white">Requested Items</h3>
                <div className="space-y-2">
                  {selectedRequest.items.map((item, index) => (
                    <div key={index} className="border border-gray-200 dark:border-gray-700 p-3 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="font-medium">{item.product}</span>
                          <span className="text-gray-600 dark:text-gray-400 ml-2">(Quantity: {item.quantity})</span>
                        </div>
                      </div>
                      {item.specifications && (
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          Specifications: {item.specifications}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Quotation Text */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-900 dark:text-white">Quotation Details *</label>
                <Textarea
                  value={quotationText}
                  onChange={(e) => setQuotationText(e.target.value)}
                  placeholder="Enter detailed quotation including prices, terms, delivery timeline, etc."
                  rows={8}
                  required
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline" onClick={() => setSelectedRequest(null)}>
                  Cancel
                </Button>
                <Button
                  onClick={sendQuotation}
                  disabled={isSending}
                  className="bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
                >
                  {isSending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending Email...
                    </>
                  ) : (
                    <>
                      <Mail className="mr-2 h-4 w-4" />
                      Send Quotation
                    </>
                  )}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  )
}