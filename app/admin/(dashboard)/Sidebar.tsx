"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const navItems = [
  { href: "/admin/volunteers", label: "Волонтёры" },
  { href: "/admin/hackathon-teams", label: "Команды хакатона" },
  { href: "/admin/speakers", label: "Спикеры" },
] as const

export function Sidebar({
  volunteersCount,
  teamsCount,
  speakersCount,
}: {
  volunteersCount: number
  teamsCount: number
  speakersCount: number
}) {
  const pathname = usePathname()
  const counts: Record<string, number> = {
    "/admin/volunteers": volunteersCount,
    "/admin/hackathon-teams": teamsCount,
    "/admin/speakers": speakersCount,
  }

  return (
    <nav className="flex shrink-0 flex-col gap-1 border-b border-accent/20 bg-primary-900/60 p-3 lg:min-h-full lg:w-64 lg:border-r lg:border-b-0 lg:p-4">
      {navItems.map((item) => {
        const active = pathname === item.href

        return (
          <Link
            key={item.href}
            href={item.href}
            aria-current={active ? "page" : undefined}
            className={`flex items-center justify-between gap-3 rounded-sm border px-3 py-2.5 text-[14px] font-semibold transition-colors ${
              active
                ? "border-accent bg-accent/15 text-accent-300"
                : "border-transparent text-primary-200 hover:border-accent/30 hover:bg-primary-800/50 hover:text-primary-50"
            }`}
          >
            {item.label}
            <span
              className={`inline-flex size-6 shrink-0 items-center justify-center rounded-full border text-[11px] font-bold tabular-nums ${
                active
                  ? "border-accent/50 text-accent-300"
                  : "border-primary-400/30 text-primary-400"
              }`}
            >
              {counts[item.href]}
            </span>
          </Link>
        )
      })}
    </nav>
  )
}
