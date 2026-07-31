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
        <div className="overflow-x-auto border border-accent/20 bg-primary-800/40">
          <table className="w-full min-w-[760px] text-left text-[14px]">
            <thead>
              <tr className="border-b border-accent/20 text-[11px] font-bold uppercase tracking-[0.08em] text-primary-300">
                <th className="px-4 py-3">Команда</th>
                <th className="px-4 py-3">Страна</th>
                <th className="px-4 py-3">Область / город</th>
                <th className="px-4 py-3">Капитан</th>
                <th className="px-4 py-3">Дата подачи</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {teams.map((team) => (
                <tr key={team.id} className="border-b border-accent/10 last:border-0">
                  <td className="px-4 py-3 font-semibold text-primary-50">
                    {team.teamName}
                  </td>
                  <td className="px-4 py-3 text-primary-200">{team.country}</td>
                  <td className="px-4 py-3 text-primary-200">{team.region}</td>
                  <td className="px-4 py-3 text-primary-200">{team.captainName}</td>
                  <td className="px-4 py-3 text-primary-300">
                    {dateFormatter.format(team.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <TeamActions
                      team={{
                        id: team.id,
                        teamName: team.teamName,
                        country: team.country,
                        region: team.region,
                        captainName: team.captainName,
                      }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
