"use client"

import { Globe, Mail, MapPin } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { useTranslations } from "next-intl"

const ease = [0.16, 1, 0.3, 1] as const

type ContactItem =
  | {
      key: "email" | "website"
      icon: typeof Mail
      href: string
      value: string
    }
  | {
      key: "location"
      icon: typeof MapPin
      href: null
      valueKey: "locationValue"
    }

const items: ContactItem[] = [
  {
    key: "email",
    icon: Mail,
    href: "mailto:info@csaw2026aktau.kz",
    value: "info@csaw2026aktau.kz",
  },
  {
    key: "website",
    icon: Globe,
    href: "http://csaw2026aktau.kz/",
    value: "csaw2026aktau.kz",
  },
  {
    key: "location",
    icon: MapPin,
    href: null,
    valueKey: "locationValue",
  },
]

export function Contacts() {
  const t = useTranslations("contacts")
  const reduceMotion = useReducedMotion()

  return (
    <section
      id="contacts"
      aria-labelledby="contacts-title"
      className="mesh-surface-tint relative overflow-hidden border-t border-accent/25 px-5 py-24 lg:px-10 lg:py-32"
    >
      <div className="brand-grid pointer-events-none absolute inset-0 opacity-25" />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/2 size-[28rem] -translate-y-1/2 rounded-full border border-accent/10"
      />

      <div className="relative mx-auto max-w-[1480px]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, ease }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-4">
            <span className="h-px w-10 bg-accent" aria-hidden />
            <p className="font-mono text-[11px] font-bold tracking-[0.18em] text-accent sm:text-xs">
              {t("kicker")}
            </p>
          </div>
          <h2
            id="contacts-title"
            className="mt-6 max-w-[14ch] text-[clamp(2.6rem,5vw,5rem)] leading-[0.94] font-black text-primary-900"
          >
            {t("heading")}
          </h2>
          <p className="mt-6 max-w-[46ch] border-l border-accent/40 pl-5 text-sm leading-relaxed text-primary-600 sm:pl-7 sm:text-base">
            {t("description")}
          </p>
        </motion.div>

        <div className="mt-14 grid gap-px border border-accent/30 bg-accent/30 sm:grid-cols-3">
          {items.map((item, index) => {
            const Icon = item.icon
            const label = t(`${item.key}Label`)
            const value =
              item.key === "location" ? t(item.valueKey) : item.value

            const content = (
              <>
                <div className="flex items-center justify-between gap-3">
                  <span className="font-mono text-[10px] tracking-[0.2em] text-primary-400">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <Icon
                    aria-hidden
                    className="size-5 text-accent"
                    strokeWidth={1.6}
                  />
                </div>
                <div className="mt-10">
                  <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary-500">
                    {label}
                  </p>
                  <p className="mt-3 text-lg leading-snug font-semibold text-primary-900 sm:text-xl">
                    {value}
                  </p>
                </div>
              </>
            )

            const className =
              "group flex min-h-44 flex-col justify-between bg-primary-50 p-6 transition-colors duration-300 hover:bg-white sm:p-8"

            if (item.href) {
              return (
                <motion.a
                  key={item.key}
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={
                    item.href.startsWith("http")
                      ? "noopener noreferrer"
                      : undefined
                  }
                  initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ duration: 0.7, ease, delay: 0.08 * index }}
                  className={`${className} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2`}
                >
                  {content}
                </motion.a>
              )
            }

            return (
              <motion.div
                key={item.key}
                initial={reduceMotion ? false : { opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.35 }}
                transition={{ duration: 0.7, ease, delay: 0.08 * index }}
                className={className}
              >
                {content}
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
