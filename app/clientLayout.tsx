"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { WelcomePopup } from "@/components/welcome-popup"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [showWelcomePopup, setShowWelcomePopup] = useState(false)

  useEffect(() => {
    // Check if user has visited before
    const userInfo = localStorage.getItem("bharatHydraulicsUser")

    if (!userInfo) {
      // First time visitor - show popup after a short delay
      const timer = setTimeout(() => {
        setShowWelcomePopup(true)
      }, 2000) // Show after 2 seconds

      return () => clearTimeout(timer)
    }
  }, [])

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
      <Navbar />
      <main className="pt-16">{children}</main>
      <Footer />
      <Toaster />
      <WelcomePopup isOpen={showWelcomePopup} onClose={() => setShowWelcomePopup(false)} />
    </ThemeProvider>
  )
}
