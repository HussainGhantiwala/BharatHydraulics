"use client"

import React, { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import dynamic from "next/dynamic"
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

// Dynamically import InteractiveMap to disable SSR
const InteractiveMap = dynamic(() => import("./InteractiveMap"), {
  ssr: false,
})

const fadeInUp = () => ({
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
})

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
  description?: string | null
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
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-transparent/20"
              aria-label="Close notification"
            >
              ✕
            </Button>
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

  const formRef = useRef(null)

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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
        formRef.current!,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY
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
        description: "Failed to send message. Please try again.",
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
    <div className="min-h-screen py-12 bg-background">
      <Toast
        show={toast.show}
        title={toast.title}
        description={toast.description}
        variant={toast.variant}
        onClose={() => setToast({ ...toast, show: false })}
      />

      <div className="container mx-auto px-4">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerContainer}
          className="text-center mb-12"
        >
          <motion.div variants={fadeInUp()}>
            <Badge
              variant="secondary"
              className="mb-4 bg-teal-100 text-teal-800 dark:bg-green-900 dark:text-green-100"
            >
              Contact Us
            </Badge>
            <h1 className="text-4xl font-bold mb-4">
              Get in <span className="text-teal-600 dark:text-green-400">Touch</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Reach out for all your PVC project and fitting needs. We're here to help.
            </p>
          </motion.div>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="space-y-6"
          >
            <motion.div variants={fadeInUp()}>
              <h2 className="text-2xl font-semibold mb-4">Contact Information</h2>
            </motion.div>

            {[
              {
                icon: MapPin,
                title: "Address",
                content: "Ground floor A block,\nPlot number 78/b/12, sy no 79,\nVijaya laxmi communications Jeedimetla.",
              },
              {
                icon: Phone,
                title: "Phone",
                content: "+91-63004 75068",
              },
              {
                icon: Mail,
                title: "Email",
                content: "bharathydraulicsandengineeringco@gmail.com",
              },
              {
                icon: Clock,
                title: "Business Hours",
                content: "Mon-Sat: 9:00 AM - 8:00 PM\nSunday: Closed",
              },
            ].map((item, idx) => (
              <motion.div key={idx} variants={fadeInUp()}>
                <Card>
                  <CardHeader className="pb-2">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 bg-teal-100 dark:bg-green-900 rounded-md flex items-center justify-center">
                        <item.icon className="h-4 w-4 text-teal-600 dark:text-green-400" />
                      </div>
                      <CardTitle className="text-base">{item.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-sm whitespace-pre-line">
                      {item.content}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          <motion.div initial="initial" animate="animate" variants={fadeInUp()} className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Send us a Message</CardTitle>
                <CardDescription>We'll respond within 24 hours.</CardDescription>
              </CardHeader>
              <CardContent>
                <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="name">Name *</Label>
                      <Input id="name" name="name" value={formData.name} onChange={handleChange} required />
                      {formErrors.name && <p className="text-xs text-red-600">{formErrors.name}</p>}
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                      {formErrors.email && <p className="text-xs text-red-600">{formErrors.email}</p>}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <Label htmlFor="company">Company</Label>
                      <Input id="company" name="company" value={formData.company} onChange={handleChange} />
                    </div>
                    <div className="space-y-1">
                      <Label htmlFor="phone">Phone</Label>
                      <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="subject">Subject *</Label>
                    <Input id="subject" name="subject" value={formData.subject} onChange={handleChange} required />
                    {formErrors.subject && <p className="text-xs text-red-600">{formErrors.subject}</p>}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                    {formErrors.message && <p className="text-xs text-red-600">{formErrors.message}</p>}
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

        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp()}
          className="mt-12"
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Find Us</CardTitle>
              <CardDescription>Visit our facility in Hyderabad - Click the map to open in Google Maps</CardDescription>
            </CardHeader>
            <CardContent>
              <InteractiveMap />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}