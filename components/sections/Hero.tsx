"use client"

import { ArrowDown, ArrowRight, CalendarDays, MapPin } from "lucide-react"
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react"
import { useRef, useState } from "react"

import { RegisterDialog } from "@/components/interactive/RegisterDialog"
import { Magnetic } from "@/components/interactive/Magnetic"
import { Button } from "@/components/ui/button"

type Locale = "KZ" | "RU" | "EN"

const heroCopy = {
  KZ: {
    nav: ["Іс-шара", "Хакатон", "Бағдарлама", "Маңғыстау"],
    headline: ["Каспийді", "бірге қорғайық"],
    description:
      "Экология, еріктілік және технология тоғысқан халықаралық апта.",
    date: "6-12 тамыз 2026",
    place: "Ақтау, Қазақстан",
    register: "Тіркелу",
  },
  RU: {
    nav: ["О событии", "Хакатон", "Программа", "Мангистау"],
    headline: ["Сохраним Каспий", "вместе"],
    description:
      "Международная неделя экологии, волонтёрства и технологических решений.",
    date: "6-12 августа 2026",
    place: "Актау, Казахстан",
    register: "Регистрация",
  },
  EN: {
    nav: ["About", "Hackathon", "Program", "Mangystau"],
    headline: ["Protect Caspian", "together"],
    description:
      "An international week where ecology, volunteering and technology meet.",
    date: "6-12 August 2026",
    place: "Aktau, Kazakhstan",
    register: "Register",
  },
} as const

function SiteMark() {
  return (
    <a href="#home" aria-label="Caspian Sea Action Week home" className="flex items-center gap-3">
      <span className="hidden text-xs leading-tight font-black tracking-[0.08em] sm:block">
        CASPIAN SEA
        <br />
        ACTION WEEK
      </span>
    </a>
  )
}

