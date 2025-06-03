import { Button } from "@/components/ui/button"
import { ArrowRight, Phone, Mail } from "lucide-react"
import Link from "next/link"

export function CTASection() {
  return (
    <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-800 dark:from-green-600 dark:to-green-800">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
        <p className="text-xl text-teal-100 dark:text-green-100 mb-8 max-w-2xl mx-auto">
          Contact us today for premium PVC solutions tailored to your needs. Our experts are ready to help you find the
          perfect products.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link href="/contact">
            <Button
              size="lg"
              variant="secondary"
              className="bg-white text-teal-600 hover:bg-gray-100 px-8 py-4 text-lg group"
            >
              <Phone className="mr-2 h-5 w-5" />
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <Link href="/quote">
            <Button
              size="lg"
              variant="outline"
              className="border-white text-white hover:bg-white hover:text-teal-600 px-8 py-4 text-lg"
            >
              <Mail className="mr-2 h-5 w-5" />
              Get Quote
            </Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
