"use client"

import Image from "next/image"
import { Mountain, Waves } from "lucide-react"
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"
import { useTranslations } from "next-intl"
import { useRef } from "react"

const ease = [0.16, 1, 0.3, 1] as const

export function Mangystau() {
  const section = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const t = useTranslations("mangystau")
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  })
  const imageY = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"])
  const coastY = useTransform(scrollYProgress, [0, 1], ["4%", "-4%"])

  return (
    <section
      ref={section}
      id="mangystau"
      className="relative overflow-hidden border-y border-accent/20 bg-primary-900 px-5 py-24 lg:px-10 lg:py-36"
    >
      <div className="brand-grid pointer-events-none absolute inset-0 opacity-35" />
      <div className="relative mx-auto max-w-[1480px]">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end lg:gap-12">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.85, ease }}
            className="lg:col-span-8"
          >
            <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-accent-300">
              {t("kicker")}
            </p>
            <h2 className="mt-5 max-w-[12ch] text-[clamp(2.8rem,6.5vw,6.4rem)] leading-[0.9] font-black tracking-[-0.065em] text-primary-50">
              {t("headingPrefix")} <span className="text-accent">{t("headingAccent")}</span>
            </h2>
          </motion.div>

          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.8, ease, delay: 0.08 }}
            className="max-w-[34ch] border-l border-accent/40 pl-5 text-[15px] leading-[1.55] text-primary-200 lg:col-span-4 lg:justify-self-end lg:pb-2 lg:text-base"
          >
            {t("tagline")}
          </motion.p>
        </div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.85, ease, delay: 0.1 }}
          className="mt-10 lg:mt-12"
        >
          <p className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-accent-300">
            {t("infoKicker")}
          </p>
          <div className="mt-5 max-w-[68ch] space-y-6 border-l border-accent/35 pl-5 text-sm leading-[1.85] text-primary-200 sm:pl-7 sm:text-base">
            <p>{t("infoParagraph1")}</p>
            <p>{t("infoParagraph2")}</p>
          </div>
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 1, ease }}
          className="relative mt-14 overflow-hidden border border-accent/25 bg-primary-800 p-2 lg:mt-16"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden sm:aspect-[21/9]">
            <motion.div
              className="absolute -inset-y-[8%] inset-x-0"
              style={reduceMotion ? undefined : { y: imageY }}
            >
              <Image
                src="/images/bozzhyra-mangystau.png"
                alt="Bozzhyra canyon in Mangystau"
                fill
                sizes="100vw"
                className="object-cover object-center"
                priority={false}
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/15 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-primary-900/55 via-transparent to-transparent" />

            <div className="absolute inset-x-0 bottom-0 flex flex-col gap-4 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-8 lg:p-10">
              <div className="flex items-start gap-3">
                <Mountain
                  className="mt-0.5 size-5 shrink-0 text-accent-300"
                  strokeWidth={1.75}
                />
                <div>
                  <h3 className="text-2xl font-bold tracking-[-0.04em] text-primary-50 sm:text-3xl">
                    {t("bozzhyraTitle")}
                  </h3>
                  <p className="mt-2 max-w-[40ch] text-sm leading-relaxed text-primary-200/90">
                    {t("bozzhyraDescription")}
                  </p>
                </div>
              </div>
              <p className="border border-accent/30 bg-primary-900/65 px-3 py-2 font-mono text-[11px] font-medium uppercase tracking-[0.18em] text-accent-300 backdrop-blur-md sm:text-right">
                {t("bozzhyraTag")}
              </p>
            </div>
          </div>
        </motion.div>

        <div className="mt-8 grid gap-8 border-t border-accent/20 pt-10 lg:mt-10 lg:grid-cols-12 lg:gap-12 lg:pt-12">
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.85, ease }}
            className="relative aspect-[4/3] overflow-hidden border border-accent/25 bg-primary-800 p-2 lg:col-span-5"
          >
            <motion.div
              className="absolute -inset-y-[6%] inset-x-0"
              style={reduceMotion ? undefined : { y: coastY }}
            >
              <Image
                src="/images/caspian-coast-action-week.png"
                alt="Caspian Sea coast near Aktau"
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover object-[68%_center]"
              />
            </motion.div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B1D33]/55 via-transparent to-transparent" />
          </motion.div>

          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.35 }}
            transition={{ duration: 0.85, ease, delay: 0.08 }}
            className="flex flex-col justify-center lg:col-span-7 lg:pl-4"
          >
            <div className="flex items-start gap-3">
              <Waves
                className="mt-1 size-5 shrink-0 text-accent-300"
                strokeWidth={1.75}
              />
              <div>
                <h3 className="text-2xl font-bold tracking-[-0.04em] text-primary-50 sm:text-3xl">
                  {t("coastTitle")}
                </h3>
                <p className="mt-3 max-w-[42ch] text-[15px] leading-[1.55] text-primary-200 sm:text-base">
                  {t("coastDescription")}
                </p>
              </div>
            </div>

            <p className="mt-10 max-w-[48ch] border-l-2 border-accent pl-5 text-lg leading-relaxed text-primary-50 sm:text-xl">
              {t("coastQuote")}
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
