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
    include: { members: { orderBy: { position: "asc" } } },
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
                      members: team.members.map((member) => ({
                        fullName: member.fullName,
                        countryNationality: member.countryNationality,
                        organization: member.organization,
                        specialty: member.specialty,
                      })),
                    }}
                  />
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-[560px] text-left text-[14px]">
                  <thead>
                    <tr className="border-b border-accent/10 text-[11px] font-bold uppercase tracking-[0.08em] text-primary-300">
                      <th className="px-4 py-2.5">#</th>
                      <th className="px-4 py-2.5">ФИО</th>
                      <th className="px-4 py-2.5">Страна, национальность</th>
                      <th className="px-4 py-2.5">Организация</th>
                      <th className="px-4 py-2.5">Специальность</th>
                    </tr>
                  </thead>
                  <tbody>
                    {team.members.map((member) => (
                      <tr key={member.id} className="border-b border-accent/10 last:border-0">
                        <td className="px-4 py-2.5 text-primary-300">
                          {member.position === 0 ? "Капитан" : member.position + 1}
                        </td>
                        <td className="px-4 py-2.5 font-semibold text-primary-50">
                          {member.fullName}
                        </td>
                        <td className="px-4 py-2.5 text-primary-200">
                          {member.countryNationality}
                        </td>
                        <td className="px-4 py-2.5 text-primary-200">{member.organization}</td>
                        <td className="px-4 py-2.5 text-primary-200">{member.specialty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
