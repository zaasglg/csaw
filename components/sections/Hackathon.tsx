"use client";

import { ArrowRight } from "lucide-react";
import {
  animate,
  motion,
  useInView,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useLocale, useTranslations } from "next-intl";
import { PointerEvent, useEffect, useRef } from "react";

import { Magnetic } from "@/components/interactive/Magnetic";
import type { Locale } from "@/components/providers/LocaleProvider";
import { HACKATHON_REGISTER_URL } from "@/lib/links";

const ease = [0.16, 1, 0.3, 1] as const;

const RULES_BY_LOCALE: Record<Locale, string> = {
  kk: "/documents/first.pdf",
  ru: "/documents/second.pdf",
  en: "/documents/third.pdf",
};

function PrizeCard({
  progress,
  reduceMotion,
}: {
  progress: ReturnType<typeof useScroll>["scrollYProgress"];
  reduceMotion: boolean | null;
}) {
  const t = useTranslations("hackathon");
  const locale = useLocale() as Locale;
  const amount = useRef<HTMLSpanElement>(null);
  const stage = useRef<HTMLDivElement>(null);
  const isVisible = useInView(stage, { once: true, amount: 0.35 });

  const pointerX = useMotionValue(0);
  const pointerY = useMotionValue(0);
  const springX = useSpring(pointerX, { stiffness: 80, damping: 20 });
  const springY = useSpring(pointerY, { stiffness: 80, damping: 20 });
  const numberParallaxX = useTransform(springX, (value) => value * 0.35);

  const numberY = useTransform(progress, [0.1, 0.75], [48, -20]);
  const ringsScale = useTransform(progress, [0.15, 0.55, 0.9], [0.92, 1, 0.96]);
  const ringsY = useTransform(progress, [0, 1], [40, -80]);

  useEffect(() => {
    if (!isVisible || !amount.current) return;

    if (reduceMotion) {
      amount.current.textContent = "10 000 000";
      return;
    }

    const counter = animate(0, 10_000_000, {
      duration: 2.1,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        if (amount.current) {
          amount.current.textContent = Math.round(latest)
            .toLocaleString("ru-RU")
            .replace(/ /g, " ");
        }
      },
    });

    return () => counter.stop();
  }, [isVisible, reduceMotion]);

  function handlePointerMove(event: PointerEvent<HTMLDivElement>) {
    if (reduceMotion) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    const x = (event.clientX - bounds.left) / bounds.width - 0.5;
    const y = (event.clientY - bounds.top) / bounds.height - 0.5;
    pointerX.set(x * 36);
    pointerY.set(y * 22);
  }

  function resetPointer() {
    pointerX.set(0);
    pointerY.set(0);
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
      className="relative flex flex-col gap-10 overflow-hidden border border-accent/25 bg-white p-6 shadow-[0_20px_60px_rgba(11,29,51,0.08)] sm:p-8"
    >
      <div className="relative z-10 flex items-center justify-between gap-6 border-b border-[#E0A82E]/40 pb-6">
        <motion.span
          initial={reduceMotion ? false : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease, delay: 0.1 }}
          className="inline-flex items-center gap-2 rounded-sm border border-[#E0A82E]/70 bg-[#E0A82E]/10 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-accent-800"
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
          style={reduceMotion ? undefined : { y: numberY, x: numberParallaxX }}
          className="relative w-full min-w-0"
        >
          <div className="flex max-w-full flex-wrap items-baseline gap-2 overflow-hidden">
            <span
              ref={amount}
              style={{
                backgroundImage:
                  "linear-gradient(180deg, #F0DF9A 0%, #E0A82E 45%, #B99028 78%, #936E20 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}
              className="whitespace-nowrap text-4xl leading-[0.9] font-black tracking-[-0.04em] tabular-nums sm:text-6xl"
            >
              10 000 000
            </span>
            <span
              aria-hidden
              style={{
                backgroundImage:
                  "linear-gradient(180deg, #F0DF9A 0%, #E0A82E 45%, #B99028 78%, #936E20 100%)",
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                WebkitTextFillColor: "transparent",
              }}
              className="text-3xl leading-[0.9] font-black sm:text-5xl"
            >
              ₸
            </span>
          </div>
          <motion.p
            initial={reduceMotion ? false : { opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease, delay: 0.35 }}
            className="mt-6 max-w-[34ch] text-[15px] leading-[1.55] text-primary-700 sm:text-base"
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
          <a
            href={HACKATHON_REGISTER_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-12 items-center justify-center gap-1.5 rounded-sm border border-[#E0A82E] bg-[#E0A82E] px-7 text-[15px] font-bold tracking-[-0.01em] text-primary-900 transition-all hover:bg-[#EFC158] active:scale-[0.98]"
          >
            {t("registerTeam")}
            <ArrowRight className="size-4" />
          </a>
        </Magnetic>

        <a
          href={RULES_BY_LOCALE[locale]}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex w-fit items-center gap-2.5 rounded-sm border border-dashed border-primary-300 bg-primary-50 px-4 py-2.5 text-sm font-semibold uppercase tracking-[0.1em] text-primary-800 transition-colors hover:border-accent/60 hover:text-accent-700 sm:px-5 sm:py-3 sm:text-base"
        >
          <span className="relative flex size-2.5">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary-400/60" />
            <span className="relative inline-flex size-2.5 rounded-full bg-primary-500/80" />
          </span>
          {t("rulesLabel")}
        </a>
      </motion.div>
    </motion.div>
  );
}

export function Hackathon() {
  const section = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const t = useTranslations("hackathon");
  const requirementsItems = t.raw("requirementsItems") as string[];
  const { scrollYProgress } = useScroll({
    target: section,
    offset: ["start end", "end start"],
  });
  const copyY = useTransform(scrollYProgress, [0, 1], [28, -36]);

  return (
    <section
      ref={section}
      id="hackathon"
      className="mesh-surface-tint relative overflow-hidden border-y border-accent/25 px-5 py-24 lg:px-10 lg:py-36"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_85%_20%,rgba(212,175,55,0.08),transparent_42%)]" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#D4AF37]/50 to-transparent"
      />
      <div className="brand-grid pointer-events-none absolute inset-0 opacity-25" />

      <div className="relative mx-auto max-w-[1480px]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.8, ease }}
        >
          <h2 className="section-title text-[clamp(2rem,3.2vw,3.25rem)]">
            <span className="block">{t("titleLine1")}</span>
            <span className="block">{t("titleLine2")}</span>
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-8 lg:grid-cols-2 lg:items-stretch lg:gap-10">
          <motion.div
            style={reduceMotion ? undefined : { y: copyY }}
            initial={reduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, ease, delay: 0.15 }}
            className="relative border border-accent/25 bg-white p-6 shadow-[0_20px_60px_rgba(11,29,51,0.08)] sm:p-8"
          >
            <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-accent-800">
              {t("requirementsTitle")}
            </p>
            <div className="mt-4 border-b border-accent/20" />
            <ol className="mt-5 space-y-4">
              {requirementsItems.map((item, index) => (
                <li
                  key={item}
                  className="flex gap-3.5 text-[15px] font-medium leading-[1.6] text-primary-900 sm:text-base"
                >
                  <span className="mt-0.5 shrink-0 font-mono text-sm font-bold text-accent-700">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ol>
          </motion.div>

          <PrizeCard progress={scrollYProgress} reduceMotion={reduceMotion} />
        </div>
      </div>
    </section>
  );
}
