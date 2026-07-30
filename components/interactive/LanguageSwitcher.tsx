"use client"

import { useTranslations } from "next-intl"

import { useLocaleSwitcher, type Locale } from "@/components/providers/LocaleProvider"

const languages: Array<{ id: Locale; label: string }> = [
  { id: "kk", label: "KZ" },
  { id: "ru", label: "RU" },
  { id: "en", label: "EN" },
]

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLocaleSwitcher()
  const t = useTranslations("common")

  return (
    <div
      role="group"
      aria-label={t("languageSwitcherLabel")}
      className={`flex items-center border border-white/15 bg-primary-900/40 p-1 ${className}`}
    >
      {languages.map((item) => {
        const active = locale === item.id

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => setLocale(item.id)}
            aria-pressed={active}
            className={`min-h-8 min-w-9 px-2 text-[11px] font-black tracking-[0.08em] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent ${
              active
                ? "bg-accent text-primary-900"
                : "text-primary-300 hover:bg-white/8 hover:text-primary-50"
            }`}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
