"use client"

import { useTranslations } from "next-intl"
import Image from "next/image"

export function Footer() {
  const t = useTranslations("footer")
  const organizers = t.raw("organizers") as string[]

  return (
    <footer className="mesh-surface-tint relative overflow-hidden border-t border-accent/35 px-5 py-16 lg:px-10">
      <div className="brand-grid pointer-events-none absolute inset-0 opacity-25" />
      <div className="relative mx-auto max-w-[1480px]">
        <div className="grid gap-12 pb-14 md:grid-cols-[1fr_auto]">
          <div className="flex items-center justify-center">
            <div className="mt-6 flex items-center gap-8">
              <Image
                src="/images/logo.png"
                alt="Қазақстан Республикасы"
                width={240}
                height={240}
                className="h-28 w-28 object-contain"
              />
              <Image
                src="/images/ЖЖ.png"
                alt="«Жағымды жаңалық» қоры"
                width={240}
                height={240}
                className="h-28 w-28 object-contain"
              />
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-3 border-t border-accent/20 pt-7 text-xs text-primary-500 sm:flex-row sm:items-center sm:justify-between">
          <p>{t("copyright")}</p>
          <p>{t("place")}</p>
        </div>
      </div>
    </footer>
  )
}
