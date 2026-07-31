"use client"

import { MapPin } from "lucide-react"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useTranslations } from "next-intl"
import { useState } from "react"

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
  const reduceMotion = useReducedMotion()
  const t = useTranslations("program")
  const days = t.raw("days") as ProgramDay[]
  const [activeIndex, setActiveIndex] = useState(0)
  const active = days[activeIndex]

  return (
    <section
      id="program"
      aria-labelledby="program-title"
      className="mesh-surface-white relative overflow-hidden border-y border-accent/25 px-5 py-24 lg:px-10 lg:py-36"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_8%,rgba(212,175,55,0.1),transparent_38%)]"
      />
      <div className="brand-grid pointer-events-none absolute inset-0 opacity-25" />

      <div className="relative mx-auto max-w-[1480px]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.75, ease }}
          className="max-w-2xl"
        >
          <h2 id="program-title" className="section-title">
            {t("heading")}
          </h2>
        </motion.div>

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
                    : "border-accent/20 bg-primary-50 text-primary-500 hover:border-[#E0A82E]/50 hover:text-primary-900"
                }`}
              >
                <span className="font-mono text-lg font-bold tabular-nums sm:text-xl">
                  {day.date}
                </span>
                <span
                  className={`text-[10px] font-semibold uppercase tracking-[0.06em] ${
                    selected ? "text-primary-900/70" : "text-primary-500"
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
                className="py-6"
              >
                <p className="text-[16px] font-bold leading-[1.35] tracking-[-0.01em] text-primary-900 sm:text-lg">
                  {item.title}
                </p>
                {item.details ? (
                  <p className="mt-2 max-w-3xl text-sm leading-[1.6] text-primary-600">
                    {item.details}
                  </p>
                ) : null}
                {item.location ? (
                  <p className="mt-2 flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.06em] text-primary-500">
                    <MapPin className="size-3.5 shrink-0 text-accent-700" />
                    {item.location}
                  </p>
                ) : null}
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  )
}
