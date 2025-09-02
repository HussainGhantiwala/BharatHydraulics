"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { X, User, Mail, Phone, MapPin, MessageSquare, Sparkles } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

function Toast({
  show,
  title,
  description,
  variant = "default",
  onClose,
}: {
  show: boolean
  title: string
  description?: string
  variant?: "default" | "destructive"
  onClose: () => void
}) {
  const bgColor = variant === "destructive" ? "bg-red-600" : "bg-teal-600"
  const textColor = "text-white"

  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [show, onClose])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3 }}
          className={`fixed bottom-4 right-4 max-w-sm rounded-lg shadow-lg p-4 ${bgColor} ${textColor} z-[1000]`}
        >
          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-bold text-sm">{title}</h3>
              {description && <p className="text-xs mt-1">{description}</p>}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

interface UserInfo {
  name: string
  email: string
  phone: string
  location: string
  message: string
}

export function UserInfoModal() {
   const [toast, setToast] = useState<{
      show: boolean
      title: string
      description: string | null
      variant: "default" | "destructive"
    }>({
      show: false,
      title: "",
      description: null,
      variant: "default",
    })
  const [isOpen, setIsOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [formData, setFormData] = useState<UserInfo>({
    name: "",
    email: "",
    phone: "",
    location: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    // Check if user has already submitted info
    const hasSubmitted = localStorage.getItem("user_info_submitted")
    const lastShown = localStorage.getItem("modal_last_shown")
    const now = Date.now()
    const oneDayAgo = now - 24 * 60 * 60 * 1000 // 24 hours ago

    // Show modal if user hasn't submitted info and it hasn't been shown in the last 24 hours
    if (!hasSubmitted && (!lastShown || Number.parseInt(lastShown) < oneDayAgo)) {
      // Set visibility first, then show modal after a delay
      setIsVisible(true)
      const timer = setTimeout(() => {
        setIsOpen(true)
        localStorage.setItem("modal_last_shown", now.toString())
      }, 1500) // Reduced delay for better reliability

      return () => clearTimeout(timer)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const { error } = await supabase.from("user_inquiries").insert([
        {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          location: formData.location,
          message: formData.message,
          created_at: new Date().toISOString(),
        },
      ])

      if (error) {
        console.error("Error saving user info:", error)
        alert("There was an error saving your information. Please try again.")
      } else {
        localStorage.setItem("user_info_submitted", "true")
        setIsOpen(false)
        // Show success message with better UX
        setToast({
          show: true,
          title: "Thank you for your submission!",
          description: "We'll get back to you shortly.",
          variant: "default",
        })
      }
    } catch (error) {
      setToast({
        show:true,
        title: "Submission Error",
        description: "There was an error submitting your information. Please try again later.",
        variant: "destructive",
      })
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

  const handleSkip = () => {
    localStorage.setItem("user_info_submitted", "true")
    setIsOpen(false)
  }

  const handleClose = () => {
    // Don't mark as submitted, just close for this session
    localStorage.setItem("modal_last_shown", Date.now().toString())
    setIsOpen(false)
  }

  if (!isVisible) return null

  return (
    <>
      <Toast
        show={toast.show}
        title={toast.title}
        description={toast.description ?? undefined}
        variant={toast.variant}
        onClose={() => setToast({ ...toast, show: false })}
      />
    
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={handleClose}>
          <DialogContent className="sm:max-w-md border-0 shadow-2xl">
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
                      <Sparkles className="h-4 w-4 text-white" />
                    </motion.div>
                    <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-blue-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                      Welcome to Bharat Tools & Hardware!
                    </DialogTitle>
                  </div>
                </div>
                <DialogDescription className="text-base text-gray-600 dark:text-gray-300">
                  We'd love to learn more about your needs and how we can help you with premium PVC solutions. This will
                  only take a minute! ✨
                </DialogDescription>
              </DialogHeader>

              <form onSubmit={handleSubmit} className="space-y-5 mt-6">
                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <Label htmlFor="name" className="flex items-center text-sm font-medium">
                    <User className="h-4 w-4 mr-2 text-teal-600 dark:text-green-400" />
                    Full Name *
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Your full name"
                    className="border-gray-200 dark:border-gray-700 focus:border-teal-500 dark:focus:border-green-500 transition-colors"
                  />
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Label htmlFor="email" className="flex items-center text-sm font-medium">
                    <Mail className="h-4 w-4 mr-2 text-teal-600 dark:text-green-400" />
                    Email Address *
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="your.email@company.com"
                    className="border-gray-200 dark:border-gray-700 focus:border-teal-500 dark:focus:border-green-500 transition-colors"
                  />
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <Label htmlFor="phone" className="flex items-center text-sm font-medium">
                    <Phone className="h-4 w-4 mr-2 text-teal-600 dark:text-green-400" />
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className="border-gray-200 dark:border-gray-700 focus:border-teal-500 dark:focus:border-green-500 transition-colors"
                  />
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.4 }}
                >
                  <Label htmlFor="location" className="flex items-center text-sm font-medium">
                    <MapPin className="h-4 w-4 mr-2 text-teal-600 dark:text-green-400" />
                    Location
                  </Label>
                  <Input
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="City, State/Country"
                    className="border-gray-200 dark:border-gray-700 focus:border-teal-500 dark:focus:border-green-500 transition-colors"
                  />
                </motion.div>

                <motion.div
                  className="space-y-2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <Label htmlFor="message" className="flex items-center text-sm font-medium">
                    <MessageSquare className="h-4 w-4 mr-2 text-teal-600 dark:text-green-400" />
                    How can we help you?
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Tell us about your project or requirements..."
                    className="border-gray-200 dark:border-gray-700 focus:border-teal-500 dark:focus:border-green-500 transition-colors resize-none"
                  />
                </motion.div>

                <motion.div
                  className="flex gap-3 pt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 dark:from-green-600 dark:to-emerald-600 dark:hover:from-green-700 dark:hover:to-emerald-700 text-white font-semibold py-2.5 rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                  >
                    {isSubmitting ? (
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                    ) : (
                      <Sparkles className="w-4 h-4 mr-2" />
                    )}
                    {isSubmitting ? "Submitting..." : "Get Started"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSkip}
                    className="border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    Skip for now
                  </Button>
                </motion.div>
              </form>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
    </>
  )
}
