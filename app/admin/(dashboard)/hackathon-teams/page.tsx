import type { Metadata } from "next"

import { prisma } from "@/lib/prisma"

import { dateFormatter, EmptyState, SectionTitle } from "../AdminUi"
import { TeamActions } from "./TeamActions"

export const metadata: Metadata = {
  title: "Заявки команд хакатона · Админ-панель CSAW 2026",
}

export default async function AdminHackathonTeamsPage() {
  const teams = await prisma.hackathonTeam.findMany({
    orderBy: { createdAt: "desc" },
  })

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4">
      <SectionTitle count={teams.length}>Заявки команд хакатона</SectionTitle>

      {teams.length === 0 ? (
        <EmptyState>Пока нет заявок команд.</EmptyState>
      ) : (
        <div className="flex flex-col gap-5">
          {teams.map((team) => (
            <div key={team.id} className="border border-accent/20 bg-primary-800/40">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-accent/20 bg-primary-900/40 px-5 py-4">
                <div>
                  <p className="text-[16px] font-bold text-primary-50">{team.teamName}</p>
                  <p className="mt-0.5 text-[13px] text-primary-300">
                    {team.country} · {team.region} · Капитан: {team.captainName}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <p className="text-[12px] text-primary-400">
                    {dateFormatter.format(team.createdAt)}
                  </p>
                  <TeamActions
                    team={{
                      id: team.id,
                      teamName: team.teamName,
                      country: team.country,
                      region: team.region,
                      captainName: team.captainName,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
