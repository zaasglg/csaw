import type { Metadata } from "next"
import Image from "next/image"

import { prisma } from "@/lib/prisma"

import { EmptyState, SectionTitle } from "../AdminUi"
import { SpeakerCreateButton } from "./SpeakerCreateButton"
import { SpeakerRowActions } from "./SpeakerRowActions"

export const metadata: Metadata = {
  title: "Спикеры · Админ-панель CSAW 2026",
}

export default async function AdminSpeakersPage() {
  const speakers = await prisma.speaker.findMany({
    orderBy: [{ order: "asc" }, { createdAt: "asc" }],
  })

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <SectionTitle count={speakers.length}>Спикеры</SectionTitle>
        <SpeakerCreateButton />
      </div>

      {speakers.length === 0 ? (
        <EmptyState>
          Пока нет спикеров. Добавьте первого - он сразу появится на главной странице.
        </EmptyState>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {speakers.map((speaker) => (
            <div key={speaker.id} className="border border-accent/20 bg-primary-800/40">
              <div className="relative aspect-[4/5] overflow-hidden bg-primary-900/60">
                {speaker.avatarUrl ? (
                  <Image
                    src={speaker.avatarUrl}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid size-full place-items-center text-[13px] text-primary-500">
                    Нет фото
                  </div>
                )}
              </div>
              <div className="flex items-start justify-between gap-3 p-4">
                <div className="min-w-0">
                  <p className="truncate text-[15px] font-bold text-primary-50">{speaker.name}</p>
                  <p className="mt-1 text-[13px] text-primary-300">
                    {speaker.role}, {speaker.organization}
                  </p>
                  <p className="mt-1 text-[11px] text-primary-500">Порядок: {speaker.order}</p>
                </div>
                <SpeakerRowActions
                  speaker={{
                    id: speaker.id,
                    name: speaker.name,
                    role: speaker.role,
                    organization: speaker.organization,
                    bio: speaker.bio,
                    avatarUrl: speaker.avatarUrl,
                    order: speaker.order,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
