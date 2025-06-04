"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User, Mail, Phone, MapPin, Building } from "lucide-react"

interface UserDetailsModalProps {
  isOpen: boolean
  onClose: () => void
}

export function UserDetailsModal({ isOpen, onClose }: UserDetailsModalProps) {
  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    address: "",
    businessType: "",
    interests: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    localStorage.setItem("user-details", JSON.stringify(userDetails))
    localStorage.setItem("user-details-provided", "true")
    onClose()
  }

  const handleSkip = () => {
    localStorage.setItem("user-details-provided", "true")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl text-teal-600 dark:text-green-400 flex items-center gap-2">
            <User className="h-6 w-6" />
            Welcome to PVC Pro Solutions!
          </DialogTitle>
          <p className="text-gray-600 dark:text-gray-300">
            Help us serve you better by sharing some details about your business needs.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="name"
                  value={userDetails.name}
                  onChange={(e) => setUserDetails((prev) => ({ ...prev, name: e.target.value }))}
                  className="pl-10 border-teal-200 dark:border-green-800"
                  placeholder="Your full name"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="email">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={userDetails.email}
                  onChange={(e) => setUserDetails((prev) => ({ ...prev, email: e.target.value }))}
                  className="pl-10 border-teal-200 dark:border-green-800"
                  placeholder="your@email.com"
                />
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  value={userDetails.phone}
                  onChange={(e) => setUserDetails((prev) => ({ ...prev, phone: e.target.value }))}
                  className="pl-10 border-teal-200 dark:border-green-800"
                  placeholder="+1 (555) 123-4567"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="company">Company Name</Label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="company"
                  value={userDetails.company}
                  onChange={(e) => setUserDetails((prev) => ({ ...prev, company: e.target.value }))}
                  className="pl-10 border-teal-200 dark:border-green-800"
                  placeholder="Your company name"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="businessType">Business Type</Label>
            <Select
              value={userDetails.businessType}
              onValueChange={(value) => setUserDetails((prev) => ({ ...prev, businessType: value }))}
            >
              <SelectTrigger className="border-teal-200 dark:border-green-800">
                <SelectValue placeholder="Select your business type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contractor">Contractor</SelectItem>
                <SelectItem value="plumber">Plumber</SelectItem>
                <SelectItem value="distributor">Distributor</SelectItem>
                <SelectItem value="retailer">Retailer</SelectItem>
                <SelectItem value="manufacturer">Manufacturer</SelectItem>
                <SelectItem value="homeowner">Homeowner</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="address">Address</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Textarea
                id="address"
                value={userDetails.address}
                onChange={(e) => setUserDetails((prev) => ({ ...prev, address: e.target.value }))}
                className="pl-10 border-teal-200 dark:border-green-800"
                placeholder="Your business address"
                rows={2}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="interests">Specific Interests</Label>
            <Textarea
              id="interests"
              value={userDetails.interests}
              onChange={(e) => setUserDetails((prev) => ({ ...prev, interests: e.target.value }))}
              className="border-teal-200 dark:border-green-800"
              placeholder="What PVC products are you most interested in? (e.g., drainage pipes, fittings, valves)"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700"
            >
              Save Details
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={handleSkip}
              className="border-gray-300 dark:border-gray-600"
            >
              Skip for Now
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
