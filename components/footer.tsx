import { Wrench, Phone, Mail, MapPin, Facebook, Twitter, Linkedin, Instagram } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Wrench className="h-8 w-8 text-teal-400 dark:text-green-400" />
              <span className="font-bold text-xl">Bharat Hydraulics</span>
            </div>
            <p className="text-gray-400 text-sm">
              Leading provider of premium PVC pipes and fittings for hydraulic engineering solutions across India.
            </p>
            <div className="flex space-x-4">
              <Facebook className="h-5 w-5 text-gray-400 hover:text-teal-400 dark:hover:text-green-400 cursor-pointer transition-colors" />
              <Twitter className="h-5 w-5 text-gray-400 hover:text-teal-400 dark:hover:text-green-400 cursor-pointer transition-colors" />
              <Linkedin className="h-5 w-5 text-gray-400 hover:text-teal-400 dark:hover:text-green-400 cursor-pointer transition-colors" />
              <Instagram className="h-5 w-5 text-gray-400 hover:text-teal-400 dark:hover:text-green-400 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
            <div className="space-y-2">
              <Link
                href="/"
                className="block text-gray-400 hover:text-teal-400 dark:hover:text-green-400 transition-colors"
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block text-gray-400 hover:text-teal-400 dark:hover:text-green-400 transition-colors"
              >
                Products
              </Link>
              <Link
                href="/about"
                className="block text-gray-400 hover:text-teal-400 dark:hover:text-green-400 transition-colors"
              >
                About Us
              </Link>
              <Link
                href="/contact"
                className="block text-gray-400 hover:text-teal-400 dark:hover:text-green-400 transition-colors"
              >
                Contact
              </Link>
              <Link href="/quote" className="block text-gray-400 hover:text-white transition-colors font-medium">
                Get Quote
              </Link>
            </div>
          </div>

          {/* Products */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Products</h3>
            <div className="space-y-2">
              <Link
                href="/products?category=pipes"
                className="block text-gray-400 hover:text-teal-400 dark:hover:text-green-400 transition-colors"
              >
                PVC Pipes
              </Link>
              <Link
                href="/products?category=fittings"
                className="block text-gray-400 hover:text-teal-400 dark:hover:text-green-400 transition-colors"
              >
                Pipe Fittings
              </Link>
              <Link
                href="/products?category=valves"
                className="block text-gray-400 hover:text-teal-400 dark:hover:text-green-400 transition-colors"
              >
                Valves
              </Link>
              <Link
                href="/products?category=accessories"
                className="block text-gray-400 hover:text-teal-400 dark:hover:text-green-400 transition-colors"
              >
                Accessories
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-semibold text-lg mb-4">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-teal-400 dark:text-green-400" />
                <span className="text-gray-400 text-sm">+91 98765 43210</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-teal-400 dark:text-green-400" />
                <span className="text-gray-400 text-sm">info@bharathydraulics.com</span>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-teal-400 dark:text-green-400 mt-1" />
                <span className="text-gray-400 text-sm">
                  123 Industrial Area,
                  <br />
                  Mumbai, Maharashtra 400001
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8 text-center">
          <p className="text-gray-400 text-sm">© 2024 Bharat Hydraulics & Engineering Co. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
