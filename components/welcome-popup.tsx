"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { VisitorService } from "@/lib/visitor-service"
import { X, UserPlus, ArrowRight, Sparkles } from "lucide-react"

interface WelcomePopupProps {
  isOpen: boolean
  onClose: () => void
}

export function WelcomePopup({ isOpen, onClose }: WelcomePopupProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    interests: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Register visitor using the service
      const customerId = await VisitorService.registerVisitor({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        company: formData.company,
        address: formData.address,
        interests: formData.interests,
      })

      if (customerId) {
        // Track the session
        await VisitorService.trackVisitorSession(customerId, {
          sessionId: `session_${Date.now()}`,
          pageVisited: window.location.pathname,
          referrer: document.referrer,
          userAgent: navigator.userAgent,
        })

        // Store in localStorage that user has registered
        localStorage.setItem(
          "bharatHydraulicsUser",
          JSON.stringify({
            registered: true,
            customerId: customerId,
            name: formData.name,
            email: formData.email,
            timestamp: new Date().toISOString(),
          }),
        )

        toast({
          title: "Welcome to Bharat Hydraulics! 🎉",
          description:
            "Thank you for joining us. Your information has been saved and you'll receive updates about our latest products and offers.",
        })

        onClose()
      } else {
        throw new Error("Failed to register visitor")
      }
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to save your information. Please try again.",
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

  const handleSkip = () => {
    // Store in localStorage that user has visited but skipped registration
    localStorage.setItem(
      "bharatHydraulicsUser",
      JSON.stringify({
        registered: false,
        skipped: true,
        timestamp: new Date().toISOString(),
      }),
    )
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl bg-gradient-to-br from-white to-teal-50 dark:from-gray-900 dark:to-green-950">
        <DialogHeader className="relative">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSkip}
            className="absolute -top-2 -right-2 h-8 w-8 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="h-4 w-4" />
          </Button>

          <div className="text-center py-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-500 dark:from-green-500 dark:to-emerald-500 rounded-full mb-4 shadow-lg">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
              Welcome to Bharat Hydraulics!
            </DialogTitle>
            <p className="text-gray-600 dark:text-gray-400 mt-2 text-lg">
              Join thousands of satisfied customers and get exclusive updates
            </p>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Benefits */}
          <div className="bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-green-900 dark:to-emerald-900 p-6 rounded-xl border border-teal-200 dark:border-green-700">
            <h3 className="font-semibold text-teal-800 dark:text-green-200 mb-3 flex items-center">
              <UserPlus className="h-5 w-5 mr-2" />
              Why join our community?
            </h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm text-teal-700 dark:text-green-300">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-teal-500 dark:bg-green-400 rounded-full mr-2"></div>
                Exclusive product updates
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-teal-500 dark:bg-green-400 rounded-full mr-2"></div>
                Priority customer support
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-teal-500 dark:bg-green-400 rounded-full mr-2"></div>
                Special pricing offers
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-teal-500 dark:bg-green-400 rounded-full mr-2"></div>
                Technical consultation
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-gray-700 dark:text-gray-300">
                  Full Name *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Your full name"
                  className="border-teal-200 dark:border-green-700 focus:border-teal-500 dark:focus:border-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                  Email Address *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your.email@example.com"
                  className="border-teal-200 dark:border-green-700 focus:border-teal-500 dark:focus:border-green-500"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="phone" className="text-gray-700 dark:text-gray-300">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                  className="border-teal-200 dark:border-green-700 focus:border-teal-500 dark:focus:border-green-500"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company" className="text-gray-700 dark:text-gray-300">
                  Company Name
                </Label>
                <Input
                  id="company"
                  name="company"
                  value={formData.company}
                  onChange={handleChange}
                  placeholder="Your company name"
                  className="border-teal-200 dark:border-green-700 focus:border-teal-500 dark:focus:border-green-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-gray-700 dark:text-gray-300">
                Address
              </Label>
              <Textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Your address (optional)"
                rows={2}
                className="border-teal-200 dark:border-green-700 focus:border-teal-500 dark:focus:border-green-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="interests" className="text-gray-700 dark:text-gray-300">
                Areas of Interest
              </Label>
              <Textarea
                id="interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
                placeholder="What products or services are you interested in? (optional)"
                rows={2}
                className="border-teal-200 dark:border-green-700 focus:border-teal-500 dark:focus:border-green-500"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 dark:from-green-600 dark:to-emerald-600 dark:hover:from-green-700 dark:hover:to-emerald-700 text-white font-semibold py-3 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                {isSubmitting ? (
                  "Joining..."
                ) : (
                  <div className="flex items-center justify-center">
                    Join Our Community
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={handleSkip}
                className="border-teal-300 dark:border-green-600 text-teal-600 dark:text-green-400 hover:bg-teal-50 dark:hover:bg-green-950 font-medium py-3"
              >
                Continue Without Joining
              </Button>
            </div>
          </form>

          <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
            We respect your privacy. Your information will only be used to provide you with relevant updates and
            support.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
