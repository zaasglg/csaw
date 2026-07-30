"use client"

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react"

export function ScrollProgress() {
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll()
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 24,
    mass: 0.35,
  })

  if (reduceMotion) return null

  return (
    <div
      aria-hidden
      className="fixed top-1/2 right-3 z-40 hidden h-28 w-px -translate-y-1/2 overflow-hidden bg-white/10 lg:block"
    >
      <motion.div
        className="h-full w-full origin-top bg-[#D4AF37]"
        style={{ scaleY }}
      />
    </div>
  )
}
