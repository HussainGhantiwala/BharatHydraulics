"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Star } from "lucide-react"
import { useEffect, useRef } from "react"
import { AnimatedCounter } from "@/components/animated-counter"

export function HeroSection() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Pipe animation variables
    let scrollY = 0
    const pipes: Array<{
      x: number
      y: number
      width: number
      height: number
      rotation: number
      speed: number
      opacity: number
    }> = []

    // Initialize pipes
    for (let i = 0; i < 8; i++) {
      pipes.push({
        x: Math.random() * canvas.offsetWidth,
        y: Math.random() * canvas.offsetHeight + 100,
        width: 60 + Math.random() * 40,
        height: 200 + Math.random() * 100,
        rotation: Math.random() * Math.PI * 2,
        speed: 0.5 + Math.random() * 1,
        opacity: 0.1 + Math.random() * 0.3,
      })
    }

    const drawPipe = (pipe: any) => {
      ctx.save()
      ctx.translate(pipe.x, pipe.y)
      ctx.rotate(pipe.rotation)
      ctx.globalAlpha = pipe.opacity

      // Pipe body gradient
      const gradient = ctx.createLinearGradient(-pipe.width / 2, 0, pipe.width / 2, 0)
      gradient.addColorStop(0, "#0d9488")
      gradient.addColorStop(0.5, "#14b8a6")
      gradient.addColorStop(1, "#0d9488")

      // Main pipe body
      ctx.fillStyle = gradient
      ctx.fillRect(-pipe.width / 2, -pipe.height / 2, pipe.width, pipe.height)

      // Pipe joints
      ctx.fillStyle = "#0f766e"
      ctx.fillRect(-pipe.width / 2 - 5, -pipe.height / 2, pipe.width + 10, 20)
      ctx.fillRect(-pipe.width / 2 - 5, pipe.height / 2 - 20, pipe.width + 10, 20)

      // Highlight
      ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
      ctx.fillRect(-pipe.width / 2 + 5, -pipe.height / 2 + 5, 10, pipe.height - 10)

      ctx.restore()
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight)

      // Update and draw pipes
      pipes.forEach((pipe) => {
        pipe.rotation += pipe.speed * 0.01
        pipe.y += Math.sin(pipe.rotation) * 0.5
        pipe.x += Math.cos(pipe.rotation * 0.5) * 0.3

        // Reset position if pipe goes off screen
        if (pipe.x > canvas.offsetWidth + 100) pipe.x = -100
        if (pipe.x < -100) pipe.x = canvas.offsetWidth + 100
        if (pipe.y > canvas.offsetHeight + 100) pipe.y = -100
        if (pipe.y < -100) pipe.y = canvas.offsetHeight + 100

        drawPipe(pipe)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Handle scroll effect
    const handleScroll = () => {
      scrollY = window.scrollY
      pipes.forEach((pipe, index) => {
        pipe.y -= scrollY * 0.001 * (index + 1)
        pipe.rotation += scrollY * 0.0001
      })
    }

    window.addEventListener("scroll", handleScroll)

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      window.removeEventListener("scroll", handleScroll)
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const scrollToProducts = () => {
    const productsSection = document.getElementById("products-section")
    if (productsSection) {
      productsSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  const scrollToQuotation = () => {
    const quotationSection = document.getElementById("quotation-section")
    if (quotationSection) {
      quotationSection.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-teal-50 via-white to-teal-100 dark:from-green-950 dark:via-black dark:to-green-900 py-20 overflow-hidden">
      {/* Animated Background Canvas */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none opacity-20 dark:opacity-30"
        style={{ width: "100%", height: "100%" }}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-16 h-16 bg-teal-200 dark:bg-green-800 rounded-full opacity-20 animate-bounce"></div>
        <div className="absolute top-40 right-20 w-12 h-12 bg-teal-300 dark:bg-green-700 rounded-full opacity-30 animate-pulse"></div>
        <div className="absolute bottom-20 left-1/4 w-20 h-20 bg-teal-100 dark:bg-green-900 rounded-full opacity-25 animate-bounce delay-1000"></div>
        <div className="absolute top-1/3 right-1/3 w-8 h-8 bg-teal-400 dark:bg-green-600 rounded-full opacity-40 animate-pulse delay-500"></div>
      </div>

      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(13, 148, 136, 0.3) 1px, transparent 0)`,
            backgroundSize: "50px 50px",
          }}
        ></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Trust Indicators */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center space-x-1 bg-white/80 dark:bg-black/80 backdrop-blur-sm rounded-full px-4 py-2 border border-teal-200 dark:border-green-800">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ))}
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300 font-medium">
                Trusted by 10,000+ professionals
              </span>
            </div>
          </div>

          {/* Main Heading with Animation */}
          <div className="relative">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 text-gray-900 dark:text-white leading-tight">
              <span className="inline-block animate-fade-in-up">Bharat Hydraulics</span>
              <br />
              <span className="text-teal-600 dark:text-green-400 inline-block animate-fade-in-up delay-200 relative">
                & Engineering Co.
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-teal-400 to-teal-600 dark:from-green-400 dark:to-green-600 rounded-full transform scale-x-0 animate-scale-x delay-1000"></div>
              </span>
            </h1>
          </div>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto leading-relaxed animate-fade-in-up delay-400">
            Your trusted partner for{" "}
            <span className="text-teal-600 dark:text-green-400 font-semibold">premium PVC pipes</span>,{" "}
            <span className="text-teal-600 dark:text-green-400 font-semibold">hydraulic fittings</span>, and{" "}
            <span className="text-teal-600 dark:text-green-400 font-semibold">engineering solutions</span>. From
            drainage systems to pressure pipes, we deliver excellence in every project.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-8 animate-fade-in-up delay-600">
            {["ISO Certified", "Fast Delivery", "Expert Support", "Bulk Pricing"].map((feature, index) => (
              <div
                key={feature}
                className="bg-white/90 dark:bg-black/90 backdrop-blur-sm border border-teal-200 dark:border-green-800 rounded-full px-4 py-2 text-sm font-medium text-teal-700 dark:text-green-300 hover:bg-teal-50 dark:hover:bg-green-950 transition-colors cursor-default"
                style={{ animationDelay: `${800 + index * 100}ms` }}
              >
                {feature}
              </div>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-in-up delay-1000">
            <Button
              size="lg"
              onClick={scrollToProducts}
              className="bg-teal-600 hover:bg-teal-700 dark:bg-green-600 dark:hover:bg-green-700 text-white px-8 py-4 text-lg font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
            >
              Explore Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={scrollToQuotation}
              className="border-2 border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-green-600 dark:text-green-400 dark:hover:bg-green-950 px-8 py-4 text-lg font-semibold backdrop-blur-sm bg-white/80 dark:bg-black/80 hover:shadow-lg transform hover:-translate-y-1 transition-all duration-300"
            >
              Get Quote
            </Button>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-3 gap-8 mt-16 animate-fade-in-up delay-1200">
            {[
              { number: 25, suffix: "+", label: "Years Experience" },
              { number: 500, suffix: "+", label: "Products" },
              { number: 10000, suffix: "+", label: "Happy Customers" },
            ].map((stat, index) => (
              <div
                key={stat.label}
                className="text-center bg-white/60 dark:bg-black/60 backdrop-blur-sm rounded-lg p-4 border border-teal-200/50 dark:border-green-800/50"
              >
                <AnimatedCounter
                  end={stat.number}
                  suffix={stat.suffix}
                  className="text-2xl md:text-3xl font-bold text-teal-600 dark:text-green-400 mb-1"
                  duration={2500}
                />
                <div className="text-sm text-gray-600 dark:text-gray-300 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 w-full overflow-hidden">
        <svg
          className="relative block w-full h-20"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path
            d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
            className="fill-white dark:fill-black"
          ></path>
          <path
            d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
            className="fill-white dark:fill-black"
          ></path>
          <path
            d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z"
            className="fill-white dark:fill-black"
          ></path>
        </svg>
      </div>
    </section>
  )
}
