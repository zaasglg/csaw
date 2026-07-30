"use client"

import {
  ArrowDownRight,
  ArrowRight,
  CalendarDays,
} from "lucide-react"
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react"
import { useTranslations } from "next-intl"
import Image from "next/image"
import { useRef, type PointerEvent } from "react"

import { LanguageSwitcher } from "@/components/interactive/LanguageSwitcher"
import { useLocaleSwitcher } from "@/components/providers/LocaleProvider"
import { Button } from "@/components/ui/button"

const ease = [0.16, 1, 0.3, 1] as const

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const { locale } = useLocaleSwitcher()
  const t = useTranslations("hero")
  const reduceMotion = useReducedMotion()
  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const smoothX = useSpring(pointerX, { stiffness: 70, damping: 24, mass: 0.5 })
  const smoothY = useSpring(pointerY, { stiffness: 70, damping: 24, mass: 0.5 })
  const portraitX = useTransform(smoothX, [-1, 1], [-8, 8])
  const portraitY = useTransform(smoothY, [-1, 1], [-4, 4])

  function handlePointerMove(event: PointerEvent<HTMLElement>) {
    if (reduceMotion || event.pointerType === "touch") return
    const bounds = event.currentTarget.getBoundingClientRect()
    pointerX.set(((event.clientX - bounds.left) / bounds.width) * 2 - 1)
    pointerY.set(((event.clientY - bounds.top) / bounds.height) * 2 - 1)
  }

  function scrollTo(target: string) {
    const element = document.querySelector<HTMLElement>(target)
    if (!element) return

    if (reduceMotion) {
      element.scrollIntoView({ behavior: "auto" })
      return
    }

    window.dispatchEvent(
      new CustomEvent("csaw:scroll-to", {
        detail: { target },
      })
    )
  }

  return (
    <section
      ref={sectionRef}
      id="home"
      onPointerMove={handlePointerMove}
      onPointerLeave={() => {
        pointerX.set(0)
        pointerY.set(0)
      }}
      className="relative min-h-[100dvh] overflow-hidden border-b border-accent/25 bg-primary-900 text-primary-50"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_55%_28%,rgba(41,77,117,0.34),transparent_36%),linear-gradient(115deg,#081a2f_0%,#0b1d33_52%,#102a49_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.18] bg-[linear-gradient(rgba(212,175,55,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.025)_1px,transparent_1px)] bg-[size:80px_80px]"
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[4.5rem] overflow-hidden"
        style={reduceMotion ? undefined : { x: portraitX, y: portraitY }}
      >
        <div className="absolute inset-0">
          <Image
            src="/images/tokayev-international-volunteer-forum.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-[1.015] object-cover object-center opacity-95"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,20,39,0.97)_0%,rgba(7,24,45,0.93)_30%,rgba(8,27,50,0.78)_52%,rgba(9,29,53,0.6)_74%,rgba(9,29,53,0.52)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,20,39,0.42)_0%,rgba(5,20,39,0.08)_28%,rgba(5,20,39,0.16)_66%,rgba(5,20,39,0.7)_100%)]" />
      </motion.div>

      <header className="relative z-30 border-b border-white/[0.06] bg-[#081A2F]/92">
        <div className="mx-auto flex h-[4.5rem] max-w-[1840px] items-center justify-between gap-4 px-5 md:px-8 lg:px-12 xl:px-16">
          <a
            href="#home"
            aria-label={t("homeLabel")}
            className="relative block h-14 w-20 shrink-0 overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            <Image
              src="/logo.svg"
              alt=""
              width={842}
              height={595}
              priority
              className="absolute left-1/2 top-1/2 h-[88px] w-[124px] max-w-none -translate-x-1/2 -translate-y-1/2"
            />
          </a>

          <div className="flex items-center gap-3 sm:gap-6">
            <div className="hidden items-center gap-2 border-r border-white/15 pr-6 text-xs font-semibold text-primary-200 md:flex">
              <CalendarDays className="size-4 text-accent" aria-hidden />
              <span>{t("dateShort")}</span>
              <span className="text-white/30">•</span>
              <span>{t("placeShort")}</span>
            </div>

            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <div className="relative z-20 mx-auto grid min-h-[calc(100dvh-4.5rem)] max-w-[1840px] grid-cols-1 content-center px-5 py-8 md:px-8 lg:px-12 lg:py-10 xl:px-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={locale}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.52, ease }}
            className="max-w-[920px]"
          >
            <div className="mb-7 flex flex-col items-start gap-3 md:flex-row md:items-stretch md:gap-4">
              <div className="inline-flex max-w-full items-center border border-primary-300/45 bg-[#2878B8] px-4 py-3 shadow-[inset_0_0_0_2px_rgba(163,188,213,0.1)] sm:px-5">
                <p className="text-[9px] leading-none font-black tracking-[0.08em] text-white sm:text-[11px] sm:tracking-[0.1em]">
                  {t("badgeKicker")}
                </p>
              </div>
              <div className="flex max-w-[18rem] items-center border-l-2 border-accent pl-4">
                <p className="text-xs leading-[1.35] font-semibold text-primary-100 sm:text-sm">
                  {t("badgeAttribution")}
                </p>
              </div>
            </div>

            <h1 className="text-[clamp(2.65rem,4.8vw,5.8rem)] leading-[0.84] font-black tracking-normal">
              <span className="block lg:whitespace-nowrap">{t("titleLine1")}</span>
              <span className="block lg:whitespace-nowrap">{t("titleLine2")}</span>
            </h1>

            <div className="mt-7 max-w-[43rem] border-l-2 border-accent pl-4 sm:pl-5">
              <p className="font-mono text-[11px] font-bold tracking-[0.04em] text-accent-200 sm:text-[13px]">
                {t("dateShort")} • {t("placeShort")}
              </p>
              <p className="mt-2.5 max-w-[58ch] text-sm leading-[1.6] text-primary-300 sm:text-base">
                {t("description")}
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={() => scrollTo("#register")}
                className="h-13 w-full rounded-sm border border-accent-300/70 bg-action-accent px-7 text-sm font-black text-action-accent-foreground shadow-[0_14px_40px_rgba(11,29,51,0.36)] hover:bg-action-accent-hover active:scale-[0.98] sm:w-auto sm:text-[15px]"
              >
                {t("register")}
                <ArrowRight className="size-4" />
              </Button>
              <Button
                type="button"
                onClick={() => scrollTo("#program")}
                className="h-13 w-full rounded-sm border border-primary-500/50 bg-primary-900/65 px-7 text-sm font-bold text-primary-50 hover:border-accent/55 hover:bg-primary-700/75 active:scale-[0.98] sm:w-auto sm:text-[15px]"
              >
                {t("program")}
                <ArrowDownRight className="size-4 text-accent" />
              </Button>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}
