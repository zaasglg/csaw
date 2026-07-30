import { cookies } from "next/headers"
import { redirect } from "next/navigation"

import { ADMIN_SESSION_COOKIE, verifySessionToken } from "@/lib/adminAuth"
import { prisma } from "@/lib/prisma"

import { LogoutButton } from "./LogoutButton"
import { Sidebar } from "./Sidebar"

export default async function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = await cookies()
  if (!verifySessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)) {
    redirect("/admin/login")
  }

  const [volunteersCount, teamsCount, speakersCount] = await Promise.all([
    prisma.volunteer.count(),
    prisma.hackathonTeam.count(),
    prisma.speaker.count(),
  ])

  return (
    <div className="flex min-h-dvh flex-col bg-primary-900">
      <header className="flex shrink-0 items-center justify-between border-b border-accent/20 px-6 py-3 lg:px-10">
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-mark.svg"
            alt="Caspian Sea Action Week 2026"
            width={360}
            height={230}
            className="h-11 w-auto shrink-0"
          />
          <p className="font-mono text-[12px] font-bold uppercase tracking-[0.18em] text-accent-300">
            Админ-панель
          </p>
        </div>
        <LogoutButton />
      </header>
      <div className="flex min-h-0 flex-1 flex-col lg:flex-row">
        <Sidebar
          volunteersCount={volunteersCount}
          teamsCount={teamsCount}
          speakersCount={speakersCount}
        />
        <main className="min-w-0 flex-1 px-6 py-8 lg:px-10 lg:py-10">{children}</main>
      </div>
    </div>
  )
}
