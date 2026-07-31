"use client"

import { CalendarDays, Clock3, UsersRound } from "lucide-react"
import { motion } from "motion/react"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"

const icons = [CalendarDays, undefined, UsersRound, Clock3]

interface MetricMessage {
  code: string
  label: string
  template: string
  from: number
  to?: number
}

function renderMetric(metric: MetricMessage, progress: number) {
  if (metric.to !== undefined) {
    return metric.template
      .replace("{a}", String(Math.round(metric.from * progress)))
      .replace("{b}", String(Math.round(metric.to * progress)))
  }
  return metric.template.replace("{n}", String(Math.round(metric.from * progress)))
}

export function About() {
  const t = useTranslations("about")
  const metrics = t.raw("metrics") as MetricMessage[]
  const metricPanelRef = useRef<HTMLDivElement>(null)
  const [countProgress, setCountProgress] = useState(1)

  useEffect(() => {
    const panel = metricPanelRef.current
    if (!panel) return

    const motionPreference = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    )

    if (motionPreference.matches) return

    let started = false
    let disposed = false
    let animationFrame = 0
    let preparationFrame = 0
    let fallbackTimer = 0
    let observer: IntersectionObserver | undefined

    const stopWatching = () => {
      observer?.disconnect()
      window.removeEventListener("scroll", checkPosition)
      window.removeEventListener("resize", checkPosition)
      if (fallbackTimer) window.clearInterval(fallbackTimer)
    }

    const runCountUp = () => {
      if (started || disposed) return
      started = true
      stopWatching()

      const startedAt = window.performance.now()
      const duration = 1450

      const tick = (now: number) => {
        if (disposed) return

        const linearProgress = Math.min((now - startedAt) / duration, 1)
        const easedProgress = 1 - Math.pow(1 - linearProgress, 3)
        setCountProgress(easedProgress)

        if (linearProgress < 1) {
          animationFrame = window.requestAnimationFrame(tick)
        }
      }

      animationFrame = window.requestAnimationFrame(tick)
    }

    const checkPosition = () => {
      if (started || disposed) return

      const rect = panel.getBoundingClientRect()
      const triggerLine = window.innerHeight * 0.92

      if (rect.top <= triggerLine && rect.bottom >= 0) runCountUp()
    }

    if ("IntersectionObserver" in window) {
      observer = new IntersectionObserver(
        ([entry]) => {
          if (entry?.isIntersecting) runCountUp()
        },
        { threshold: 0.01 },
      )
      observer.observe(panel)
    }

    window.addEventListener("scroll", checkPosition, { passive: true })
    window.addEventListener("resize", checkPosition)
    fallbackTimer = window.setInterval(checkPosition, 100)
    preparationFrame = window.requestAnimationFrame(() => {
      if (disposed) return
      setCountProgress(0)
      checkPosition()
    })

    return () => {
      disposed = true
      stopWatching()
      window.cancelAnimationFrame(preparationFrame)
      window.cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <section
      id="about"
      aria-labelledby="about-title"
      className="mesh-surface-white relative isolate overflow-hidden border-b border-primary-100 px-5 py-16 text-primary-900 md:px-8 lg:px-12 lg:py-20 xl:px-16 bg-transparent"
    >
      <div
        aria-hidden
        className="brand-grid pointer-events-none absolute inset-0 opacity-30"
      />

      <div className="relative mx-auto max-w-[1480px]">
        <div>
          <motion.h2
            id="about-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mt-0 max-w-2xl text-balance section-title"
          >
            {t("heading")}
          </motion.h2>

          <div className="mt-6 space-y-5 border-l border-accent/35 pl-5 text-base leading-[1.75] text-primary-800 sm:pl-6 sm:text-lg">
            <p>{t("paragraph1")}</p>
            <p>{t("paragraph2")}</p>
          </div>

          <a
            href="#program"
            className="group mt-6 inline-flex min-h-12 w-fit items-center gap-5 border border-primary-900 bg-primary-900 px-6 text-base font-extrabold text-white transition-[background-color,color,transform] duration-300 hover:bg-primary-800 active:translate-y-px active:bg-primary-950 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-white sm:min-h-13 sm:px-7 sm:text-lg"
          >
            {t("programLink")}
          </a>
        </div>

        <div className="mt-10">
          <p className="mb-4 text-[11px] leading-relaxed font-semibold tracking-[0.09em] text-primary-500 uppercase">
            {t("metricsLabel")}
          </p>

          <div
            ref={metricPanelRef}
            className="relative border border-accent/35 bg-primary-50"
          >
            <div
              aria-hidden
              className="absolute left-0 top-0 h-px w-16 bg-accent"
            />
            <div className="grid sm:grid-cols-2 lg:grid-cols-4">
              {metrics.map((metric, index) => {
                const Icon = icons[index]

                return (
                  <article
                    key={metric.code}
                    className={[
                      "group relative z-0 flex min-h-28 flex-col justify-between p-4 transition-[transform,background-color,box-shadow] duration-300 ease-out hover:z-10 hover:-translate-y-0.5 hover:bg-white hover:shadow-[inset_0_0_0_1px_rgba(224,168,46,0.55),0_10px_24px_rgba(11,29,51,0.08)] sm:min-h-32 sm:p-5",
                      index < metrics.length - 1
                        ? "border-b border-primary-100 sm:border-b-0"
                        : "",
                      index < 2 ? "sm:border-b sm:border-primary-100 lg:border-b-0" : "",
                      index % 2 === 0
                        ? "sm:border-r sm:border-primary-100"
                        : "",
                      index < metrics.length - 1
                        ? "lg:border-r lg:border-primary-100"
                        : "",
                      index === 1 ? "sm:border-r-0 lg:border-r" : "",
                    ].join(" ")}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-[10px] tracking-[0.2em] text-primary-500 transition-colors group-hover:text-primary-700">
                        {metric.code}
                      </span>
                      {Icon ? (
                        <Icon
                          aria-hidden
                          className="size-5 text-accent/90 transition-colors duration-300 group-hover:text-accent"
                          strokeWidth={1.6}
                        />
                      ) : null}
                    </div>

                    <div className="mt-4">
                      <p
                        aria-label={renderMetric(metric, 1)}
                        className="font-mono text-[clamp(1.35rem,2vw,1.85rem)] leading-none font-semibold tracking-[-0.06em] text-accent tabular-nums"
                      >
                        <span aria-hidden>
                          {renderMetric(metric, countProgress)}
                        </span>
                      </p>
                      <p className="mt-2.5 text-sm leading-[1.35] font-semibold text-primary-900">
                        {metric.label}
                      </p>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
