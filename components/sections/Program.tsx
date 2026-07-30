"use client"

import dynamic from "next/dynamic"
import { Clock3, MapPin } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"
import { useTranslations } from "next-intl"
import { useRef, useState } from "react"

const ProgramGlobe = dynamic(() => import("@/components/canvas/ProgramGlobe"), {
  ssr: false,
  loading: () => (
    <div className="relative size-full">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 aspect-square w-[72%] -translate-x-1/2 -translate-y-1/2 bg-[url('/images/earth-spherical-fallback.webp')] bg-contain bg-center bg-no-repeat drop-shadow-[0_0_34px_rgba(212,175,55,0.22)]"
      />
    </div>
  ),
})

const ease = [0.16, 1, 0.3, 1] as const

interface ScheduleItem {
  time: string
  title: string
  details?: string
  location?: string
}

interface ProgramDay {
  date: string
  weekday: string
  items: ScheduleItem[]
}

export function Program() {
  const sectionRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const t = useTranslations("program")
  const days = t.raw("days") as ProgramDay[]
  const [activeIndex, setActiveIndex] = useState(0)
  const active = days[activeIndex]

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  })
  const globeY = useTransform(scrollYProgress, [0, 1], [70, -70])
  const globeRotate = useTransform(scrollYProgress, [0, 1], [-10, 10])
  const globeScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.92, 1, 0.92])

  return (
    <section
      ref={sectionRef}
      id="program"
      className="relative overflow-hidden border-y border-accent/25 bg-primary-900 px-5 py-24 lg:px-10 lg:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_8%,rgba(212,175,55,0.12),transparent_38%)]"
      />
      <div className="brand-grid pointer-events-none absolute inset-0 opacity-35" />

      <div className="relative mx-auto max-w-[1480px]">
        <div className="grid gap-12 lg:grid-cols-12 lg:items-center lg:gap-10">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.75, ease }}
            className="lg:col-span-7"
          >
            <p className="max-w-lg border-l border-accent/40 pl-4 text-2xl leading-relaxed text-[#E2E8F0]">
              {t("description")}
            </p>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, scale: 0.92 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.9, ease }}
            className="relative hidden h-64 sm:block lg:col-span-5 lg:h-80"
          >
            <motion.div
              style={
                reduceMotion
                  ? undefined
                  : { y: globeY, rotate: globeRotate, scale: globeScale }
              }
              className="size-full"
            >
              <ProgramGlobe activeIndex={activeIndex} reduceMotion={Boolean(reduceMotion)} />
            </motion.div>
          </motion.div>
        </div>

        <div
          role="tablist"
          aria-label={t("tabsAriaLabel")}
          className="mt-14 grid grid-cols-4 gap-2 sm:grid-cols-7 sm:gap-3"
        >
          {days.map((day, index) => {
            const selected = activeIndex === index

            return (
              <button
                key={day.date}
                type="button"
                role="tab"
                aria-selected={selected}
                aria-controls="program-panel"
                onClick={() => setActiveIndex(index)}
                className={`group relative flex flex-col items-center gap-1 border px-2 py-3 transition-colors duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E0A82E] ${
                  selected
                    ? "border-[#E0A82E] bg-[#E0A82E] text-primary-900"
                    : "border-accent/20 bg-primary-800/30 text-primary-300 hover:border-[#E0A82E]/50 hover:text-primary-50"
                }`}
              >
                <span className="font-mono text-lg font-bold tabular-nums sm:text-xl">
                  {day.date}
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-[0.06em] ${
                    selected ? "text-primary-900/70" : "text-primary-400"
                  }`}
                >
                  {day.weekday}
                </span>
              </button>
            )
          })}
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active.date}
            id="program-panel"
            role="tabpanel"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -12 }}
            transition={{ duration: 0.4, ease }}
            className="mt-8 divide-y divide-accent/15 border-t border-accent/15"
          >
            {active.items.map((item) => (
              <div
                key={`${active.date}-${item.time}-${item.title}`}
                className="grid gap-2 py-6 sm:grid-cols-[9rem_1fr] sm:gap-8"
              >
                <div className="flex items-center gap-2 font-mono text-sm font-semibold text-accent tabular-nums sm:text-base">
                  <Clock3 className="size-4 shrink-0 text-accent-300" />
                  {item.time === "allDay" ? t("allDay") : item.time}
                </div>
                <div>
                  <p className="text-[16px] font-bold leading-[1.35] tracking-[-0.01em] text-primary-50 sm:text-lg">
                    {item.title}
                  </p>
                  {item.details ? (
                    <p className="mt-2 max-w-3xl text-sm leading-[1.6] text-primary-300">
                      {item.details}
                    </p>
                  ) : null}
                  {item.location ? (
                    <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-primary-400">
                      <MapPin className="size-3.5 shrink-0 text-accent-300" />
                      {item.location}
                    </p>
                  ) : null}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
