"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Truck, Award, Users, Wrench, Factory } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BrandsCarousel } from "@/components/brands-carousel"
import { FloatingParticles } from "@/components/floating-particles"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
}

const fadeInLeft = {
  initial: { opacity: 0, x: -60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
}

const fadeInRight = {
  initial: { opacity: 0, x: 60 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
}

const scaleIn = {
  initial: { opacity: 0, scale: 0.8 },
  animate: { opacity: 1, scale: 1 },
  transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] },
}

const buttonHover = {
  scale: 1.05,
  y: -2,
  transition: {
    type: "spring",
    stiffness: 400,
    damping: 10,
    duration: 0.2,
  },
}

const buttonTap = {
  scale: 0.95,
  y: 0,
}

const cardHover = {
  y: -12,
  scale: 1.03,
  rotateY: 5,
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 20,
    duration: 0.3,
  },
}

const imageHover = {
  scale: 1.05,
  rotateY: 8,
  rotateX: 2,
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 20,
    duration: 0.4,
  },
}

const glowEffect = {
  boxShadow: [
    "0 0 20px rgba(20, 184, 166, 0.3)",
    "0 0 40px rgba(20, 184, 166, 0.5)",
    "0 0 20px rgba(20, 184, 166, 0.3)",
  ],
  transition: {
    duration: 2,
    repeat: Number.POSITIVE_INFINITY,
    ease: "easeInOut",
  },
}

