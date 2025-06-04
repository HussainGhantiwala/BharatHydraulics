import Link from "next/link"
import { ShoppingBag, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-teal-50 dark:bg-green-950 border-t border-teal-200 dark:border-green-800">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <ShoppingBag className="h-6 w-6 text-teal-600 dark:text-green-400" />
              <span className="text-lg font-bold text-teal-600 dark:text-green-400">Catalog</span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              Your trusted supplier for premium PVC pipes, fittings, and plumbing solutions.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-teal-600 dark:text-green-400">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-gray-600 hover:text-teal-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="text-gray-600 hover:text-teal-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-600 hover:text-teal-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/client"
                  className="text-gray-600 hover:text-teal-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                >
                  Client Portal
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-teal-600 dark:text-green-400">Categories</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/?category=drainage-pipes"
                  className="text-gray-600 hover:text-teal-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                >
                  Drainage Pipes
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=pressure-pipes"
                  className="text-gray-600 hover:text-teal-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                >
                  Pressure Pipes
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=pipe-fittings"
                  className="text-gray-600 hover:text-teal-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                >
                  Pipe Fittings
                </Link>
              </li>
              <li>
                <Link
                  href="/?category=valves"
                  className="text-gray-600 hover:text-teal-600 dark:text-gray-300 dark:hover:text-green-400 transition-colors"
                >
                  Valves
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4 text-teal-600 dark:text-green-400">Contact Info</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-center space-x-2">
                <Mail className="h-4 w-4 text-teal-600 dark:text-green-400" />
                <span className="text-gray-600 dark:text-gray-300">contact@catalog.com</span>
              </li>
              <li className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-teal-600 dark:text-green-400" />
                <span className="text-gray-600 dark:text-gray-300">+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-teal-600 dark:text-green-400" />
                <span className="text-gray-600 dark:text-gray-300">123 Business St, City</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-teal-200 dark:border-green-800 mt-8 pt-8 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-300">
            © {new Date().getFullYear()} Catalog. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
