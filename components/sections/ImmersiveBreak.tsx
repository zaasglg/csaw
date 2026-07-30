"use client"

import Image from "next/image"
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react"
import { useTranslations } from "next-intl"
import { useRef } from "react"

export function ImmersiveBreak() {
  const section = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const t = useTranslations("manifesto")
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start start", "end end"],
  })
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.18, 1])
  const imageY = useTransform(scrollYProgress, [0, 1], ["-4%", "4%"])
  const firstLineX = useTransform(scrollYProgress, [0, 1], ["-7%", "3%"])
  const secondLineX = useTransform(scrollYProgress, [0, 1], ["8%", "-2%"])
  const veilOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.68, 0.38, 0.72])

  return (
    <section ref={section} id="manifesto" className="relative h-[180dvh] border-y border-accent/25">
      <div className="sticky top-0 min-h-[100dvh] overflow-hidden">
        <motion.div
          className="absolute -inset-12"
          style={reduceMotion ? undefined : { scale: imageScale, y: imageY }}
        >
          <Image
            src="/images/caspian-coast-action-week.png"
            alt="Caspian coastline and environmental volunteers near Aktau"
            fill
            sizes="100vw"
            className="object-cover object-[64%_center]"
          />
        </motion.div>
        <motion.div
          className="absolute inset-0 bg-primary-800"
          style={reduceMotion ? { opacity: 0.58 } : { opacity: veilOpacity }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,29,51,0.72),transparent_48%,rgba(11,29,51,0.48))]" />

        <div className="relative mx-auto flex min-h-[100dvh] max-w-[1600px] flex-col justify-center overflow-hidden px-5 lg:px-10">
          <p className="mb-6 max-w-sm border-l-2 border-accent pl-4 text-xs font-bold uppercase tracking-[0.2em] text-accent">
            {t("kicker")}
          </p>
          <h2 className="text-[clamp(3.1rem,12vw,12rem)] leading-[0.76] font-black tracking-[-0.085em] text-primary-50">
            <span className="block overflow-hidden">
              <motion.span
                className="block whitespace-nowrap"
                style={reduceMotion ? undefined : { x: firstLineX }}
              >
                {t("titleLine1")}
              </motion.span>
            </span>
            <span className="block overflow-hidden">
              <motion.span
                className="block whitespace-nowrap text-transparent [-webkit-text-stroke:1.5px_rgba(212,175,55,0.88)]"
                style={reduceMotion ? undefined : { x: secondLineX }}
              >
                {t("titleLine2")}
              </motion.span>
            </span>
          </h2>
          <p className="mt-9 max-w-lg text-base leading-relaxed text-primary-200/85 sm:text-lg">
            {t("description")}
          </p>
        </div>
      </div>
    </section>
  )
}