function AnimatedCounter({ end, duration = 2 }: { end: number; duration?: number }) {
  const [count, setCount] = useState(0)
  const countRef = useRef(null)
  const isInView = useInView(countRef, { once: true, margin: "-100px" })

  useEffect(() => {
    if (isInView) {
      let startTime: number
      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime
        const progress = Math.min((currentTime - startTime) / (duration * 1000), 1)

        const easeOutQuart = 1 - Math.pow(1 - progress, 4)
        setCount(Math.floor(easeOutQuart * end))

        if (progress < 1) {
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }
  }, [isInView, end, duration])

  return <span ref={countRef}>{count}</span>
}

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient Background */}
      <section className="relative overflow-hidden min-h-screen flex items-center">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-white via-teal-50 to-green-100 dark:from-gray-900 dark:via-teal-950 dark:to-green-950">
          {/* Floating Pipes */}
          <FloatingParticles />

          {/* Subtle overlay pattern */}
          <div className="absolute inset-0 opacity-30">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `radial-gradient(circle at 25% 25%, rgba(20, 184, 166, 0.1) 0%, transparent 50%),
                               radial-gradient(circle at 75% 75%, rgba(34, 197, 94, 0.1) 0%, transparent 50%)`,
              }}
            />
          </div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial="initial"
            animate="animate"
            variants={staggerContainer}
            className="grid lg:grid-cols-2 gap-16 items-center"
          >
            <motion.div variants={fadeInLeft} className="space-y-8">
              <div className="space-y-6">
                <motion.div variants={scaleIn}>
                  <motion.div whileHover={{ scale: 1.05, rotate: [0, -1, 1, 0] }} transition={{ duration: 0.3 }}>
                    <Badge
                      variant="secondary"
                      className="bg-teal-100 text-teal-800 dark:bg-green-900 dark:text-green-100 px-6 py-3 text-base font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                      ✨ Industry Leading Solutions
                    </Badge>
                  </motion.div>
                </motion.div>

                <motion.h1
                  className="text-5xl lg:text-7xl font-bold text-gray-900 dark:text-white leading-tight"
                  variants={fadeInUp}
                >
                  <motion.span
                    whileHover={{ scale: 1.02, textShadow: "0 0 8px rgba(20, 184, 166, 0.3)" }}
                    transition={{ duration: 0.2 }}
                  >
                    Premium PVC
                  </motion.span>
                  <motion.span
                    className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-600 dark:from-teal-400 dark:to-green-400 block"
                    variants={fadeInUp}
                    whileHover={{
                      scale: 1.02,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    Pipe Solutions
                  </motion.span>
                </motion.h1>

                <motion.p
                  className="text-xl lg:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed"
                  variants={fadeInUp}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  Professional supplier of high-quality PVC pipe clamps, flanges, and fittings for industrial and
                  commercial applications worldwide.
                </motion.p>
              </div>

              <motion.div className="flex flex-col sm:flex-row gap-6" variants={fadeInUp}>
                <motion.div whileHover={buttonHover} whileTap={buttonTap} className="group">
                  <Button
                    asChild
                    size="lg"
                    className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 dark:from-teal-600 dark:to-green-600 dark:hover:from-teal-700 dark:hover:to-green-700 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 rounded-full relative overflow-hidden"
                  >
                    <Link href="/catalogue" className="relative z-10 flex items-center">
                      View Catalogue
                      <motion.div
                        className="ml-2"
                        animate={{ x: [0, 4, 0] }}
                        transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY }}
                      >
                        <ArrowRight className="h-5 w-5" />
                      </motion.div>
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                        initial={{ x: "-100%" }}
                        whileHover={{ x: "100%" }}
                        transition={{ duration: 0.6 }}
                      />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                  <Button
                    asChild
                    variant="outline"
                    size="lg"
                    className="px-8 py-4 text-lg font-semibold border-2 border-teal-200 dark:border-green-700 hover:bg-teal-50 dark:hover:bg-green-950 rounded-full backdrop-blur-sm hover:border-teal-400 dark:hover:border-green-500 transition-all duration-300 hover:shadow-lg"
                  >
                    <Link href="/contact">Contact Us</Link>
                  </Button>
                </motion.div>
              </motion.div>

              <motion.div className="grid grid-cols-3 gap-8 pt-8" variants={staggerContainer}>
                {[
                  { end: 500, label: "Products", suffix: "+" },
                  { end: 15, label: "Years Experience", suffix: "+" },
                  { end: 1000, label: "Happy Clients", suffix: "+" },
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    variants={scaleIn}
                    className="text-center group cursor-pointer"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ duration: 0.2 }}
                  >
                    <motion.div
                      className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-600 dark:from-teal-400 dark:to-green-400"
                      whileHover={glowEffect}
                    >
                      <AnimatedCounter end={stat.end} />
                      {stat.suffix}
                    </motion.div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 font-medium mt-2 group-hover:text-teal-600 dark:group-hover:text-green-400 transition-colors duration-200">
                      {stat.label}
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            <motion.div variants={fadeInRight} className="relative">
              <motion.div
                className="relative z-10 group"
                whileHover={imageHover}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                <div className="relative overflow-hidden rounded-3xl shadow-2xl group-hover:shadow-3xl transition-shadow duration-500">
                  <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.6 }}>
                    <Image
                      src="/placeholder.svg?height=600&width=600"
                      alt="PVC Pipe Clamps and Flanges"
                      width={600}
                      height={600}
                      className="w-full h-auto"
                    />
                  </motion.div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent group-hover:from-black/10 transition-all duration-500" />

                  {/* Floating elements around the image */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-8 h-8 bg-teal-500 rounded-full opacity-60"
                    animate={{
                      y: [0, -10, 0],
                      scale: [1, 1.2, 1],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                    }}
                  />
                  <motion.div
                    className="absolute -bottom-6 -left-6 w-6 h-6 bg-green-500 rounded-full opacity-50"
                    animate={{
                      y: [0, 8, 0],
                      x: [0, 4, 0],
                      scale: [1, 1.1, 1],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  />
                </div>
              </motion.div>

              {/* Enhanced background decoration */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-tr from-teal-400/20 to-green-400/20 dark:from-teal-400/20 dark:to-green-400/20 rounded-3xl transform rotate-6 -z-10"
                animate={{
                  rotate: [6, 8, 6],
                  scale: [1, 1.02, 1],
                  opacity: [0.2, 0.3, 0.2],
                }}
                transition={{
                  duration: 8,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />

              {/* Additional decorative elements */}
              <motion.div
                className="absolute -top-8 -left-8 w-16 h-16 bg-gradient-to-br from-teal-400/30 to-green-400/30 rounded-full blur-xl -z-20"
                animate={{
                  scale: [1, 1.5, 1],
                  opacity: [0.3, 0.6, 0.3],
                }}
                transition={{
                  duration: 6,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Brands Carousel */}
      <BrandsCarousel />

      {/* Enhanced Features Section */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl lg:text-5xl font-bold mb-6">
              Why Choose PVC Pro Solutions?
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              We deliver exceptional quality and service that sets us apart in the industry
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {[
              {
                icon: Shield,
                title: "Premium Quality",
                description: "All products meet international standards with rigorous quality control",
                color: "from-blue-500 to-cyan-500",
                bgColor: "rgba(59, 130, 246, 0.1)",
              },
              {
                icon: Truck,
                title: "Fast Delivery",
                description: "Quick and reliable shipping to get your projects moving",
                color: "from-green-500 to-teal-500",
                bgColor: "rgba(34, 197, 94, 0.1)",
              },
              {
                icon: Award,
                title: "Industry Certified",
                description: "ISO certified with proven track record in the industry",
                color: "from-purple-500 to-pink-500",
                bgColor: "rgba(168, 85, 247, 0.1)",
              },
              {
                icon: Users,
                title: "Expert Support",
                description: "Dedicated technical support team to assist with your needs",
                color: "from-orange-500 to-red-500",
                bgColor: "rgba(249, 115, 22, 0.1)",
              },
              {
                icon: Wrench,
                title: "Custom Solutions",
                description: "Tailored products and solutions for specific requirements",
                color: "from-indigo-500 to-blue-500",
                bgColor: "rgba(99, 102, 241, 0.1)",
              },
              {
                icon: Factory,
                title: "Manufacturing Excellence",
                description: "State-of-the-art manufacturing facilities and processes",
                color: "from-emerald-500 to-green-500",
                bgColor: "rgba(16, 185, 129, 0.1)",
              },
            ].map((feature, index) => (
              <motion.div key={index} variants={fadeInUp}>
                <motion.div whileHover={cardHover} className="h-full group cursor-pointer">
                  <Card className="h-full hover:shadow-2xl transition-all duration-500 border-0 shadow-lg group overflow-hidden relative">
                    <motion.div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      style={{
                        backgroundColor: feature.bgColor,
                      }}
                    />
                    <CardHeader className="text-center pb-4 relative z-10">
                      <motion.div
                        className={`mx-auto w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:shadow-xl`}
                        whileHover={{
                          rotate: [0, -10, 10, 0],
                          scale: 1.1,
                        }}
                        transition={{ duration: 0.6 }}
                      >
                        <feature.icon className="h-8 w-8 text-white" />
                      </motion.div>
                      <CardTitle className="text-xl font-bold group-hover:text-teal-600 dark:group-hover:text-green-400 transition-colors duration-300">
                        {feature.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="relative z-10">
                      <CardDescription className="text-center text-base leading-relaxed group-hover:text-gray-700 dark:group-hover:text-gray-200 transition-colors duration-300">
                        {feature.description}
                      </CardDescription>
                    </CardContent>
                  </Card>
                </motion.div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Enhanced CTA Section */}
      <section className="py-24 bg-gradient-to-r from-teal-600 via-teal-700 to-green-600 dark:from-teal-800 dark:via-teal-900 dark:to-green-800 relative overflow-hidden">
        <motion.div
          className="absolute inset-0"
          animate={{
            background: [
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 80% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%)",
            ],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="max-w-4xl mx-auto"
          >
            <motion.h2
              className="text-4xl lg:text-6xl font-bold text-white mb-8"
              whileHover={{ scale: 1.02, textShadow: "0 0 20px rgba(255,255,255,0.3)" }}
              transition={{ duration: 0.3 }}
            >
              Ready to Get Started?
            </motion.h2>
            <motion.p
              className="text-xl lg:text-2xl text-teal-100 dark:text-green-100 mb-12 leading-relaxed"
              whileHover={{ scale: 1.01 }}
              transition={{ duration: 0.2 }}
            >
              Explore our comprehensive catalogue or get in touch with our experts for personalized solutions.
            </motion.p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                <Button
                  asChild
                  size="lg"
                  variant="secondary"
                  className="px-10 py-4 text-lg font-semibold rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <Link href="/catalogue">Browse Catalogue</Link>
                </Button>
              </motion.div>
              <motion.div whileHover={buttonHover} whileTap={buttonTap}>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white hover:bg-white hover:text-teal-600 dark:hover:text-green-800 px-10 py-4 text-lg font-semibold rounded-full backdrop-blur-sm transition-all duration-300 hover:shadow-xl"
                >
                  <Link href="/contact">Get Quote</Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
  