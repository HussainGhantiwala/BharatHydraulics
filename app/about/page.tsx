"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Target, Eye, Award, Users, Globe, Zap } from "lucide-react"
import Image from "next/image"

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 },
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
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

export default function AboutPage() {
  return (
    <div className="min-h-screen py-20">
      <div className="container mx-auto px-4">
        {/* Hero Section */}
        <motion.div initial="initial" animate="animate" variants={staggerContainer} className="text-center mb-20">
  <motion.div variants={fadeInUp}>
    <Badge variant="secondary" className="bg-teal-100 text-teal-800 dark:bg-green-900 dark:text-green-100 mb-4">
      About Us
    </Badge>
    <h1 className="text-4xl lg:text-5xl font-bold mb-6">
      Precision. Strength.
      <span className="text-teal-600 dark:text-green-400"> Reliability</span>
    </h1>
    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
      Bharat Hydraulics and Engineering Co., based in Hyderabad, India, delivers high-performance hydraulic tube fittings built to power the next generation of hydraulic systems.
    </p>
  </motion.div>
</motion.div>

{/* Company Story */}
<motion.div
  initial="initial"
  whileInView="animate"
  viewport={{ once: true }}
  variants={staggerContainer}
  className="grid lg:grid-cols-2 gap-12 items-center mb-20"
>
  <motion.div variants={fadeInUp}>
    <h2 className="text-3xl font-bold mb-6">Our Story</h2>
    <div className="space-y-4 text-gray-600 dark:text-gray-300">
      <p>
        Founded in 2024, Bharat Hydraulics and Engineering Co. was established with a clear mission: to engineer durable, leak-proof hydraulic fittings capable of thriving in demanding industrial environments.
      </p>
      <p>
        From precision CNC machining to rigorous quality checks, every product is built with care and performance in mind. Our team is passionate about solving complex fluid power challenges through innovative design and engineering.
      </p>
      <p>
        Today, we proudly serve a wide array of sectors, from construction and agriculture to oil & gas and heavy machinery—delivering reliable, custom hydraulic solutions across India and beyond.
      </p>
    </div>
  </motion.div>
  <motion.div variants={fadeInUp}>
    <Image
      src="./Image/Bharat_Hydraulics.jpeg"
      alt="Our Manufacturing Facility"
      width={600}
      height={400}
      className="rounded-lg shadow-lg"
    />
  </motion.div>
</motion.div>

{/* Mission & Vision */}
<motion.div
  initial="initial"
  whileInView="animate"
  viewport={{ once: true }}
  variants={staggerContainer}
  className="grid md:grid-cols-2 gap-8 mb-20"
>
  <motion.div variants={fadeInUp}>
    <Card className="h-full">
      <CardHeader>
        <div className="w-12 h-12 bg-teal-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
          <Target className="h-6 w-6 text-teal-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-2xl">Our Mission</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">
          To provide durable, precision-engineered hydraulic fittings that exceed industry standards, ensuring reliability, safety, and performance in every application.
        </CardDescription>
      </CardContent>
    </Card>
  </motion.div>
  <motion.div variants={fadeInUp}>
    <Card className="h-full">
      <CardHeader>
        <div className="w-12 h-12 bg-teal-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
          <Eye className="h-6 w-6 text-teal-600 dark:text-green-400" />
        </div>
        <CardTitle className="text-2xl">Our Vision</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-base">
          To become India’s most trusted brand in hydraulic solutions by delivering world-class fittings that fuel the nation's industrial and infrastructure growth.
        </CardDescription>
      </CardContent>
    </Card>
  </motion.div>
</motion.div>

{/* Values */}
<motion.div
  initial="initial"
  whileInView="animate"
  viewport={{ once: true }}
  variants={staggerContainer}
  className="mb-20"
>
  <motion.div variants={fadeInUp} className="text-center mb-12">
    <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
    <p className="text-xl text-gray-600 dark:text-gray-300">Built on trust, driven by precision</p>
  </motion.div>

  <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
    {[
      {
        icon: Award,
        title: "Precision Manufacturing",
        description: "Advanced CNC processes ensure unmatched accuracy and consistency.",
      },
      {
        icon: Users,
        title: "Customer Commitment",
        description: "Dedicated support and guidance tailored to your specific needs.",
      },
      {
        icon: Globe,
        title: "National Reach",
        description: "Serving diverse industries across India with dependable delivery.",
      },
      {
        icon: Zap,
        title: "Innovation & Speed",
        description: "Continuous product development with fast turnaround times.",
      },
    ].map((value, index) => (
      <motion.div key={index} variants={fadeInUp}>
        <Card className="text-center h-full">
          <CardHeader>
            <div className="mx-auto w-12 h-12 bg-teal-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-4">
              <value.icon className="h-6 w-6 text-teal-600 dark:text-green-400" />
            </div>
            <CardTitle>{value.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>{value.description}</CardDescription>
          </CardContent>
        </Card>
      </motion.div>
    ))}
  </div>
</motion.div>

{/* Stats with Animated Counters */}
<motion.div
  initial="initial"
  whileInView="animate"
  viewport={{ once: true }}
  variants={fadeInUp}
  className="bg-teal-50 dark:bg-green-950/30 rounded-2xl p-8 lg:p-12"
>
  <div className="text-center mb-8">
    <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
    <p className="text-xl text-gray-600 dark:text-gray-300">Precision fittings powering industries nationwide</p>
  </div>

  <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
    {[
      { number: 1, label: "Years of Excellence", suffix: "+" },
      { number: 100, label: "Fitting Variants", suffix: "+" },
      { number: 50, label: "Happy Clients", suffix: "+" },
      { number: 10, label: "Industries Served", suffix: "+" },
    ].map((stat, index) => (
      <div key={index} className="text-center">
        <div className="text-4xl font-bold text-teal-600 dark:text-green-400 mb-2">
          <AnimatedCounter end={stat.number} />
          {stat.suffix}
        </div>
        <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
      </div>
    ))}
  </div>
</motion.div>
      </div>
    </div>
  )
}
