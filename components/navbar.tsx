"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import { Menu, X, Wrench } from "lucide-react"

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <nav className="fixed top-0 w-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-2">
            <Wrench className="h-8 w-8 text-teal-600 dark:text-green-400" />
            <span className="font-bold text-xl text-gray-900 dark:text-white">Bharat Hydraulics</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-green-400 transition-colors"
            >
              Home
            </Link>
            <Link
              href="/products"
              className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-green-400 transition-colors"
            >
              Products
            </Link>
            <Link
              href="/about"
              className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-green-400 transition-colors"
            >
              About
            </Link>
            <Link
              href="/contact"
              className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-green-400 transition-colors"
            >
              Contact
            </Link>
            <Link
              href="/quote"
              className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-green-400 transition-colors"
            >
              Get Quote
            </Link>
            <ThemeToggle />
            <Link href="/client">
              <Button
                variant="outline"
                size="sm"
                className="border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-950"
              >
                Client Portal
              </Button>
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex flex-col space-y-4">
              <Link
                href="/"
                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-green-400 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-green-400 transition-colors"
              >
                Products
              </Link>
              <Link
                href="/about"
                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-green-400 transition-colors"
              >
                About
              </Link>
              <Link
                href="/contact"
                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-green-400 transition-colors"
              >
                Contact
              </Link>
              <Link
                href="/quote"
                className="text-gray-700 dark:text-gray-300 hover:text-teal-600 dark:hover:text-green-400 transition-colors"
              >
                Get Quote
              </Link>
              <Link href="/client">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-950 w-fit"
                >
                  Client Portal
                </Button>
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
