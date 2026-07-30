"use client"

import {
  ArrowDownRight,
  CalendarDays,
  Clock3,
  Globe2,
  UsersRound,
} from "lucide-react"
import { useTranslations } from "next-intl"
import { useEffect, useRef, useState } from "react"

const icons = [CalendarDays, Globe2, UsersRound, Clock3]

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

    // Final values are the SSR and reduced-motion baseline.
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
      className="relative isolate overflow-hidden border-b border-primary-100 bg-white px-5 py-24 text-primary-900 md:px-8 lg:px-12 lg:py-32 xl:px-16 xl:py-40"
    >
      <div
        aria-hidden
        className="brand-grid pointer-events-none absolute inset-0 opacity-30"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-52 top-1/2 size-[38rem] -translate-y-1/2 rounded-full border border-accent/10 shadow-[0_0_160px_rgba(212,175,55,0.07)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -right-20 top-1/2 size-[24rem] -translate-y-1/2 rounded-full border border-primary-400/10"
      />

      <div className="relative mx-auto max-w-[1840px]">
        <div className="grid items-stretch gap-16 lg:grid-cols-12 lg:gap-10 xl:gap-20">
          <div className="flex flex-col gap-10 lg:col-span-5 lg:pr-4 xl:pr-10">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-accent" aria-hidden />
              <p className="font-mono text-[11px] font-bold tracking-[0.18em] text-accent sm:text-xs">
                {t("overline")}
              </p>
            </div>

            <h2
              id="about-title"
              className="mt-7 text-[clamp(2.7rem,4.7vw,5.6rem)] leading-[0.94] font-black text-primary-900"
            >
              {t("heading")}
            </h2>

            <div className="mt-10 max-w-[62ch] space-y-6 border-l border-accent/35 pl-5 text-sm leading-[1.85] text-primary-600 sm:pl-7 sm:text-base">
              <p>{t("paragraph1")}</p>
              <p>{t("paragraph2")}</p>
            </div>

            <a
              href="#program"
              className="group mt-0 inline-flex min-h-14 w-fit items-center gap-8 border border-accent bg-accent px-6 text-sm font-extrabold text-primary-900 transition-[background-color,color,transform] duration-300 hover:bg-accent-300 active:translate-y-px active:bg-accent-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-4 focus-visible:ring-offset-white sm:px-7 lg:mt-auto"
            >
              {t("programLink")}
              <ArrowDownRight
                aria-hidden
                className="size-5 transition-transform duration-300 group-hover:translate-x-1 group-hover:translate-y-1"
                strokeWidth={1.8}
              />
            </a>
          </div>

          <div className="flex flex-col lg:col-span-7 lg:pt-9">
            <div className="mb-5 flex items-end justify-between gap-5">
              <p className="max-w-64 text-xs leading-relaxed font-semibold tracking-[0.09em] text-primary-500 uppercase">
                {t("metricsLabel")}
              </p>
            </div>

            <div
              ref={metricPanelRef}
              className="relative flex-1 border border-accent/35 bg-primary-50"
            >
              <div
                aria-hidden
                className="absolute left-0 top-0 h-px w-24 bg-accent"
              />
              <div className="grid h-full sm:grid-cols-2">
                {metrics.map((metric, index) => {
                  const Icon = icons[index]

                  return (
                    <article
                      key={metric.code}
                      className={[
                        "group relative z-0 flex min-h-36 flex-col justify-between p-5 transition-[transform,background-color,box-shadow] duration-300 ease-out hover:z-10 hover:-translate-y-1 hover:bg-white hover:shadow-[inset_0_0_0_1px_rgba(224,168,46,0.55),0_12px_30px_rgba(11,29,51,0.1)] sm:min-h-44 sm:p-6 xl:min-h-48 xl:p-7",
                        index < metrics.length - 1
                          ? "border-b border-primary-100"
                          : "",
                        index % 2 === 0
                          ? "sm:border-r sm:border-primary-100"
                          : "",
                        index === 2 ? "sm:border-b-0" : "",
                      ].join(" ")}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-[10px] tracking-[0.2em] text-primary-500 transition-colors group-hover:text-primary-700">
                          {metric.code}
                        </span>
                        {Icon ? (
                          <Icon
                            aria-hidden
                            className="size-6 text-accent/90 transition-colors duration-300 group-hover:text-accent sm:size-7"
                            strokeWidth={1.6}
                          />
                        ) : null}
                      </div>

                      <div className="mt-5">
                        <p
                          aria-label={renderMetric(metric, 1)}
                          className="font-mono text-[clamp(1.8rem,3vw,3.4rem)] leading-none font-semibold tracking-[-0.075em] text-accent tabular-nums"
                        >
                          <span aria-hidden>
                            {renderMetric(metric, countProgress)}
                          </span>
                        </p>
                        <p className="mt-3 max-w-[22rem] text-base leading-[1.4] font-semibold text-primary-900 xl:text-lg">
                          {metric.label}
                        </p>
                      </div>
                      <span
                        aria-hidden
                        className="absolute right-0 bottom-0 size-1.5 bg-accent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                      />
                    </article>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
