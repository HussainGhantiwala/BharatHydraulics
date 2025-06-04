"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

interface Particle {
  id: number
  x: number
  y: number
  size: number
  rotation: number
  speed: number
  direction: number
  opacity: number
}

export function FloatingParticles() {
  const [particles, setParticles] = useState<Particle[]>([])
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })

  useEffect(() => {
    const updateDimensions = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  useEffect(() => {
    if (dimensions.width === 0) return

    const newParticles: Particle[] = []

    // Create simple pipe particles
    for (let i = 0; i < 15; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * dimensions.width,
        y: Math.random() * dimensions.height,
        size: Math.random() * 40 + 30, // 30-70px
        rotation: Math.random() * 360,
        speed: Math.random() * 0.3 + 0.1, // 0.1-0.4
        direction: Math.random() * Math.PI * 2,
        opacity: Math.random() * 0.15 + 0.05, // 0.05-0.2
      })
    }

    setParticles(newParticles)
  }, [dimensions])

  useEffect(() => {
    if (particles.length === 0) return

    const animateParticles = () => {
      setParticles((prev) =>
        prev.map((particle) => {
          let newX = particle.x + Math.cos(particle.direction) * particle.speed
          let newY = particle.y + Math.sin(particle.direction) * particle.speed

          // Wrap around screen edges
          if (newX > dimensions.width + 50) newX = -50
          if (newX < -50) newX = dimensions.width + 50
          if (newY > dimensions.height + 50) newY = -50
          if (newY < -50) newY = dimensions.height + 50

          return {
            ...particle,
            x: newX,
            y: newY,
            rotation: particle.rotation + 0.2,
          }
        }),
      )
    }

    const interval = setInterval(animateParticles, 50)
    return () => clearInterval(interval)
  }, [particles.length, dimensions])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute"
          style={{
            left: particle.x,
            top: particle.y,
            opacity: particle.opacity,
          }}
          animate={{
            rotate: particle.rotation,
          }}
          transition={{
            rotate: { duration: 0, ease: "linear" },
          }}
        >
          {/* Simple pipe SVG */}
          <svg
            width={particle.size}
            height={particle.size}
            viewBox="0 0 100 100"
            fill="none"
            className="text-teal-600 dark:text-green-500"
          >
            <rect x="10" y="35" width="80" height="30" rx="15" fill="currentColor" />
            <rect x="5" y="40" width="10" height="20" rx="5" fill="currentColor" />
            <rect x="85" y="40" width="10" height="20" rx="5" fill="currentColor" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
