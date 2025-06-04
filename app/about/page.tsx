import { Card, CardContent } from "@/components/ui/card"
import { Users, Target, Award, Heart } from "lucide-react"

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-teal-600 dark:text-green-400">About PVC Pro Solutions</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300">
              Leading supplier of premium PVC pipes and fittings for over two decades
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <Card className="border-teal-200 dark:border-green-800 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Target className="h-8 w-8 text-teal-600 dark:text-green-400 mr-3" />
                  <h3 className="text-xl font-semibold">Our Mission</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  To provide the highest quality PVC pipes, fittings, and plumbing solutions that meet the demanding
                  needs of contractors, plumbers, and builders while maintaining competitive pricing and exceptional
                  service.
                </p>
              </CardContent>
            </Card>

            <Card className="border-teal-200 dark:border-green-800 hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Heart className="h-8 w-8 text-teal-600 dark:text-green-400 mr-3" />
                  <h3 className="text-xl font-semibold">Our Values</h3>
                </div>
                <p className="text-gray-600 dark:text-gray-300">
                  We believe in integrity, customer satisfaction, and continuous improvement. Every decision we make is
                  guided by these core principles.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-teal-50 dark:bg-green-950 rounded-lg p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6 text-center text-teal-600 dark:text-green-400">Our Story</h2>
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Founded in 2000, PVC Pro Solutions began as a small family business with a vision to become the most
                trusted supplier of PVC pipes and fittings in the region. What started with a single warehouse has grown
                into a comprehensive distribution network serving contractors, plumbers, and builders across the
                country.
              </p>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Our expertise spans drainage systems, pressure pipes, irrigation solutions, and specialized fittings.
                We've built our reputation on quality products, technical expertise, and reliable delivery that keeps
                projects on schedule and within budget.
              </p>
              <p className="text-gray-700 dark:text-gray-300">
                Today, we continue to innovate and expand our product range, always staying ahead of industry standards
                and customer needs while maintaining our commitment to quality and service excellence.
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center border-teal-200 dark:border-green-800">
              <CardContent className="p-6">
                <Users className="h-12 w-12 text-teal-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">10,000+</h3>
                <p className="text-gray-600 dark:text-gray-300">Happy Customers</p>
              </CardContent>
            </Card>

            <Card className="text-center border-teal-200 dark:border-green-800">
              <CardContent className="p-6">
                <Award className="h-12 w-12 text-teal-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">500+</h3>
                <p className="text-gray-600 dark:text-gray-300">Quality Products</p>
              </CardContent>
            </Card>

            <Card className="text-center border-teal-200 dark:border-green-800">
              <CardContent className="p-6">
                <Target className="h-12 w-12 text-teal-600 dark:text-green-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold mb-2">99%</h3>
                <p className="text-gray-600 dark:text-gray-300">Satisfaction Rate</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
