"use client"

import Link from "next/link"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, Building } from "lucide-react"
import { useRouter } from "next/navigation"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isClientAuthenticated, setIsClientAuthenticated] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem("client-authenticated")
      setIsClientAuthenticated(!!isAuth)
    }

    checkAuth()
    window.addEventListener("storage", checkAuth)
    return () => window.removeEventListener("storage", checkAuth)
  }, [])

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-black/95 dark:supports-[backdrop-filter]:bg-black/60 border-teal-200 dark:border-green-800">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <Building className="h-8 w-8 text-teal-600 dark:text-green-400" />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-teal-600 dark:text-green-400 leading-tight">
                Bharat Hydraulics
              </span>
              <span className="text-xs text-gray-600 dark:text-gray-400 leading-tight">& Engineering Co.</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            <Link
              href="/"
              className="text-gray-700 hover:text-teal-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/about"
              className="text-gray-700 hover:text-teal-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 hover:text-teal-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
            >
              Contact
            </Link>
            <Link
              href={isClientAuthenticated ? "/client" : "/client/login"}
              className="text-gray-700 hover:text-teal-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
            >
              {isClientAuthenticated ? "Client Portal" : "Client Login"}
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden border-t border-teal-200 dark:border-green-800 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-teal-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/about"
                className="text-gray-700 hover:text-teal-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 hover:text-teal-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href={isClientAuthenticated ? "/client" : "/client/login"}
                className="text-gray-700 hover:text-teal-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {isClientAuthenticated ? "Client Portal" : "Client Login"}
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
