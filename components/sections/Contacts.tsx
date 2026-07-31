"use client"

import { Mail, MapPin } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { useTranslations } from "next-intl"

const ease = [0.16, 1, 0.3, 1] as const

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <rect x="3" y="3" width="18" height="18" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
    </svg>
  )
}

export function Contacts() {
  const t = useTranslations("contacts")
  const reduceMotion = useReducedMotion()
  const socialItems = t.raw("socialItems") as {
    label: string
    value: string
    href: string
  }[]
  const organizerItems = t.raw("organizerItems") as string[]

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
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease }}
          className="text-center"
        >
          <h2 id="contacts-title" className="section-title">
            {t("heading")}
          </h2>
        </motion.div>

        <div className="mt-14 grid gap-8 lg:grid-cols-2">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease }}
            className="border border-accent/35 bg-white p-8 shadow-[0_30px_100px_rgba(11,29,51,0.12)] sm:p-10"
          >
            <h3 className="section-subtitle">{t("infoCardTitle")}</h3>

            <div className="mt-8 space-y-8">
              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center border border-accent/40 bg-primary-50 text-accent-700">
                  <Mail className="size-5" strokeWidth={1.8} aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-primary-900">
                    {t("emailLabel")}
                  </p>
                  <a
                    href={`mailto:${t("emailValue")}`}
                    className="mt-1 block text-primary-600 transition-colors hover:text-accent-700"
                  >
                    {t("emailValue")}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center border border-accent/40 bg-primary-50 text-accent-700">
                  <InstagramIcon className="size-5" />
                </span>
                <div>
                  <p className="font-semibold text-primary-900">
                    {t("socialLabel")}
                  </p>
                  <div className="mt-1 space-y-1 text-primary-600">
                    {socialItems.map((item) => (
                      <a
                        key={item.href}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block transition-colors hover:text-accent-700"
                      >
                        {item.label}: {item.value}
                      </a>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <span className="grid size-12 shrink-0 place-items-center border border-accent/40 bg-primary-50 text-accent-700">
                  <MapPin className="size-5" strokeWidth={1.8} aria-hidden />
                </span>
                <div>
                  <p className="font-semibold text-primary-900">
                    {t("locationLabel")}
                  </p>
                  <p className="mt-1 text-primary-600">{t("locationValue")}</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.7, ease, delay: 0.1 }}
            className="border border-accent/35 bg-white p-8 shadow-[0_30px_100px_rgba(11,29,51,0.12)] sm:p-10"
          >
            <h3 className="section-subtitle">{t("organizersCardTitle")}</h3>

            <div className="mt-8">
              <p className="font-semibold text-primary-900">
                {t("organizerLabel")}
              </p>
              <ul className="mt-4 space-y-3 border-l border-accent/40 pl-5 text-primary-700">
                {organizerItems.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
