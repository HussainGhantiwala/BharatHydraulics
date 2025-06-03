"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowRight, Play } from "lucide-react"
import Link from "next/link"

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pipeRef = useRef<HTMLDivElement>(null)
  const [isAnimating, setIsAnimating] = useState(true)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Pipe animation variables
    let animationId: number
    let time = 0

    const pipes = [
      { x: 0, y: 100, width: 300, height: 40, speed: 1, color: "#14b8a6" },
      { x: -200, y: 200, width: 250, height: 35, speed: 0.8, color: "#0d9488" },
      { x: -100, y: 300, width: 200, height: 30, speed: 1.2, color: "#0f766e" },
      { x: -300, y: 400, width: 350, height: 45, speed: 0.9, color: "#115e59" },
    ]

    const drawPipe = (pipe: any, offset: number) => {
      const x = pipe.x + offset
      const y = pipe.y
      const width = pipe.width
      const height = pipe.height

      // Create gradient for 3D effect
      const gradient = ctx.createLinearGradient(x, y, x, y + height)
      gradient.addColorStop(0, pipe.color)
      gradient.addColorStop(0.3, "#ffffff40")
      gradient.addColorStop(0.7, pipe.color)
      gradient.addColorStop(1, "#00000040")

      // Draw pipe body
      ctx.fillStyle = gradient
      ctx.fillRect(x, y, width, height)

      // Draw pipe ends (circular)
      ctx.fillStyle = pipe.color
      ctx.beginPath()
      ctx.arc(x, y + height / 2, height / 2, 0, Math.PI * 2)
      ctx.fill()

      ctx.beginPath()
      ctx.arc(x + width, y + height / 2, height / 2, 0, Math.PI * 2)
      ctx.fill()

      // Add shine effect
      ctx.fillStyle = "#ffffff60"
      ctx.fillRect(x, y + 5, width, 8)
    }

    const animate = () => {
      if (!isAnimating) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      time += 0.02

      pipes.forEach((pipe, index) => {
        const offset = (time * pipe.speed * 50) % (canvas.width + pipe.width + 100)
        drawPipe(pipe, offset - pipe.width)
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
    }
  }, [isAnimating])

  useEffect(() => {
    const handleScroll = () => {
      if (pipeRef.current) {
        const scrolled = window.scrollY
        const rate = scrolled * -0.5
        pipeRef.current.style.transform = `translateX(${rate}px) rotateZ(${scrolled * 0.1}deg)`
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-slate-50 via-teal-50 to-cyan-100 dark:from-gray-900 dark:via-green-950 dark:to-emerald-900">
      {/* Animated Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full opacity-20 dark:opacity-30"
        style={{ zIndex: 1 }}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden" style={{ zIndex: 2 }}>
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-teal-200 to-teal-400 dark:from-green-700 dark:to-green-500 rounded-full opacity-30 animate-float"></div>
        <div className="absolute bottom-20 right-10 w-24 h-24 bg-gradient-to-br from-cyan-200 to-cyan-400 dark:from-emerald-700 dark:to-emerald-500 rounded-full opacity-40 animate-float-delayed"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-gradient-to-br from-teal-300 to-teal-500 dark:from-green-600 dark:to-green-400 rounded-full opacity-25 animate-pulse-slow"></div>
        <div className="absolute top-1/3 right-1/3 w-20 h-20 bg-gradient-to-br from-cyan-300 to-cyan-500 dark:from-emerald-600 dark:to-emerald-400 rounded-full opacity-35 animate-bounce-slow"></div>
      </div>

      {/* 3D Pipe Animation */}
      <div
        ref={pipeRef}
        className="absolute right-0 top-1/2 -translate-y-1/2 opacity-10 dark:opacity-20"
        style={{ zIndex: 2 }}
      >
        <div className="w-96 h-16 bg-gradient-to-r from-teal-400 to-teal-600 dark:from-green-400 dark:to-green-600 rounded-full shadow-2xl transform perspective-1000 rotateX-12"></div>
        <div className="w-80 h-12 bg-gradient-to-r from-teal-300 to-teal-500 dark:from-green-300 dark:to-green-500 rounded-full shadow-xl transform perspective-1000 rotateX-12 mt-4 ml-8"></div>
        <div className="w-64 h-8 bg-gradient-to-r from-teal-200 to-teal-400 dark:from-green-200 dark:to-green-400 rounded-full shadow-lg transform perspective-1000 rotateX-12 mt-3 ml-16"></div>
      </div>

      <div className="container mx-auto px-4 z-10 relative" style={{ zIndex: 3 }}>
        <div className="max-w-5xl mx-auto text-center">
          {/* Badge */}
          <div className="mb-8 animate-fade-in-up">
            <span className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-100 to-cyan-100 dark:from-green-900 dark:to-emerald-900 text-teal-800 dark:text-green-200 rounded-full text-sm font-semibold shadow-lg backdrop-blur-sm border border-teal-200 dark:border-green-700">
              <div className="w-2 h-2 bg-teal-500 dark:bg-green-400 rounded-full mr-2 animate-pulse"></div>
              Leading PVC Solutions Provider Since 2009
            </span>
          </div>

          {/* Main Heading */}
          <div className="mb-8 animate-fade-in-up animation-delay-200">
            <h1 className="text-6xl md:text-8xl font-black mb-4 bg-gradient-to-r from-teal-600 via-cyan-600 to-teal-800 dark:from-green-400 dark:via-emerald-400 dark:to-green-600 bg-clip-text text-transparent leading-tight">
              Bharat
            </h1>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-700 dark:text-gray-300 mb-2">
              Hydraulics & Engineering Co.
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-teal-500 to-cyan-500 dark:from-green-400 dark:to-emerald-400 mx-auto rounded-full"></div>
          </div>

          {/* Description */}
          <div className="mb-12 animate-fade-in-up animation-delay-400">
            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 mb-6 max-w-4xl mx-auto leading-relaxed font-medium">
              Premium PVC pipes and fittings engineered for excellence.
              <span className="text-teal-600 dark:text-green-400 font-semibold">
                {" "}
                Quality, durability, and innovation
              </span>{" "}
              in every product.
            </p>
            <p className="text-lg text-gray-500 dark:text-gray-500 max-w-2xl mx-auto">
              Trusted by 1000+ customers across 50+ cities in India
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center animate-fade-in-up animation-delay-600">
            <Link href="/products">
              <Button
                size="lg"
                className="bg-gradient-to-r from-teal-600 to-cyan-600 hover:from-teal-700 hover:to-cyan-700 dark:from-green-600 dark:to-emerald-600 dark:hover:from-green-700 dark:hover:to-emerald-700 text-white px-10 py-6 text-lg font-semibold shadow-2xl hover:shadow-teal-500/25 dark:hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300 group border-0"
              >
                <div className="flex items-center">
                  Explore Products
                  <ArrowRight className="ml-3 h-5 w-5 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              </Button>
            </Link>

            <Link href="/quote">
              <Button
                variant="outline"
                size="lg"
                className="border-2 border-teal-600 dark:border-green-600 text-teal-600 dark:text-green-600 hover:bg-teal-50 dark:hover:bg-green-950 px-10 py-6 text-lg font-semibold shadow-xl hover:shadow-teal-500/20 dark:hover:shadow-green-500/20 transform hover:scale-105 transition-all duration-300 group backdrop-blur-sm"
              >
                <div className="flex items-center">
                  <Play className="mr-3 h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
                  Get Quote
                </div>
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-in-up animation-delay-800">
            {[
              { number: "500+", label: "Products" },
              { number: "1000+", label: "Customers" },
              { number: "15+", label: "Years" },
              { number: "50+", label: "Cities" },
            ].map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-3xl md:text-4xl font-black text-teal-600 dark:text-green-400 mb-2 group-hover:scale-110 transition-transform duration-300">
                  {stat.number}
                </div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce-slow z-10">
        <div className="w-6 h-10 border-2 border-teal-600 dark:border-green-600 rounded-full flex justify-center backdrop-blur-sm bg-white/20 dark:bg-black/20">
          <div className="w-1 h-3 bg-teal-600 dark:bg-green-600 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  )
}
