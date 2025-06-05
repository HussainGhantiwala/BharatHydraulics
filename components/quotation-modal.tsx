"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  X,
  Send,
  Package,
  User,
  Building,
  Mail,
  Phone,
  Ruler,
  Package2,
  FileText,
  CheckCircle,
  Building2,
} from "lucide-react";
import { createClient } from "@supabase/supabase-js";
import type { Product } from "@/contexts/product-context";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface QuotationModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
}

interface QuotationData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  company: string;
  quantity: string;
  preferredSize: string;
  preferredMaterial: string;
  additionalRequirements: string;
}

const FormSection = ({
  children,
  title,
  icon: Icon,
  delay,
}: {
  children: React.ReactNode;
  title: string;
  icon: any;
  delay: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
    className="w-full"
  >
    <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-lg transition-all duration-300">
      <div className="flex items-center space-x-4 mb-6">
        <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-green-500 rounded-xl flex items-center justify-center shadow-md">
          <Icon className="h-6 w-6 text-white" />
        </div>
        <h3 className="text-xl font-bold text-gray-900">{title}</h3>
      </div>
      {children}
    </div>
  </motion.div>
);

const AnimatedInput = ({
  icon: Icon,
  delay,
  children,
}: {
  icon?: any;
  delay: number;
  children: React.ReactNode;
}) => (
  <motion.div
    initial={{ opacity: 0, x: -20 }}
    animate={{ opacity: 1, x: 0 }}
    transition={{ delay, duration: 0.5, ease: "easeOut" }}
    className="w-full"
  >
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
      )}
      {children}
    </div>
  </motion.div>
);

