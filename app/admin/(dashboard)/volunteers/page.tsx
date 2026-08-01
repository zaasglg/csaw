import type { Metadata } from "next"

import { prisma } from "@/lib/prisma"

import { dateFormatter, EmptyState, SectionTitle } from "../AdminUi"
import { VolunteerActions } from "./VolunteerActions"

export const metadata: Metadata = {
  title: "Заявки волонтёров · Админ-панель CSAW 2026",
}

export default async function AdminVolunteersPage() {
  const volunteers = await prisma.volunteer.findMany({ orderBy: { createdAt: "desc" } })

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4">
      <SectionTitle count={volunteers.length}>Заявки волонтёров</SectionTitle>

      {volunteers.length === 0 ? (
        <EmptyState>Пока нет заявок волонтёров.</EmptyState>
      ) : (
        <div className="overflow-x-auto border border-accent/20 bg-primary-800/40">
          <table className="w-full min-w-[760px] text-left text-[14px]">
            <thead>
              <tr className="border-b border-accent/20 text-[11px] font-bold uppercase tracking-[0.08em] text-primary-300">
                <th className="px-4 py-3">ФИО</th>
                <th className="px-4 py-3">Категория</th>
                <th className="px-4 py-3">Гражданство / регион</th>
                <th className="px-4 py-3">Телефон</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Дата подачи</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {volunteers.map((volunteer) => (
                <tr key={volunteer.id} className="border-b border-accent/10 last:border-0">
                  <td className="px-4 py-3 font-semibold text-primary-50">
                    {[volunteer.surname, volunteer.firstName, volunteer.patronymic]
                      .filter(Boolean)
                      .join(" ")}
                  </td>
                  <td className="px-4 py-3 text-primary-200">{volunteer.category}</td>
                  <td className="px-4 py-3 text-primary-200">
                    {volunteer.citizenship} · {volunteer.region}
                  </td>
                  <td className="px-4 py-3 text-primary-200">{volunteer.phone}</td>
                  <td className="px-4 py-3 text-primary-200">{volunteer.email}</td>
                  <td className="px-4 py-3 text-primary-300">
                    {dateFormatter.format(volunteer.createdAt)}
                  </td>
                  <td className="px-4 py-3">
                    <VolunteerActions
                      volunteer={{
                        id: volunteer.id,
                        surname: volunteer.surname,
                        firstName: volunteer.firstName,
                        patronymic: volunteer.patronymic,
                        birthDate: volunteer.birthDate.toISOString().slice(0, 10),
                        citizenship: volunteer.citizenship,
                        country: volunteer.country,
                        region: volunteer.region,
                        category: volunteer.category,
                        infoLanguage: volunteer.infoLanguage,
                        phone: volunteer.phone,
                        email: volunteer.email,
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
