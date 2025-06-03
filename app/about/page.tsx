import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Award, Users, Clock, Target, CheckCircle, Wrench } from "lucide-react"

export default function AboutPage() {
  const values = [
    {
      icon: <Award className="h-8 w-8 text-teal-600 dark:text-green-400" />,
      title: "Quality Excellence",
      description: "We maintain the highest standards in all our products and services.",
    },
    {
      icon: <Users className="h-8 w-8 text-teal-600 dark:text-green-400" />,
      title: "Customer Focus",
      description: "Our customers are at the heart of everything we do.",
    },
    {
      icon: <Clock className="h-8 w-8 text-teal-600 dark:text-green-400" />,
      title: "Reliability",
      description: "Dependable products and services you can trust.",
    },
    {
      icon: <Target className="h-8 w-8 text-teal-600 dark:text-green-400" />,
      title: "Innovation",
      description: "Continuously improving and adopting new technologies.",
    },
  ]

  const achievements = [
    "ISO 9001:2015 Certified",
    "15+ Years of Excellence",
    "1000+ Satisfied Customers",
    "50+ Cities Served",
    "Award-winning Products",
    "24/7 Customer Support",
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-r from-teal-600 to-teal-800 dark:from-green-600 dark:to-green-800 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold mb-6">About Us</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Leading the industry with premium PVC solutions and unmatched expertise in hydraulic engineering
          </p>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <Badge className="bg-teal-100 text-teal-800 dark:bg-green-900 dark:text-green-200 mb-4">Our Story</Badge>
              <h2 className="text-4xl font-bold mb-6 text-gray-900 dark:text-white">
                Bharat Hydraulics & Engineering Co.
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Founded with a vision to provide premium PVC solutions across India, Bharat Hydraulics has grown from a
                small local business to a trusted name in the hydraulic engineering industry.
              </p>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
                Our commitment to quality, innovation, and customer satisfaction has made us the preferred choice for
                contractors, engineers, and businesses nationwide.
              </p>
              <div className="flex items-center space-x-4">
                <Wrench className="h-12 w-12 text-teal-600 dark:text-green-400" />
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">Engineering Excellence</h3>
                  <p className="text-gray-600 dark:text-gray-400">Since 2009</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="/placeholder.svg?height=500&width=600"
                alt="Company facility"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
                <div className="text-3xl font-bold text-teal-600 dark:text-green-400">15+</div>
                <div className="text-gray-600 dark:text-gray-400">Years of Excellence</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Our Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">The principles that guide everything we do</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="text-center p-6 hover:shadow-lg transition-shadow">
                <CardContent className="space-y-4">
                  <div className="flex justify-center">{value.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{value.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Our Achievements</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Milestones that reflect our commitment to excellence
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement, index) => (
              <div
                key={index}
                className="flex items-center space-x-3 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-sm"
              >
                <CheckCircle className="h-6 w-6 text-teal-600 dark:text-green-400 flex-shrink-0" />
                <span className="text-gray-900 dark:text-white font-medium">{achievement}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20 bg-gradient-to-r from-teal-50 to-teal-100 dark:from-green-950 dark:to-green-900">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <Card className="p-8">
              <CardContent className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Mission</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  To provide innovative, high-quality PVC solutions that meet the evolving needs of our customers while
                  contributing to sustainable infrastructure development across India.
                </p>
              </CardContent>
            </Card>

            <Card className="p-8">
              <CardContent className="space-y-4">
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">Our Vision</h3>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  To be the most trusted and preferred partner for PVC pipe solutions, setting industry standards for
                  quality, innovation, and customer service.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  )
}
