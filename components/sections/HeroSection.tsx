"use client"

import { ArrowRight, CalendarDays } from "lucide-react"
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
import { useLayoutEffect, useRef, type PointerEvent } from "react"

import { LanguageSwitcher } from "@/components/interactive/LanguageSwitcher"
import { useLocaleSwitcher } from "@/components/providers/LocaleProvider"
import { Button } from "@/components/ui/button"
import { HACKATHON_REGISTER_URL } from "@/lib/links"

const ease = [0.16, 1, 0.3, 1] as const

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const headerRef = useRef<HTMLElement>(null)
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

  useLayoutEffect(() => {
    const headerEl = headerRef.current
    const sectionEl = sectionRef.current
    if (!headerEl || !sectionEl) return

    const updateHeaderHeight = () => {
      sectionEl.style.setProperty("--header-h", `${headerEl.offsetHeight}px`)
    }

    updateHeaderHeight()
    const observer = new ResizeObserver(updateHeaderHeight)
    observer.observe(headerEl)
    return () => observer.disconnect()
  }, [locale])

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
      className="relative min-h-[100dvh] overflow-hidden border-b border-accent/25 bg-white text-primary-900"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_55%_28%,rgba(197,214,232,0.4),transparent_36%),linear-gradient(115deg,#f4f7fb_0%,#e5ecf4_52%,#e5ecf4_100%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.28] bg-[linear-gradient(rgba(212,175,55,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(212,175,55,0.06)_1px,transparent_1px)] bg-[size:80px_80px]"
      />

      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 top-[var(--header-h,9.75rem)] overflow-hidden"
        style={reduceMotion ? undefined : { x: portraitX, y: portraitY }}
      >
        <div className="absolute inset-0">
          <Image
            src="/images/hero_banner.jpg"
            alt=""
            fill
            priority
            sizes="100vw"
            className="scale-[1.015] object-cover object-[center_35%] opacity-95"
          />
        </div>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(244,247,251,0.96)_0%,rgba(244,247,251,0.88)_28%,rgba(244,247,251,0.55)_50%,rgba(244,247,251,0.22)_72%,rgba(244,247,251,0.12)_100%)]" />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(244,247,251,0.55)_0%,rgba(244,247,251,0.08)_26%,rgba(244,247,251,0.12)_64%,rgba(244,247,251,0.78)_100%)]" />
      </motion.div>

      <header
        ref={headerRef}
        className="fixed inset-x-0 top-0 z-40 border-b border-primary-200 bg-white/92 backdrop-blur-sm"
      >
        {/* Mobile: logo + switcher row, CSAW 2026 dropped to its own row below */}
        <div className="md:hidden">
          <div className="relative mx-auto flex h-20 max-w-[1840px] items-center justify-between gap-2 px-5">
            <a
              href="#home"
              aria-label={t("homeLabel")}
              className="relative z-10 flex shrink-0 items-center"
            >
              <Image
                src="/logo.svg"
                alt=""
                width={420}
                height={440}
                priority
                className="h-14 w-auto"
              />
            </a>

            <LanguageSwitcher className="relative z-10 shrink-0" />
          </div>

          <p
            aria-hidden
            className="pointer-events-none px-5 pb-2.5 text-center text-[clamp(1.15rem,4.5vw,2.1rem)] font-black leading-none tracking-[-0.03em] text-primary-900"
          >
            CSAW 2026
          </p>
        </div>

        {/* Desktop: original single-row layout with the wordmark centered in the gap between logo and the right cluster */}
        <div className="relative mx-auto hidden h-[7rem] max-w-[1840px] items-center gap-4 px-8 md:flex lg:px-12 xl:px-16">
          <a
            href="#home"
            aria-label={t("homeLabel")}
            className="relative z-10 flex shrink-0 items-center"
          >
            <Image
              src="/logo.svg"
              alt=""
              width={420}
              height={440}
              priority
              className="h-24 w-auto"
            />
          </a>

          <p
            aria-hidden
            className="pointer-events-none min-w-0 flex-1 truncate text-center text-[clamp(1.35rem,3.2vw,2.35rem)] font-black tracking-[-0.04em] text-primary-900"
          >
            CSAW 2026
          </p>

          <div className="relative z-10 flex shrink-0 items-center gap-6">
            <div className="flex items-center gap-2 border-r border-primary-200 pr-6 text-xs font-semibold text-primary-600">
              <CalendarDays className="size-4 text-accent-700" aria-hidden />
              <span>{t("dateShort")}</span>
              <span className="text-primary-300">•</span>
              <span>{t("placeShort")}</span>
            </div>

            <LanguageSwitcher />
          </div>
        </div>

        <nav
          aria-label={t("navLabel")}
          className="border-t border-primary-200 bg-white/95"
        >
          <div className="mx-auto flex h-10 max-w-[1840px] items-center justify-center gap-3 px-3 sm:h-11 sm:gap-6 sm:px-5 md:gap-8 md:px-8 lg:px-12 xl:px-16">
            <a
              href="#program"
              onClick={(event) => {
                event.preventDefault()
                scrollTo("#program")
              }}
              className="whitespace-nowrap text-[10px] font-bold tracking-[0.02em] text-primary-700 transition-colors hover:text-accent-700 sm:text-xs"
            >
              {t("navProgram")}
            </a>
            <a
              href="#hackathon"
              onClick={(event) => {
                event.preventDefault()
                scrollTo("#hackathon")
              }}
              className="whitespace-nowrap text-[10px] font-bold tracking-[0.02em] text-primary-700 transition-colors hover:text-accent-700 sm:text-xs"
            >
              {t("navHackathon")}
            </a>
            <a
              href="#mangystau"
              onClick={(event) => {
                event.preventDefault()
                scrollTo("#mangystau")
              }}
              className="whitespace-nowrap text-[10px] font-bold tracking-[0.02em] text-primary-700 transition-colors hover:text-accent-700 sm:text-xs"
            >
              {t("navMangystau")}
            </a>
            <a
              href="#contacts"
              onClick={(event) => {
                event.preventDefault()
                scrollTo("#contacts")
              }}
              className="whitespace-nowrap text-[10px] font-bold tracking-[0.02em] text-primary-700 transition-colors hover:text-accent-700 sm:text-xs"
            >
              {t("navContacts")}
            </a>
          </div>
        </nav>
      </header>

      <div className="relative z-20 mx-auto grid min-h-[100dvh] max-w-[1840px] grid-cols-1 content-center px-5 pb-10 pt-[calc(var(--header-h,9.75rem)+2.25rem)] md:px-8 lg:px-12 lg:pb-14 lg:pt-[calc(var(--header-h,9.75rem)+2.75rem)] xl:px-16">
        <AnimatePresence mode="wait">
          <motion.div
            key={locale}
            initial={reduceMotion ? { opacity: 1 } : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: 0.52, ease }}
            className="max-w-[920px]"
          >
            <h1 className="section-title">
              <span className="block lg:whitespace-nowrap">{t("titleLine1")}</span>
              <span className="block lg:whitespace-nowrap">{t("titleLine2")}</span>
            </h1>

            <div className="mt-7 max-w-[48rem] border-l-2 border-accent pl-4 sm:pl-5">
              <p className="font-mono text-sm font-bold tracking-[0.04em] text-accent-700 sm:text-base">
                {t("dateShort")} • {t("placeShort")}
              </p>
              <p className="mt-3 max-w-[58ch] text-base leading-[1.65] text-primary-800 sm:text-lg">
                {t("description")}
              </p>
            </div>

            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button
                type="button"
                onClick={() => scrollTo("#register")}
                className="h-13 w-full rounded-sm border border-accent-300/70 bg-action-accent px-7 text-sm font-black text-action-accent-foreground shadow-[0_14px_40px_rgba(11,29,51,0.18)] hover:bg-action-accent-hover active:scale-[0.98] sm:w-auto sm:text-[15px]"
              >
                {t("register")}
                <ArrowRight className="size-4" />
              </Button>
              <a
                href={HACKATHON_REGISTER_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-13 w-full items-center justify-center gap-1.5 rounded-sm border border-primary-300 bg-white/70 px-7 text-sm font-bold text-primary-900 transition-all hover:border-accent/55 hover:bg-primary-50/90 active:scale-[0.98] sm:w-auto sm:text-[15px]"
              >
                {t("hackathonRegister")}
                <ArrowRight className="size-4 text-accent-700" />
              </a>
            </div>
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  )
}
