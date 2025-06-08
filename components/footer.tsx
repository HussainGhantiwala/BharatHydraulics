import Link from "next/link"
import { Wrench, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-teal-600 dark:bg-green-600 rounded-lg flex items-center justify-center">
                <Wrench className="h-5 w-5 text-white" />
              </div>
              <span className="text-xl font-bold">Bharat Hydraulics & Engineering Co.</span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Leading supplier of premium PVC pipe clamps, flanges, and fittings for industrial and commercial
              applications worldwide.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { href: "/", label: "Home" },
                { href: "/about", label: "About Us" },
                { href: "/catalogue", label: "Catalogue" },
                { href: "/contact", label: "Contact" },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-gray-400 hover:text-teal-400 dark:hover:text-green-400 transition-colors text-sm"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Products</h3>
            <ul className="space-y-2">
              {["Pipe Clamps", "Flanges", "Fittings", "Valves", "Couplings", "Adapters"].map((product) => (
                <li key={product}>
                  <Link
                    href="/catalogue"
                    className="text-gray-400 hover:text-teal-400 dark:hover:text-green-400 transition-colors text-sm"
                  >
                    {product}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Info</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-teal-400 dark:text-green-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400 text-sm">
                  Ground Floor A Block,
                  <br />
                  Plot No. 78/b/12, Sy No. 79,
                  <br />
                  Vijaya Laxmi Communications, Jeedimetla.
                  <br />
                  Hyderabad - 500015
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-teal-400 dark:text-green-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-teal-400 dark:text-green-400 flex-shrink-0" />
                <span className="text-gray-400 text-sm">info.bharathydraulic@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">© 2025 Bharat Hydraulics & Engineering Co. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
