"use client"

import { NextIntlClientProvider } from "next-intl"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react"

import en from "@/messages/en.json"
import kk from "@/messages/kk.json"
import ru from "@/messages/ru.json"

export type Locale = "kk" | "ru" | "en"

const STORAGE_KEY = "csaw-locale"
const messagesByLocale = { kk, ru, en } as const
const listeners = new Set<() => void>()

function isLocale(value: string | null): value is Locale {
  return value === "kk" || value === "ru" || value === "en"
}

function subscribe(callback: () => void) {
  listeners.add(callback)
  window.addEventListener("storage", callback)
  return () => {
    listeners.delete(callback)
    window.removeEventListener("storage", callback)
  }
}

function getSnapshot(): Locale {
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return isLocale(stored) ? stored : "kk"
}

function getServerSnapshot(): Locale {
  return "kk"
}

function writeLocale(next: Locale) {
  window.localStorage.setItem(STORAGE_KEY, next)
  listeners.forEach((listener) => listener())
}

interface LocaleContextValue {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextValue | null>(null)

export function useLocaleSwitcher() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error("useLocaleSwitcher must be used within LocaleProvider")
  }
  return context
}

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)

  useEffect(() => {
    document.documentElement.lang = locale
  }, [locale])

  const setLocale = useCallback((next: Locale) => {
    writeLocale(next)
  }, [])

  const value = useMemo(() => ({ locale, setLocale }), [locale, setLocale])

  return (
    <LocaleContext.Provider value={value}>
      <NextIntlClientProvider
        locale={locale}
        messages={messagesByLocale[locale]}
        timeZone="Asia/Aqtau"
      >
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  )
}
