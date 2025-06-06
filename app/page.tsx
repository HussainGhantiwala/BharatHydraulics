"use client"

import type React from "react"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Shield, Truck, Award, Users, Wrench, Factory, Eye, ShoppingCart } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { BrandsCarousel } from "@/components/brands-carousel"
import { FloatingParticles } from "@/components/floating-particles"
import { useProducts } from "@/contexts/product-context"
import type { Product } from "@/contexts/product-context"

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

// 3D Tilt Card Component - Professional Version
function TiltCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  const [direction, setDirection] = useState<string | null>(null)
  const cardRef = useRef<HTMLDivElement>(null)

  // More subtle rotation values
  const getRotation = () => {
    switch (direction) {
      case "top":
        return { rotateX: 3, rotateY: 0 }
      case "bottom":
        return { rotateX: -3, rotateY: 0 }
      case "left":
        return { rotateX: 0, rotateY: -3 }
      case "right":
        return { rotateX: 0, rotateY: 3 }
      default:
        return { rotateX: 0, rotateY: 0 }
    }
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const width = rect.width
    const height = rect.height
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top

    // Determine which quadrant the mouse is in
    const centerX = width / 2
    const centerY = height / 2
    const deltaX = mouseX - centerX
    const deltaY = mouseY - centerY

    // Only change direction when significantly away from center (reduces jitter)
    if (Math.abs(deltaX) < width * 0.2 && Math.abs(deltaY) < height * 0.2) {
      setDirection(null)
      return
    }

    // Determine primary direction (horizontal or vertical)
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      setDirection(deltaX > 0 ? "right" : "left")
    } else {
      setDirection(deltaY > 0 ? "bottom" : "top")
    }
  }

  const handleMouseLeave = () => {
    setDirection(null)
  }

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={getRotation()}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        mass: 0.8,
      }}
      className={`${className} cursor-default`}
      style={{ transformStyle: "preserve-3d" }}
    >
      <div style={{ transform: "translateZ(10px)" }}>{children}</div>
    </motion.div>
  )
}

export default function HomePage() {
  const { products } = useProducts()
  const featuredProducts = products.slice(0, 4)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)
  const [isQuotationModalOpen, setIsQuotationModalOpen] = useState(false)

  const handleQuotationClick = (product: Product) => {
    setSelectedProduct(product)
    setIsQuotationModalOpen(true)
  }

  const closeQuotationModal = () => {
    setIsQuotationModalOpen(false)
    setSelectedProduct(null)
  }

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
            <motion.div variants={fadeInLeft} className="space-y-6">
              <div className="space-y-7">
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
                    Bharat Hydraulics 
                  </motion.span>
                  <motion.span
                    className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-600 dark:from-teal-400 dark:to-green-400 block"
                    variants={fadeInUp}
                    whileHover={{
                      scale: 1.02,
                    }}
                    transition={{ duration: 0.3 }}
                  >
                    & Engineering
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
                      src="https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=600&h=600&fit=crop&crop=center"
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

      {/* Featured Products Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
            className="text-center mb-20"
          >
            <motion.h2 variants={fadeInUp} className="text-4xl lg:text-5xl font-bold mb-6">
              Featured
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-green-600 dark:from-teal-400 dark:to-green-400">
                {" "}
                Products
              </span>
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Discover our most popular and innovative PVC pipe solutions
            </motion.p>
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true, margin: "-50px" }}
            variants={staggerContainer}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12"
          >
            {featuredProducts.map((product, index) => (
              <motion.div key={product.id} variants={fadeInUp}>
                <TiltCard className="h-full">
                  <Card className="h-full hover:shadow-2xl transition-all duration-500 border-0 shadow-lg group overflow-hidden relative bg-white dark:bg-gray-800 flex flex-col">
                    <div className="absolute inset-0 bg-gradient-to-br from-teal-50/50 to-green-50/50 dark:from-teal-950/20 dark:to-green-950/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <CardHeader className="p-0 relative">
                      <div className="relative overflow-hidden rounded-t-lg h-48">
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          transition={{ duration: 0.6 }}
                          className="w-full h-full"
                        >
                          <Image
                            src={
                              product.image ||
                              "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300&h=200&fit=crop&crop=center" ||
                              "/placeholder.svg"
                            }
                            alt={product.name}
                            width={300}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </motion.div>
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <div className="absolute top-3 right-3">
                          <Badge variant="secondary" className="bg-white/90 text-gray-800 backdrop-blur-sm">
                            {product.category}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="p-6 relative z-10 flex-1 flex flex-col">
                      <CardTitle className="text-lg mb-3 line-clamp-2 group-hover:text-teal-600 dark:group-hover:text-green-400 transition-colors duration-300 min-h-[3.5rem]">
                        {product.name}
                      </CardTitle>
                      <CardDescription className="mb-4 line-clamp-3 text-sm flex-1 min-h-[4.5rem]">
                        {product.description}
                      </CardDescription>

                      <div className="space-y-2 mb-6 text-xs">
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Material:</span>
                          <span className="font-medium">{product.material}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Size:</span>
                          <span className="font-medium">{product.sizeRange}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500 dark:text-gray-400">Pressure:</span>
                          <span className="font-medium">{product.pressureRating}</span>
                        </div>
                      </div>

                      <div className="flex gap-2 relative z-20 mt-auto">
                        <Button
                          asChild
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 text-white"
                        >
                          <Link href={`/catalogue/${product.id}`}>
                            <Eye className="mr-1 h-3 w-3" />
                            View
                          </Link>
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1 border-teal-200 dark:border-green-700 hover:bg-teal-50 dark:hover:bg-green-950"
                        >
                          
                          <ShoppingCart className="mr-1 h-3 w-3" />
                          <Link href="/contact">
                          Quote
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TiltCard>
              </motion.div>
            ))}
          </motion.div>

          <motion.div
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            variants={fadeInUp}
            className="text-center"
          >
            <motion.div whileHover={buttonHover} whileTap={buttonTap}>
              <Button
                asChild
                size="lg"
                className="bg-gradient-to-r from-teal-600 to-green-600 hover:from-teal-700 hover:to-green-700 px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-2xl transition-all duration-300 rounded-full"
              >
                <Link href="/catalogue">
                  View All Products
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
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
              Why Choose Bharat Hydraulics & Engineering?
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
                <TiltCard className="h-full">
                  <Card className="h-full hover:shadow-xl transition-all duration-300 border-0 shadow-lg group overflow-hidden relative">
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
                          scale: 1.1,
                        }}
                        transition={{ duration: 0.3 }}
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
                </TiltCard>
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

      {/* Quotation Modal */}
    </div>
  )
}
