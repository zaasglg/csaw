"use client"

import { Mail } from "lucide-react"
import { useTranslations } from "next-intl"
import Image from "next/image"

export function Footer() {
  const t = useTranslations("footer")
  const organizers = t.raw("organizers") as string[]

  return (
    <footer className="relative overflow-hidden border-t border-accent/35 bg-primary-900 px-5 py-16 lg:px-10">
      <div className="brand-grid pointer-events-none absolute inset-0 opacity-35" />
      <div className="relative mx-auto max-w-[1480px]">
        <div className="grid gap-12 pb-14 md:grid-cols-[1fr_auto_auto]">
          <div>
            <div className="relative size-24 overflow-hidden">
              <Image
                src="/logo.svg"
                alt="Caspian Sea Action Week 2026"
                width={842}
                height={595}
                className="absolute -left-[58px] -top-[24px] h-[136px] w-[192px] max-w-none"
              />
            </div>
            <p className="mt-6 max-w-md border-l border-accent/40 pl-4 text-sm leading-relaxed text-primary-300">
              {t("address")}
            </p>
          </div>
          <div>
            <p className="text-sm font-bold text-accent">{t("organizersTitle")}</p>
            <div className="mt-5 grid max-w-xs gap-2 text-sm leading-relaxed text-primary-300">
              {organizers.map((organizer) => (
                <span key={organizer}>{organizer}</span>
              ))}
            </div>
          </div>
          <div>
            <p className="text-sm font-bold text-accent">{t("contactTitle")}</p>
            <a
              href="mailto:info@caspianseaactionweek.kz"
              className="mt-5 flex items-center gap-2 text-sm text-primary-300 transition-colors hover:text-accent"
            >
              <Mail className="size-4" />
              info@csaw2026aktau.kz
            </a>
            <a
              href="https://caspianseaactionweek.kz"
              className="mt-3 block text-sm text-primary-300 transition-colors hover:text-accent"
            >
              http://csaw2026aktau.kz/
            </a>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-accent/20 pt-7 text-xs text-primary-400 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("copyright")}</p>
          <p>{t("place")}</p>
        </div>
      </div>
    </footer>
  )
}