export function QuotationModal({
  isOpen,
  onClose,
  product,
}: QuotationModalProps) {
  const [formData, setFormData] = useState<QuotationData>({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    company: "",
    quantity: "",
    preferredSize: "",
    preferredMaterial: product.material || "",
    additionalRequirements: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    // Validate required fields
    if (
      !formData.customerName ||
      !formData.customerEmail ||
      !formData.quantity ||
      !formData.preferredSize ||
      !formData.preferredMaterial
    ) {
      setSubmitError("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
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
      ]);

      if (error) {
        console.error("Error saving quotation:", error);
        setSubmitError(`Error saving quotation: ${error.message}`);
      } else {
        setIsSuccess(true);
        setTimeout(() => {
          setFormData({
            customerName: "",
            customerEmail: "",
            customerPhone: "",
            company: "",
            quantity: "",
            preferredSize: "",
            preferredMaterial: product.material || "",
            additionalRequirements: "",
          });
          setIsSuccess(false);
          onClose();
        }, 2500);
      }
    } catch (error) {
      console.error("Error:", error);
      setSubmitError(`Unexpected error: ${error}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSelectChange = (field: string, value: string) => {
    setFormData({
      ...formData,
      [field]: value,
    });
  };

  if (isSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl bg-gray-50 p-0">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-12 px-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 150 }}
              className="w-24 h-24 bg-gradient-to-br from-teal-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-lg"
            >
              <CheckCircle className="h-12 w-12 text-white" />
            </motion.div>
            <motion.h3
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl font-bold text-gray-900 mb-4"
            >
              Request Submitted!
            </motion.h3>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg text-gray-600 leading-relaxed"
            >
              Thank you for your interest! We'll review your requirements and
              get back to you with a competitive quote within 24 hours.
            </motion.p>
          </motion.div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto border-0 shadow-2xl bg-gray-50 p-0">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="w-full"
            >
              {/* Header */}
              <div className="bg-gradient-to-r from-teal-600 to-green-600 p-8 relative overflow-hidden">
                {/* Decorative elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center space-x-6">
                      {/* Company Logo Placeholder */}
                      <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.1 }}
                        className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-lg"
                      >
                        <Building2 className="h-8 w-8 text-teal-600" />
                        {/* Replace the Building2 icon with your company logo:
                        <img src="/path-to-your-logo.png" alt="Company Logo" className="w-12 h-12 object-contain" />
                        */}
                      </motion.div>

                      <div>
                        <motion.h1
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 }}
                          className="text-4xl font-bold text-white mb-2"
                        >
                          Request Your Quote
                        </motion.h1>
                        <motion.p
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.3 }}
                          className="text-xl text-teal-100"
                        >
                          Get personalized pricing for{" "}
                          <span className="font-semibold text-white">
                            {product.name}
                          </span>
                        </motion.p>
                      </div>
                    </div>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={onClose}
                      className="text-white/80 hover:text-white hover:bg-white/10 rounded-full w-12 h-12 p-0 transition-all duration-200"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4"
                  >
                    <p className="text-white/90 text-sm leading-relaxed">
                      Fill out the form below with your requirements, and our
                      team will provide you with a detailed, competitive quote
                      tailored to your specific needs.
                    </p>
                  </motion.div>
                </div>
              </div>

              {/* Form Content */}
              <div className="p-8">
                {submitError && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    className="bg-red-50 border border-red-200 rounded-xl p-6 mb-8 shadow-sm"
                  >
                    <p className="text-red-800 font-medium">{submitError}</p>
                  </motion.div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                  {/* Customer Information */}
                  <FormSection title="Your Information" icon={User} delay={0.1}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <AnimatedInput icon={User} delay={0.2}>
                        <div className="space-y-3">
                          <Label
                            htmlFor="customerName"
                            className="text-sm font-semibold text-gray-700 block"
                          >
                            Full Name *
                          </Label>
                          <Input
                            id="customerName"
                            name="customerName"
                            value={formData.customerName}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                            className="pl-12 h-14 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl bg-white transition-all duration-200 text-base"
                          />
                        </div>
                      </AnimatedInput>

                      <AnimatedInput icon={Mail} delay={0.3}>
                        <div className="space-y-3">
                          <Label
                            htmlFor="customerEmail"
                            className="text-sm font-semibold text-gray-700 block"
                          >
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
                            className="pl-12 h-14 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl bg-white transition-all duration-200 text-base"
                          />
                        </div>
                      </AnimatedInput>

                      <AnimatedInput icon={Phone} delay={0.4}>
                        <div className="space-y-3">
                          <Label
                            htmlFor="customerPhone"
                            className="text-sm font-semibold text-gray-700 block"
                          >
                            Phone Number
                          </Label>
                          <Input
                            id="customerPhone"
                            name="customerPhone"
                            type="tel"
                            value={formData.customerPhone}
                            onChange={handleChange}
                            placeholder="+1 (555) 123-4567"
                            className="pl-12 h-14 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl bg-white transition-all duration-200 text-base"
                          />
                        </div>
                      </AnimatedInput>

                      <AnimatedInput icon={Building} delay={0.5}>
                        <div className="space-y-3">
                          <Label
                            htmlFor="company"
                            className="text-sm font-semibold text-gray-700 block"
                          >
                            Company
                          </Label>
                          <Input
                            id="company"
                            name="company"
                            value={formData.company}
                            onChange={handleChange}
                            placeholder="Your company name"
                            className="pl-12 h-14 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl bg-white transition-all duration-200 text-base"
                          />
                        </div>
                      </AnimatedInput>
                    </div>
                  </FormSection>

                  {/* Product Specifications */}
                  <FormSection
                    title="Product Specifications"
                    icon={Package2}
                    delay={0.6}
                  >
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <AnimatedInput icon={Package} delay={0.7}>
                        <div className="space-y-3">
                          <Label
                            htmlFor="quantity"
                            className="text-sm font-semibold text-gray-700 block"
                          >
                            Quantity *
                          </Label>
                          <Input
                            id="quantity"
                            name="quantity"
                            value={formData.quantity}
                            onChange={handleChange}
                            required
                            placeholder="e.g., 100 units"
                            className="pl-12 h-14 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl bg-white transition-all duration-200 text-base"
                          />
                        </div>
                      </AnimatedInput>

                      <AnimatedInput icon={Ruler} delay={0.8}>
                        <div className="space-y-3">
                          <Label
                            htmlFor="preferredSize"
                            className="text-sm font-semibold text-gray-700 block"
                          >
                            Preferred Size *
                          </Label>
                          <Select
                            value={formData.preferredSize}
                            onValueChange={(value) =>
                              handleSelectChange("preferredSize", value)
                            }
                          >
                            <SelectTrigger className="h-14 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl bg-white text-base">
                              <SelectValue placeholder="Select size" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-gray-200 bg-white shadow-lg">
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
                              <SelectItem value="custom">
                                Custom Size
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </AnimatedInput>

                      <AnimatedInput delay={0.9}>
                        <div className="space-y-3">
                          <Label
                            htmlFor="preferredMaterial"
                            className="text-sm font-semibold text-gray-700 block"
                          >
                            Preferred Material *
                          </Label>
                          <Select
                            value={formData.preferredMaterial}
                            onValueChange={(value) =>
                              handleSelectChange("preferredMaterial", value)
                            }
                          >
                            <SelectTrigger className="h-14 border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl bg-white text-base">
                              <SelectValue placeholder="Select material" />
                            </SelectTrigger>
                            <SelectContent className="rounded-xl border-gray-200 bg-white shadow-lg">
                              <SelectItem value="PVC">PVC</SelectItem>
                              <SelectItem value="CPVC">CPVC</SelectItem>
                              <SelectItem value="ABS">ABS</SelectItem>
                              <SelectItem value="PVC with Steel Reinforcement">
                                PVC with Steel Reinforcement
                              </SelectItem>
                              <SelectItem value="PVC with Rubber Seals">
                                PVC with Rubber Seals
                              </SelectItem>
                              <SelectItem value="other">
                                Other (specify in requirements)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </AnimatedInput>
                    </div>
                  </FormSection>

                  {/* Additional Requirements */}
                  <FormSection
                    title="Additional Details"
                    icon={FileText}
                    delay={1.0}
                  >
                    <AnimatedInput delay={1.1}>
                      <div className="space-y-3">
                        <Label
                          htmlFor="additionalRequirements"
                          className="text-sm font-semibold text-gray-700 block"
                        >
                          Special Requirements & Notes
                        </Label>
                        <Textarea
                          id="additionalRequirements"
                          name="additionalRequirements"
                          value={formData.additionalRequirements}
                          onChange={handleChange}
                          rows={5}
                          placeholder="Tell us about any custom specifications, delivery timeline, special features, or other details that will help us provide the perfect quote..."
                          className="border-gray-200 focus:border-teal-500 focus:ring-teal-500 rounded-xl bg-white resize-none transition-all duration-200 text-base p-4"
                        />
                      </div>
                    </AnimatedInput>
                  </FormSection>

                  {/* Action Buttons */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.2, duration: 0.5 }}
                    className="flex flex-col sm:flex-row gap-4 pt-6"
                  >
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 h-16 bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:opacity-70"
                    >
                      {isSubmitting ? (
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                          className="w-6 h-6 border-3 border-white border-l-transparent rounded-full mr-3"
                        />
                      ) : (
                        <Send className="w-6 h-6 mr-3" />
                      )}
                      {isSubmitting ? "Submitting Request..." : "Get My Quote"}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="h-16 px-8 border-2 border-gray-300 hover:bg-gray-50 rounded-2xl font-semibold text-base transition-all duration-200 hover:shadow-md"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                </form>
              </div>
            </motion.div>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
