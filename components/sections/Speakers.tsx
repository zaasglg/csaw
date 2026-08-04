"use client"

import { Eye } from "lucide-react"
import { motion, useReducedMotion } from "motion/react"
import { useLocale, useTranslations } from "next-intl"
import Image from "next/image"
import { useState } from "react"

import type { Locale } from "@/components/providers/LocaleProvider"
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog"
import { localizeSpeaker, type SpeakerRecord } from "@/lib/speakers"

const ease = [0.16, 1, 0.3, 1] as const

const placeholderSlots = [
  { id: "placeholder-1", avatar: "https://i.pravatar.cc/400?img=12" },
  { id: "placeholder-2", avatar: "https://i.pravatar.cc/400?img=33" },
  { id: "placeholder-3", avatar: "https://i.pravatar.cc/400?img=45" },
  { id: "placeholder-4", avatar: "https://i.pravatar.cc/400?img=5" },
  { id: "placeholder-5", avatar: "https://i.pravatar.cc/400?img=68" },
  { id: "placeholder-6", avatar: "https://i.pravatar.cc/400?img=21" },
]

function SpeakerPhoto({
  src,
  sizes,
  className,
  unoptimized = false,
}: {
  src: string
  sizes: string
  className?: string
  unoptimized?: boolean
}) {
  return (
    <Image
      src={src}
      alt=""
      fill
      unoptimized={unoptimized}
      sizes={sizes}
      className={`object-cover object-top ${className ?? ""}`}
    />
  )
}

