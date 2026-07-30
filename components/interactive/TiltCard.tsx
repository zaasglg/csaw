"use client"

import {
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"
import { type PointerEvent, type ReactNode, useRef } from "react"

type TiltCardProps = {
  children: ReactNode
  className?: string
}

export function TiltCard({ children, className = "" }: TiltCardProps) {
  const reduceMotion = useReducedMotion()
  const card = useRef<HTMLDivElement>(null)
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springConfig = { stiffness: 180, damping: 22, mass: 0.45 }
  const rotateX = useSpring(useTransform(pointerY, [-0.5, 0.5], [7, -7]), springConfig)
  const rotateY = useSpring(useTransform(pointerX, [-0.5, 0.5], [-7, 7]), springConfig)

  function updatePointer(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion || !card.current) return
    const bounds = card.current.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width
    const y = (event.clientY - bounds.top) / bounds.height
    pointerX.set(x - 0.5)
    pointerY.set(y - 0.5)
    card.current.style.setProperty("--pointer-x", `${x * 100}%`)
    card.current.style.setProperty("--pointer-y", `${y * 100}%`)
  }

  function resetPointer() {
    pointerX.set(0)
    pointerY.set(0)
  }

  return (
    <div className="[perspective:1000px]">
      <motion.div
        ref={card}
        onPointerMove={updatePointer}
        onPointerLeave={resetPointer}
        style={reduceMotion ? undefined : { rotateX, rotateY, transformStyle: "preserve-3d" }}
        className={`group/tilt relative overflow-hidden rounded-[1.25rem] border border-white/12 bg-white/[0.045] ${className}`}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover/tilt:opacity-100"
          style={{
            background:
              "radial-gradient(480px circle at var(--pointer-x, 50%) var(--pointer-y, 50%), rgba(212, 175, 55, 0.16), transparent 42%)",
          }}
        />
        <div className="relative" style={{ transform: "translateZ(22px)" }}>
          {children}
        </div>
      </motion.div>
    </div>
  )
}
