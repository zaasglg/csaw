"use client"

import { useTranslations } from "next-intl"

export function Footer() {
  const t = useTranslations("footer")

  return (
    <footer className="mesh-surface-tint relative overflow-hidden border-t border-accent/35 px-5 py-10 lg:px-10">
      <div className="brand-grid pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative mx-auto flex max-w-[1480px] flex-col gap-3 text-xs text-primary-500 sm:flex-row sm:items-center sm:justify-between">
        <p>{t("copyright")}</p>
        <p>{t("place")}</p>
      </div>
    </footer>
  )
}