export function Speakers({ speakers }: { speakers: SpeakerRecord[] }) {
  const reduceMotion = useReducedMotion()
  const t = useTranslations("speakers")
  const locale = useLocale() as Locale
  const [activeId, setActiveId] = useState<string | null>(null)
  const localizedSpeakers = speakers.map((speaker) =>
    localizeSpeaker(speaker, locale),
  )
  const hasSpeakers = localizedSpeakers.length > 0
  const activeSpeaker = hasSpeakers
    ? (localizedSpeakers.find((speaker) => speaker.id === activeId) ?? null)
    : null
  const activeSlot = hasSpeakers
    ? null
    : (placeholderSlots.find((slot) => slot.id === activeId) ?? null)

  return (
    <section
      id="speakers"
      aria-labelledby="speakers-title"
      className="mesh-surface-white relative overflow-hidden border-y border-accent/25 px-5 py-24 lg:px-10 lg:py-36"
    >
      <div className="brand-grid pointer-events-none absolute inset-0 opacity-25" />

      <div className="relative mx-auto max-w-[1480px]">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.45, ease }}
          className="grid gap-8 border-b border-accent/25 pb-12 lg:grid-cols-12 lg:items-end"
        >
          <div className="lg:col-span-8">
            <h2 id="speakers-title" className="section-title">
              {t("headingPrefix")} {t("headingAccent")}
            </h2>
          </div>
        </motion.div>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {hasSpeakers
            ? localizedSpeakers.map((speaker, index) => (
                <motion.button
                  key={speaker.id}
                  type="button"
                  onClick={() => setActiveId(speaker.id)}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2, margin: "0px 0px -10% 0px" }}
                  transition={{
                    duration: 0.35,
                    ease,
                    delay: reduceMotion ? 0 : Math.min(index, 5) * 0.04,
                  }}
                  className="group relative overflow-hidden border border-accent/20 bg-primary-50 text-left transition-colors duration-300 hover:border-accent/50 focus-visible:border-accent/50 focus-visible:outline-none"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-primary-100">
                    {speaker.avatarUrl ? (
                      <SpeakerPhoto
                        src={speaker.avatarUrl}
                        unoptimized
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                      />
                    ) : null}
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-900/85 via-primary-900/10 to-transparent"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 flex items-center justify-center bg-primary-900/60 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                    >
                      <span className="inline-flex items-center gap-2 rounded-sm border border-accent/50 bg-primary-900/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-accent-300">
                        <Eye className="size-3.5" />
                        {t("viewDetails")}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <p className="text-[15px] font-bold tracking-[-0.01em] text-primary-900">
                      {speaker.name}
                    </p>
                    <p className="mt-1 text-[13px] leading-[1.4] text-primary-600">
                      {speaker.role}, {speaker.organization}
                    </p>
                  </div>
                </motion.button>
              ))
            : placeholderSlots.map((slot, index) => (
                <motion.button
                  key={slot.id}
                  type="button"
                  onClick={() => setActiveId(slot.id)}
                  initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2, margin: "0px 0px -10% 0px" }}
                  transition={{
                    duration: 0.35,
                    ease,
                    delay: reduceMotion ? 0 : Math.min(index, 5) * 0.04,
                  }}
                  className="group relative overflow-hidden border border-accent/20 bg-primary-50 text-left transition-colors duration-300 hover:border-accent/50 focus-visible:border-accent/50 focus-visible:outline-none"
                >
                  <div className="relative aspect-[4/5] overflow-hidden bg-primary-100">
                    <SpeakerPhoto
                      src={slot.avatar}
                      sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-900/85 via-primary-900/10 to-transparent"
                    />
                    <div
                      aria-hidden
                      className="pointer-events-none absolute inset-0 flex items-center justify-center bg-primary-900/60 opacity-0 backdrop-blur-[1px] transition-opacity duration-300 group-hover:opacity-100 group-focus-visible:opacity-100"
                    >
                      <span className="inline-flex items-center gap-2 rounded-sm border border-accent/50 bg-primary-900/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-accent-300">
                        <Eye className="size-3.5" />
                        {t("viewDetails")}
                      </span>
                    </div>
                    <span className="absolute left-3 top-3 rounded-sm border border-accent/40 bg-primary-900/80 px-2 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-accent-300">
                      {t("comingSoon")}
                    </span>
                  </div>
                  <div className="p-4">
                    <p className="text-[15px] font-bold tracking-[-0.01em] text-primary-900">
                      {t("namePlaceholder")}
                    </p>
                    <p className="mt-1 text-[13px] leading-[1.4] text-primary-600">
                      {t("rolePlaceholder")}
                    </p>
                  </div>
                </motion.button>
              ))}
        </div>
      </div>

      <Dialog
        open={activeSpeaker !== null || activeSlot !== null}
        onOpenChange={(open) => {
          if (!open) setActiveId(null)
        }}
      >
        <DialogContent
          data-lenis-prevent
          showCloseButton
          className="max-h-[calc(100dvh-2rem)] w-full max-w-3xl overflow-y-auto rounded-sm border border-accent/40 bg-white p-0 text-primary-900 shadow-[0_30px_100px_rgba(11,29,51,0.18)] duration-150 sm:max-w-3xl"
        >
          {activeSpeaker ? (
            <div className="grid gap-0 sm:grid-cols-[minmax(0,240px)_1fr]">
              <div className="relative h-56 overflow-hidden bg-primary-100 sm:h-auto sm:min-h-[320px]">
                {activeSpeaker.avatarUrl ? (
                  <SpeakerPhoto
                    src={activeSpeaker.avatarUrl}
                    unoptimized
                    sizes="(min-width: 640px) 240px, 100vw"
                  />
                ) : null}
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-900/50 via-transparent to-transparent sm:bg-gradient-to-r"
                />
              </div>

              <div className="flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10">
                <DialogTitle className="text-2xl font-black tracking-[-0.03em] text-primary-900 sm:text-3xl">
                  {activeSpeaker.name}
                </DialogTitle>
                <p className="mt-1.5 text-[15px] font-semibold text-accent-700">
                  {activeSpeaker.role}, {activeSpeaker.organization}
                </p>
              </div>
            </div>
          ) : activeSlot ? (
            <div className="grid gap-0 sm:grid-cols-[minmax(0,240px)_1fr]">
              <div className="relative h-56 overflow-hidden bg-primary-100 sm:h-auto sm:min-h-[320px]">
                <SpeakerPhoto
                  src={activeSlot.avatar}
                  sizes="(min-width: 640px) 240px, 100vw"
                />
                <div
                  aria-hidden
                  className="pointer-events-none absolute inset-0 bg-gradient-to-t from-primary-900/50 via-transparent to-transparent sm:bg-gradient-to-r"
                />
              </div>

              <div className="flex flex-col justify-center px-6 py-8 sm:px-8 sm:py-10">
                <DialogTitle className="text-2xl font-black tracking-[-0.03em] text-primary-900 sm:text-3xl">
                  {t("namePlaceholder")}
                </DialogTitle>
                <p className="mt-1.5 text-[15px] font-semibold text-accent-700">
                  {t("rolePlaceholder")}
                </p>
              </div>
            </div>
          ) : null}
        </DialogContent>
      </Dialog>
    </section>
  )
}
