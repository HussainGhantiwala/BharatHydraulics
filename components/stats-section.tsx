"use client"

import { useEffect, useState, useRef } from "react"

interface StatItem {
  number: number
  label: string
  suffix?: string
}

const stats: StatItem[] = [
  { number: 500, label: "Products Available", suffix: "+" },
  { number: 1000, label: "Happy Customers", suffix: "+" },
  { number: 15, label: "Years Experience", suffix: "+" },
  { number: 50, label: "Cities Served", suffix: "+" },
]

function AnimatedNumber({
  number,
  suffix = "",
  duration = 2000,
}: { number: number; suffix?: string; duration?: number }) {
  const [count, setCount] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      setCount(Math.floor(progress * number))

      if (progress < 1) {
        requestAnimationFrame(animate)
      }
    }

    requestAnimationFrame(animate)
  }, [isVisible, number, duration])

  return (
    <div ref={ref} className="text-4xl md:text-5xl font-bold text-teal-600 dark:text-green-400">
      {count}
      {suffix}
    </div>
  )
}

export function StatsSection() {
  return (
    <section className="py-20 bg-white dark:bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">Our Impact in Numbers</h2>
          <p className="text-xl text-gray-600 dark:text-gray-400">Trusted by thousands across the nation</p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <AnimatedNumber number={stat.number} suffix={stat.suffix} />
              <div className="text-lg font-medium text-gray-700 dark:text-gray-300 mt-2">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
