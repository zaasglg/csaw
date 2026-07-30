"use client"

import { ArrowRight } from "lucide-react"
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react"
import { useTranslations } from "next-intl"
import { PointerEvent, useEffect, useRef } from "react"

import { Magnetic } from "@/components/interactive/Magnetic"
import { Button } from "@/components/ui/button"

const ease = [0.16, 1, 0.3, 1] as const

function PrizeCard({
  progress,
  reduceMotion,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"]
  reduceMotion: boolean | null
}) {
  const t = useTranslations("hackathon")
  const ticker = t.raw("ticker") as string[]
  const amount = useRef<HTMLSpanElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const isVisible = useInView(stage, { once: true, amount: 0.35 })

  const pointerX = useMotionValue(0)
  const pointerY = useMotionValue(0)
  const springX = useSpring(pointerX, { stiffness: 80, damping: 20 })
  const springY = useSpring(pointerY, { stiffness: 80, damping: 20 })
  const numberParallaxX = useTransform(springX, (value) => value * 0.35)

  const numberY = useTransform(progress, [0.1, 0.75], [48, -20])
  const washOpacity = useTransform(progress, [0, 0.4, 1], [0.4, 0.85, 0.5])
  const ringsScale = useTransform(progress, [0.15, 0.55, 0.9], [0.92, 1, 0.96])
  const ringsY = useTransform(progress, [0, 1], [40, -80])

  useEffect(() => {
    if (!isVisible || !amount.current) return

    if (reduceMotion) {
      amount.current.textContent = "10 000 000"
      return
    }

    const counter = animate(0, 10_000_000, {
      duration: 2.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (amount.current) {
          amount.current.textContent = Math.round(latest)
            .toLocaleString("ru-RU")
            .replace(/ /g, " ")
        }
      },
    })

    return () => counter.stop()
  }, [isVisible, reduceMotion])

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const x = (event.clientX - bounds.left) / bounds.width - 0.5
    const y = (event.clientY - bounds.top) / bounds.height - 0.5
    pointerX.set(x * 36)
    pointerY.set(y * 22)
  }

  function resetPointer() {
    pointerX.set(0)
    pointerY.set(0)
  }

  function scrollToHackathonRegister() {
    const target = document.querySelector<HTMLElement>("#hackathon-register")
    if (!target) return

    if (reduceMotion) {
      target.scrollIntoView({ behavior: "auto" })
      return
    }

    window.dispatchEvent(
      new CustomEvent("csaw:scroll-to", {
        detail: { target: "#hackathon-register" },
      })
    )
  }

  return (
    <motion.div
      ref={stage}
      onPointerMove={handlePointerMove}
      onPointerLeave={resetPointer}
      initial={reduceMotion ? false : { opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 1, ease }}
      className="relative flex flex-col gap-10 overflow-hidden border border-[#E0A82E] bg-[#142C4D] p-6 shadow-[0_0_0_1px_rgba(224,168,46,0.12),0_30px_90px_rgba(8,18,36,0.55)] sm:p-8 lg:gap-12 lg:p-10"
    >
      <motion.div
        aria-hidden
        style={reduceMotion ? undefined : { opacity: washOpacity }}
        className="pointer-events-none absolute -right-[30%] -top-[20%] size-[min(70vw,520px)] rounded-full bg-[radial-gradient(circle,rgba(224,168,46,0.3)_0%,rgba(224,168,46,0.08)_36%,transparent_70%)] blur-3xl"
      />

      <div className="relative z-10 flex items-center justify-between gap-6 border-b border-[#E0A82E]/40 pb-6">
        <motion.span
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-sm border border-[#E0A82E]/70 bg-[#E0A82E]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#E0A82E]"
        >
          {t("prizeFund")}
        </motion.span>
      </div>

      <div className="relative z-10">
        <motion.div
          aria-hidden
          style={
            reduceMotion
              ? undefined
              : {
                  y: ringsY,
                  scale: ringsScale,
                  x: springX,
                }
          }
          className="pointer-events-none absolute -right-[4%] top-1/2 size-24 -translate-y-1/2 sm:size-36 lg:size-44"
        >
          <div className="absolute inset-0 rounded-full border border-[#E0A82E]/16" />
          <div className="absolute inset-[12%] rounded-full border border-[#E0A82E]/10" />
          {!reduceMotion &&
            [0, 1].map((ring) => (
              <motion.div
                key={ring}
                className="absolute inset-0 rounded-full border border-[#E0A82E]/25"
                animate={{
                  opacity: [0, 0.28, 0],
                  scale: [1, 1.2, 1.38],
                }}
                transition={{
                  duration: 3.8,
                  delay: ring * 1.6,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
            ))}
        </motion.div>

        <motion.div
          style={
            reduceMotion
              ? undefined
              : { y: numberY, x: numberParallaxX }
          }
          className="relative w-full min-w-0"
        >
          <p className="mb-3 font-mono text-[11px] font-medium uppercase tracking-[0.2em] text-[#E7CC65]">
            {t("prizeCaption")}
          </p>
          <span
            ref={amount}
            style={{
              backgroundImage:
                "linear-gradient(180deg, #FCF9EC 0%, #F0DF9A 22%, #E0A82E 55%, #E0A82E 100%)",
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
              WebkitTextFillColor: "transparent",
            }}
            className="block max-w-full overflow-hidden whitespace-nowrap text-4xl leading-[0.9] font-black tracking-[-0.04em] tabular-nums sm:text-6xl"
          >
            10 000 000
          </span>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease, delay: 0.35 }}
            className="mt-6 max-w-[34ch] text-[15px] leading-[1.55] text-primary-200 sm:text-base"
          >
            {t("prizeDescription")}
          </motion.p>
        </motion.div>
      </div>

      <motion.div
        style={reduceMotion ? undefined : { y: springY }}
        className="relative z-10 flex flex-col gap-6 border-t border-[#E0A82E]/30 pt-6"
      >
        <Magnetic className="inline-block w-fit">
          <Button
            type="button"
            onClick={scrollToHackathonRegister}
            className="h-12 rounded-sm border border-[#E0A82E] bg-[#E0A82E] px-7 text-[15px] font-bold tracking-[-0.01em] text-primary-900 shadow-[0_18px_50px_rgba(8,18,36,0.35)] hover:bg-[#EFC158] active:scale-[0.98]"
          >
            {t("registerTeam")}
            <ArrowRight className="size-4" />
          </Button>
        </Magnetic>

        <div className="overflow-hidden">
          <div
            className={`flex w-max gap-10 whitespace-nowrap ${reduceMotion ? "" : "animate-hack-ticker"}`}
          >
            {[...ticker, ...ticker].map((item, index) => (
              <span
                key={`${item}-${index}`}
                className="font-mono text-[10px] font-medium uppercase tracking-[0.22em] text-primary-200/80"
              >
                {item}
                <span className="ml-10 text-[#E0A82E]/55">/</span>
              </span>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export function Hackathon() {
  const section = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()
  const t = useTranslations("hackathon")
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  })
  const copyY = useTransform(scrollYProgress, [0, 1], [28, -36])

  return (
    <section
      ref={section}
      id="hackathon"
      className="relative overflow-hidden border-y border-accent/25 bg-primary-800 px-5 py-24 lg:px-10 lg:py-36"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_20%,rgba(212,175,55,0.1),transparent_42%),linear-gradient(180deg,rgba(16,42,73,0.2),rgba(11,29,51,0.85))]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"
      />
      <div className="brand-grid pointer-events-none absolute inset-0 opacity-35" />

      <div className="relative mx-auto grid max-w-[1480px] gap-16 lg:grid-cols-12 lg:items-stretch lg:gap-12">
        <motion.div
          style={reduceMotion ? undefined : { y: copyY }}
          className="flex flex-col justify-center lg:col-span-5"
        >
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: {},
              visible: {
                transition: { staggerChildren: 0.09, delayChildren: 0.05 },
              },
            }}
          >
            <motion.p
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.7, ease }}
              className="font-mono text-[11px] font-medium uppercase tracking-[0.22em] text-accent-300"
            >
              {t("overline")}
            </motion.p>

            <h2 className="mt-6 text-primary-50">
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  variants={{
                    hidden: { y: "110%" },
                    visible: { y: "0%" },
                  }}
                  transition={{ duration: 0.9, ease }}
                  className="block text-[clamp(2.15rem,6vw,5.4rem)] leading-[0.92] font-semibold"
                >
                  {t("titleLine1")}
                </motion.span>
              </span>
              <span className="block overflow-hidden pb-[0.06em]">
                <motion.span
                  variants={{
                    hidden: { y: "110%" },
                    visible: { y: "0%" },
                  }}
                  transition={{ duration: 0.9, ease }}
                  className="block text-[clamp(1.5rem,3.2vw,2.4rem)] leading-[1.05] font-semibold text-accent"
                >
                  {t("titleLine2")}
                </motion.span>
              </span>
            </h2>

            <motion.p
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: { opacity: 1, y: 0 },
              }}
              transition={{ duration: 0.75, ease }}
              className="mt-7 max-w-[42ch] text-[15px] leading-[1.55] text-primary-200 sm:text-lg"
            >
              {t("description")}
            </motion.p>
          </motion.div>
        </motion.div>

        <div className="lg:col-span-7 lg:border-l lg:border-accent/20 lg:pl-12">
          <PrizeCard progress={scrollYProgress} reduceMotion={reduceMotion} />
        </div>
      </div>
    </section>
  )
}
