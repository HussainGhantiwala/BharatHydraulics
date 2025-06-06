"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"
import emailjs from "@emailjs/browser"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
}

// Custom Toast Component
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

  // Auto dismiss after 3 seconds
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
          className={`fixed bottom-6 right-6 max-w-sm rounded shadow-lg p-4 ${bgColor} ${textColor} z-[9999]`}
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-bold text-lg">{title}</h4>
              {description && <p className="mt-1 text-sm">{description}</p>}
            </div>
            <button
              onClick={onClose}
              className="ml-4 text-white hover:opacity-75 transition-opacity"
              aria-label="Close notification"
            >
              &#x2715;
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    subject: "",
    message: "",
  })

  const [formErrors, setFormErrors] = useState({
    name: "",
    email: "",
    message: "",
    subject: "",
  })

  const [isSubmitting, setIsSubmitting] = useState(false)

  // Toast state
  const [toast, setToast] = useState<{
    show: boolean
    title: string
    description?: string
    variant?: "default" | "destructive"
  }>({ show: false, title: "" })

  const formRef = useRef<HTMLFormElement>(null)

  const validateForm = () => {
    const errors = { name: "", email: "", message: "", subject: "" }
    const { name, email, message, subject } = formData

    if (!name.trim()) errors.name = "Name is required"
    if (!email.trim()) {
      errors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = "Email is invalid"
    }
    if (!subject.trim()) errors.subject = "Subject is required"
    if (!message.trim()) errors.message = "Message is required"

    setFormErrors(errors)
    return Object.values(errors).every((val) => val === "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current!,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
      )

      setToast({
        show: true,
        title: "Message Sent!",
        description: "We'll get back to you shortly.",
        variant: "default",
      })

      setFormData({
        name: "",
        email: "",
        phone: "",
        company: "",
        subject: "",
        message: "",
      })
    } catch (error) {
      setToast({
        show: true,
        title: "Error",
        description: "Failed to send. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  return (
    <div className="min-h-screen py-20">
      {/* Toast Container */}
      <Toast
        show={toast.show}
        title={toast.title}
        description={toast.description}
        variant={toast.variant}
        onClose={() => setToast((prev) => ({ ...prev, show: false }))}
      />

      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="text-center mb-16"
        >
          <motion.div variants={fadeInUp}>
            <Badge
              variant="secondary"
              className="bg-teal-100 text-teal-800 dark:bg-green-900 dark:text-green-100 mb-4"
            >
              Contact Us
            </Badge>
            <h1 className="text-5xl font-bold mb-6">
              Get in <span className="text-teal-600 dark:text-green-400">Touch</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Reach out to us for all your PVC project and fitting needs. We're here to help.
            </p>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact Info */}
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.div variants={fadeInUp}>
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
            </motion.div>

            {[
              {
                icon: MapPin,
                title: "Address",
                content: "123 Industrial Area\nMIDC, Mumbai, MH 400001",
              },
              {
                icon: Phone,
                title: "Phone",
                content: "+91 98765 43210\n+91 87654 32109",
              },
              {
                icon: Mail,
                title: "Email",
                content: "info@bharathydraulics.com\nsales@bharathydraulics.com",
              },
              {
                icon: Clock,
                title: "Business Hours",
                content: "Mon-Sat: 9:00 AM - 6:00 PM\nSunday: Closed",
              },
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp}>
                <Card>
                  <CardHeader className="pb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-teal-100 dark:bg-green-800 rounded-lg flex items-center justify-center">
                        <item.icon className="h-5 w-5 text-teal-600 dark:text-green-400" />
                      </div>
                      <CardTitle className="text-lg">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="whitespace-pre-line text-base">
                      {item.content}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact Form */}
          <motion.div initial="initial" animate="animate" variants={fadeInUp} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl">Send us a Message</CardTitle>
                <CardDescription>We usually respond within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Full Name *</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                      {formErrors.name && <p className="text-red-600 text-sm">{formErrors.name}</p>}
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
                      />
                      {formErrors.email && <p className="text-red-600 text-sm">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" name="company" value={formData.company} onChange={handleChange} />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
                    {formErrors.subject && <p className="text-red-600 text-sm">{formErrors.subject}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={6}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.message && <p className="text-red-600 text-sm">{formErrors.message}</p>}
                  </div>

                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
                    size="lg"
                  >
                    {isSubmitting ? (
                      "Sending..."
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" /> Send Message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="mt-16"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Find Us</CardTitle>
              <CardDescription>Visit our facility and showroom in Mumbai</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-64 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                <p className="text-gray-500 dark:text-gray-400">Interactive Map Coming Soon</p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
