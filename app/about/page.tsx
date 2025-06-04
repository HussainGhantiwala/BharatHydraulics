"use client"

import { motion } from "framer-motion"
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
              Leading the Industry with
              <span className="text-teal-600 dark:text-green-400"> Innovation</span>
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              For over 15 years, Bharat Hydraulics & Engineering has been at the forefront of providing premium Bharat Hydraulics & Engineering products to
              industries worldwide.
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
                Founded in 2008, Bharat Hydraulics & Engineering began as a small family business with a vision to provide
                high-quality Bharat Hydraulics & Engineering products to local industries. What started as a modest operation has grown into a
                leading supplier serving clients across multiple continents.
              </p>
              <p>
                Our commitment to quality, innovation, and customer satisfaction has been the driving force behind our
                growth. We've continuously invested in state-of-the-art manufacturing facilities and cutting-edge
                technology to ensure our products meet the highest industry standards.
              </p>
              <p>
                Today, we're proud to be a trusted partner for thousands of businesses worldwide, providing them with
                reliable, durable, and cost-effective Bharat Hydraulics & Engineering products that keep their operations running smoothly.
              </p>
            </div>
          </motion.div>
          <motion.div variants={fadeInUp}>
            <Image
              src="/placeholder.svg?height=400&width=600"
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
                  To provide innovative, high-quality Bharat Hydraulics & Engineering that exceed customer expectations while
                  maintaining environmental responsibility and contributing to sustainable industrial development
                  worldwide.
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
                  To be the global leader in Bharat Hydraulics & Engineering, recognized for our innovation, quality, and commitment
                  to customer success, while setting new standards for excellence in the industry.
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
            <p className="text-xl text-gray-600 dark:text-gray-300">The principles that guide everything we do</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: Award,
                title: "Quality Excellence",
                description: "Uncompromising commitment to the highest quality standards",
              },
              {
                icon: Users,
                title: "Customer Focus",
                description: "Putting our customers' needs at the center of everything we do",
              },
              {
                icon: Globe,
                title: "Global Reach",
                description: "Serving customers worldwide with consistent quality and service",
              },
              {
                icon: Zap,
                title: "Innovation",
                description: "Continuously improving and developing new solutions",
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

        {/* Stats */}
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={fadeInUp}
          className="bg-teal-50 dark:bg-green-950/30 rounded-2xl p-8 lg:p-12"
        >
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-4">Our Impact</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">Numbers that speak to our commitment and success</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { number: "15+", label: "Years of Experience" },
              { number: "500+", label: "Product Variants" },
              { number: "1000+", label: "Satisfied Clients" },
              { number: "50+", label: "Countries Served" },
            ].map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-teal-600 dark:text-green-400 mb-2">{stat.number}</div>
                <div className="text-gray-600 dark:text-gray-300">{stat.label}</div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
