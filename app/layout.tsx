import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Navbar } from "@/components/navbar"
import { Footer } from "@/components/footer"
import { ProductProvider } from "@/contexts/product-context"
import { UserInfoModal } from "@/components/user-info-modal"
import { ToastProvider } from "@/components/ui/toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Bharat Hydraulics & Engineering - Premium Pipe Clamps & Flanges",
  description:
    "Professional supplier of high-quality PVC pipe clamps, flanges, and fittings for industrial and commercial applications.",
  keywords: "PVC pipes, pipe clamps, flanges, industrial fittings, plumbing supplies",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ToastProvider>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <ProductProvider>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main>{children}</main>
              <Footer />
              <UserInfoModal />
            </div>
          </ProductProvider>
        </ThemeProvider>
        </ToastProvider>

      </body>
    </html>
  )
}
