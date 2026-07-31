"use client"

import Lenis from "@studio-freight/lenis"
import { useReducedMotion } from "motion/react"
import { useEffect, type ReactNode } from "react"

type ReactLenisProps = {
  children: ReactNode
}

function shouldStartAtTop() {
  if (typeof window === "undefined") return true
  const hash = window.location.hash
  // Keep deep-links; otherwise always open on the first section.
  return !hash || hash === "#" || hash === "#home"
}

export function ReactLenis({ children }: ReactLenisProps) {
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual"
    }

    if (shouldStartAtTop()) {
      window.scrollTo(0, 0)
    }
  }, [])

  useEffect(() => {
    if (reduceMotion) {
      if (shouldStartAtTop()) window.scrollTo(0, 0)
      return
    }

    const lenis = new Lenis({
      duration: 1.15,
      smoothWheel: true,
      touchMultiplier: 1.05,
      easing: (time) => Math.min(1, 1.001 - 2 ** (-10 * time)),
    })
    let frame = 0

    const handleScrollTo = (event: Event) => {
      const { target } = (
        event as CustomEvent<{ target?: string }>
      ).detail ?? { target: undefined }
      if (!target) return

      lenis.scrollTo(target, {
        offset: -136,
        duration: 1.35,
        easing: (time) => Math.min(1, 1.001 - 2 ** (-10 * time)),
      })
    }

    window.addEventListener("csaw:scroll-to", handleScrollTo)

    if (shouldStartAtTop()) {
      lenis.scrollTo(0, { immediate: true })
    }

    const raf = (time: number) => {
      lenis.raf(time)
      frame = requestAnimationFrame(raf)
    }

    frame = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener("csaw:scroll-to", handleScrollTo)
      lenis.destroy()
    }
  }, [reduceMotion])

  return <>{children}</>
}

export function SmoothScroll({ children }: ReactLenisProps) {
  return <ReactLenis>{children}</ReactLenis>
}
