"use client"

import { motion, useReducedMotion } from "motion/react"
import { useTranslations } from "next-intl"
import Image from "next/image"

const ease = [0.16, 1, 0.3, 1] as const

const speakerSlots = [
  { id: 1, avatar: "https://i.pravatar.cc/400?img=12" },
  { id: 2, avatar: "https://i.pravatar.cc/400?img=33" },
  { id: 3, avatar: "https://i.pravatar.cc/400?img=45" },
  { id: 4, avatar: "https://i.pravatar.cc/400?img=5" },
  { id: 5, avatar: "https://i.pravatar.cc/400?img=68" },
  { id: 6, avatar: "https://i.pravatar.cc/400?img=21" },
]

export function Speakers() {
  const reduceMotion = useReducedMotion()
  const t = useTranslations("speakers")

  return (
    <section
      id="speakers"
      aria-labelledby="speakers-title"
      className="relative overflow-hidden border-y border-accent/25 bg-primary-900 px-5 py-24 lg:px-10 lg:py-36"
    >
      <div className="brand-grid pointer-events-none absolute inset-0 opacity-35" />

      <div className="relative mx-auto max-w-[1480px]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.8, ease }}
          className="grid gap-8 border-b border-accent/25 pb-12 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-8">
            <div className="flex items-center gap-4">
              <span className="h-px w-10 bg-accent" aria-hidden />
              <p className="font-mono text-[11px] font-bold tracking-[0.18em] text-accent sm:text-xs">
                {t("overline")}
              </p>
            </div>
            <h2 className="mt-6 text-[clamp(2.6rem,6vw,5.4rem)] leading-[0.94] font-black tracking-[-0.045em] text-primary-50">
              {t("headingPrefix")} <span className="text-accent">{t("headingAccent")}</span>
            </h2>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3"
        >
          {speakerSlots.map((slot) => (
            <motion.div
              key={slot.id}
              variants={{
                hidden: { opacity: 0, y: 24 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.6, ease }}
              className="group relative overflow-hidden border border-accent/20 bg-primary-800/40 transition-colors duration-300 hover:border-accent/50"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-primary-900/60">
                <Image
                  src={slot.avatar}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover grayscale transition-[filter] duration-300 group-hover:grayscale-0"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-900/85 via-primary-900/10 to-transparent"
                />
                <span className="absolute left-3 top-3 rounded-sm border border-accent/40 bg-primary-900/80 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-accent-300">
                  {t("comingSoon")}
                </span>
              </div>
              <div className="p-4">
                <p className="text-[15px] font-bold tracking-[-0.01em] text-primary-50">
                  {t("namePlaceholder")}
                </p>
                <p className="mt-1 text-[13px] leading-[1.4] text-primary-300">
                  {t("rolePlaceholder")}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
