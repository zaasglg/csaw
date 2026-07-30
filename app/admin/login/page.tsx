import type { Metadata } from "next"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/adminAuth"

import { LoginForm } from "./LoginForm"

export const metadata: Metadata = {
  title: "Вход в админ-панель · CSAW 2026",
}

export default async function AdminLoginPage() {
  const cookieStore = await cookies()
  if (verifySessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
    redirect("/admin")
  }

  return (
    <div className="relative grid min-h-dvh place-items-center bg-primary-900 px-5">
      <div className="brand-grid pointer-events-none absolute inset-0 opacity-35" />
      <LoginForm />
    </div>
  )
}
