"use client"

import Image from "next/image"
import { MapPin, Target, UsersRound } from "lucide-react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"
import { useTranslations } from "next-intl"
import { useRef } from "react"

const ease = [0.16, 1, 0.3, 1] as const
const todayIcons = [MapPin, Target, UsersRound] as const

export function Mangystau() {
  const section = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const t = useTranslations("mangystau")
  const todayCards = t.raw("todayCards") as {
    title: string
    description: string
  }[]
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  })
  const regionImageY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"])
  const cityImageY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"])

  return (
    <section
      ref={section}
      id="mangystau"
      aria-labelledby="mangystau-title"
      className="mesh-surface-white relative isolate overflow-hidden border-y border-accent/25 px-5 py-20 text-primary-900 md:px-8 lg:px-12 lg:py-28 xl:px-16"
    >
      <div
        aria-hidden
        className="brand-grid pointer-events-none absolute inset-0 opacity-30"
      />

      <div className="relative mx-auto max-w-[1480px]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{ duration: 0.8, ease }}
          className="max-w-4xl"
        >
          <h2 id="mangystau-title" className="max-w-3xl section-title">
            {t("heading")}
          </h2>
          <p className="mt-5 max-w-2xl border-l border-accent/35 pl-5 text-base leading-[1.75] text-primary-700 sm:pl-6 sm:text-lg">
            {t("subheading")}
          </p>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.9, ease, delay: 0.1 }}
          className="mt-16 grid min-w-0 gap-10 lg:mt-20 lg:grid-cols-[minmax(0,0.92fr)_minmax(0,1.08fr)] lg:items-center lg:gap-16"
        >
          <div className="min-w-0">
            <h3 className="section-subtitle">
              {t("regionTitle")}
            </h3>
            <div className="mt-6 max-w-[58ch] space-y-5 border-l border-accent/35 pl-5 text-base leading-[1.75] text-primary-700 sm:pl-6 sm:text-lg">
              <p>{t("regionParagraph1")}</p>
              <p>{t("regionParagraph2")}</p>
              <p>{t("regionParagraph3")}</p>
            </div>
          </div>

          <figure className="relative h-80 min-w-0 overflow-hidden border border-accent/35 bg-primary-50 p-2 shadow-[0_24px_70px_rgba(11,29,51,0.14)] sm:h-[26rem] lg:h-[30rem]">
            <motion.div
              className="absolute -inset-y-3 inset-x-2 overflow-hidden"
              style={reduceMotion ? undefined : { y: regionImageY }}
            >
              <Image
                src="/images/bozzhyra-mangystau.png"
                alt="Bozzhyra canyon in Mangystau"
                fill
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover object-center"
                priority={false}
              />
            </motion.div>
            <div className="pointer-events-none absolute inset-2 bg-gradient-to-t from-primary-900/15 via-transparent to-transparent" />
          </figure>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{ duration: 0.9, ease, delay: 0.08 }}
          className="mt-16 grid min-w-0 gap-10 lg:mt-24 lg:grid-cols-[minmax(0,1.08fr)_minmax(0,0.92fr)] lg:items-center lg:gap-16"
        >
          <figure className="relative h-80 min-w-0 overflow-hidden border border-accent/35 bg-primary-50 p-2 shadow-[0_24px_70px_rgba(11,29,51,0.14)] sm:h-[26rem] lg:h-[30rem]">
            <motion.div
              className="absolute -inset-y-3 inset-x-2 overflow-hidden"
              style={reduceMotion ? undefined : { y: cityImageY }}
            >
              <Image
                src="/images/aktau-city-coast.png"
                alt="Aktau city on the Caspian coast"
                fill
                sizes="(min-width: 1024px) 48vw, 100vw"
                className="object-cover object-center"
              />
            </motion.div>
            <div className="pointer-events-none absolute inset-2 bg-gradient-to-t from-primary-900/20 via-transparent to-transparent" />
          </figure>

          <div className="min-w-0">
            <h3 className="section-subtitle">
              {t("cityTitle")}
            </h3>
            <div className="mt-6 max-w-[58ch] space-y-5 border-l border-accent/35 pl-5 text-base leading-[1.75] text-primary-700 sm:pl-6 sm:text-lg">
              <p>{t("cityParagraph1")}</p>
              <p>{t("cityParagraph2")}</p>
              <p>{t("cityParagraph3")}</p>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 36 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.85, ease, delay: 0.08 }}
          className="mt-16 overflow-hidden rounded-sm border border-accent/35 bg-white px-5 py-12 shadow-[0_30px_100px_rgba(11,29,51,0.12)] sm:px-8 sm:py-14 lg:mt-24 lg:px-14 lg:py-16"
        >
          <div className="mx-auto max-w-5xl text-center">
            <h3 className="section-title">
              {t("todayTitle")}
            </h3>
            <p className="mx-auto mt-6 max-w-[70ch] text-base leading-[1.75] text-primary-700 sm:text-lg">
              {t("todayDescription")}
            </p>
          </div>

          <div className="mt-12 grid gap-5 lg:grid-cols-3">
            {todayCards.map((card, index) => {
              const Icon = todayIcons[index] ?? Target

              return (
                <article
                  key={card.title}
                  className="group relative flex min-h-64 flex-col items-center justify-center rounded-sm border border-accent/35 bg-primary-50 px-6 py-8 text-center transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-1 hover:bg-white hover:shadow-[inset_0_0_0_1px_rgba(212,175,55,0.35),0_18px_45px_rgba(11,29,51,0.1)] sm:px-8"
                >
                  <span className="grid size-16 place-items-center rounded-sm border border-accent/45 bg-white text-accent-700 transition-colors duration-300 group-hover:bg-accent group-hover:text-primary-900">
                    <Icon className="size-7" strokeWidth={1.8} aria-hidden />
                  </span>
                  <h4 className="mt-7 text-2xl font-extrabold leading-tight tracking-[-0.03em] text-primary-900">
                    {card.title}
                  </h4>
                  <p className="mt-5 max-w-[30ch] text-base leading-[1.6] text-primary-700 sm:text-lg">
                    {card.description}
                  </p>
                </article>
              )
            })}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