export function Hero() {
  const hero = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const [locale, setLocale] = useState<Locale>("KZ")
  const copy = heroCopy[locale]
  const { scrollYProgress } = useScroll({
    target: hero,
    offset: ["start start", "end start"],
  })
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 170])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.82], [1, 0])
  const canvasScale = useTransform(scrollYProgress, [0, 1], [1, 1.12])

  return (
    <section
      ref={hero}
      id="home"
      className="relative min-h-[100dvh] overflow-hidden border-b border-white/10"
    >
      <motion.div
        aria-hidden
        className="absolute inset-0 bg-[#102A49] bg-[url('/images/caspian-sea-hero-poster.jpg')] bg-cover bg-center"
        style={reduceMotion ? undefined : { scale: canvasScale }}
      >
        {!reduceMotion && (
          <video
            autoPlay
            muted
            loop
            playsInline
            disablePictureInPicture
            controls={false}
            preload="metadata"
            poster="/images/caspian-sea-hero-poster.jpg"
            className="absolute inset-0 size-full object-cover object-center"
          >
            <source src="/videos/caspian-sea-hero.mp4" type="video/mp4" />
          </video>
        )}
      </motion.div>
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(11,29,51,0.32)_0%,rgba(11,29,51,0.08)_38%,rgba(11,29,51,0.78)_100%)]" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(11,29,51,0.84)_0%,rgba(11,29,51,0.34)_52%,rgba(11,29,51,0.04)_100%)]" />
      <div className="absolute inset-0 bg-[#D4AF37]/10 mix-blend-color" />

      <header className="absolute inset-x-0 top-0 z-20 border-b border-white/10 bg-[#102A49]/54 backdrop-blur-md">
        <div className="mx-auto flex h-[84px] max-w-[1480px] items-center justify-between px-5 lg:px-10">
          <SiteMark />
          <nav className="hidden items-center gap-8 lg:flex" aria-label="Main navigation">
            {copy.nav.map((label, index) => (
              <a
                key={label}
                href={["#about", "#hackathon", "#program", "#mangystau"][index]}
                className="text-sm font-semibold tracking-[-0.01em] text-[#C9D7E8] transition-colors hover:text-[#F4F7FB] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D4AF37]"
              >
                {label}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-2.5">
            <div className="hidden rounded-full border border-white/14 bg-[#1A365D]/75 p-1 sm:flex">
              {(["KZ", "RU", "EN"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setLocale(item)}
                  aria-pressed={locale === item}
                  className={`min-h-8 rounded-full px-2.5 text-[11px] font-bold transition-colors ${
                    locale === item
                      ? "bg-[#F4F7FB] text-[#0B1D33]"
                      : "text-[#C9D7E8] hover:text-[#F4F7FB]"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
            <Magnetic className="hidden sm:inline-flex" strength={0.16}>
              <RegisterDialog kind="participant">
                <Button className="h-10 rounded-full bg-[#F4F7FB] px-5 text-[14px] font-bold text-[#0B1D33] hover:bg-[#F8F0CE]">
                  {copy.register}
                  <ArrowRight className="size-4" />
                </Button>
              </RegisterDialog>
            </Magnetic>
            <a
              href="#program"
              aria-label="Бағдарламаға өту"
              className="grid size-10 place-items-center rounded-full border border-white/16 bg-white/[0.055] text-white lg:hidden"
            >
              <ArrowDown className="size-5" />
            </a>
          </div>
        </div>
      </header>

      <motion.div
        className="relative z-[1] mx-auto flex min-h-[100dvh] max-w-[1480px] items-end px-5 pb-10 pt-24 lg:px-10 lg:pb-14"
        style={reduceMotion ? undefined : { y: contentY, opacity: contentOpacity }}
      >
        <div className="w-full max-w-[1120px]">
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-[#D4AF37]"
          >
            Caspian Sea Action Week 2026
          </motion.p>
          <AnimatePresence mode="wait">
            <motion.h1
              key={locale}
              initial="hidden"
              animate="visible"
              exit={{ opacity: 0, y: -18 }}
              variants={{
                hidden: {},
                visible: { transition: { staggerChildren: 0.09 } },
              }}
              className="text-[clamp(3rem,7.4vw,7.4rem)] leading-[0.83] font-black tracking-[-0.07em] text-[#F4F7FB] uppercase"
            >
              {copy.headline.map((line, lineIndex) => (
                <span
                  key={line}
                  className="block overflow-hidden pb-[0.1em] sm:whitespace-nowrap"
                >
                  <motion.span
                    className={lineIndex === 1 ? "block text-[#D4AF37]" : "block"}
                    variants={{
                      hidden: reduceMotion
                        ? { opacity: 0 }
                        : { opacity: 0, y: "110%" },
                      visible: { opacity: 1, y: 0 },
                    }}
                    transition={{
                      duration: 0.78,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                  >
                    {line}
                  </motion.span>
                </span>
              ))}
            </motion.h1>
          </AnimatePresence>
          <motion.div
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.54, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between"
          >
            <p className="max-w-lg text-base leading-relaxed text-[#C9D7E8] sm:text-lg">
              {copy.description}
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-semibold text-white/76">
                <span className="flex items-center gap-2">
                  <CalendarDays className="size-4 text-[#D4AF37]" />
                  {copy.date}
                </span>
                <span className="flex items-center gap-2">
                  <MapPin className="size-4 text-[#D4AF37]" />
                  {copy.place}
                </span>
              </div>
              <Magnetic>
                <RegisterDialog kind="participant">
                  <Button className="h-12 rounded-full bg-[#F4F7FB] px-7 text-base font-bold text-[#0B1D33] shadow-[0_16px_50px_rgba(242,232,213,0.18)] hover:bg-[#F8F0CE] active:scale-[0.98]">
                    {copy.register}
                    <ArrowRight className="size-4" />
                  </Button>
                </RegisterDialog>
              </Magnetic>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </section>
  )
}
