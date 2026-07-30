"use client"

import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react"
import { type PointerEvent, type ReactNode, useRef } from "react"

export function Magnetic({
  children,
  strength = 0.22,
  className = "",
}: {
  children: ReactNode
  strength?: number
  className?: string
}) {
  const root = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const x = useSpring(useMotionValue(0), { stiffness: 190, damping: 18, mass: 0.35 })
  const y = useSpring(useMotionValue(0), { stiffness: 190, damping: 18, mass: 0.35 })

  function move(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || !root.current) return
    const bounds = root.current.getBoundingClientRect()
    x.set((event.clientX - bounds.left - bounds.width / 2) * strength)
    y.set((event.clientY - bounds.top - bounds.height / 2) * strength)
  }

  function reset() {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      ref={root}
      onPointerMove={move}
      onPointerLeave={reset}
      className={`inline-flex p-3 -m-3 ${className}`}
    >
      <motion.div style={reduceMotion ? undefined : { x, y }}>{children}</motion.div>
    </div>
  )
}
