import { z } from "zod"

import type { Locale } from "@/components/providers/LocaleProvider"

export const speakerFieldsSchema = z.object({
  nameKk: z.string().trim().min(1).max(200),
  nameRu: z.string().trim().min(1).max(200),
  nameEn: z.string().trim().min(1).max(200),
  roleKk: z.string().trim().min(1).max(200),
  roleRu: z.string().trim().min(1).max(200),
  roleEn: z.string().trim().min(1).max(200),
  organizationKk: z.string().trim().min(1).max(200),
  organizationRu: z.string().trim().min(1).max(200),
  organizationEn: z.string().trim().min(1).max(200),
  bioKk: z.string().trim().max(2000).optional(),
  bioRu: z.string().trim().max(2000).optional(),
  bioEn: z.string().trim().max(2000).optional(),
  order: z.coerce.number().int().default(0),
})

export type SpeakerFields = z.infer<typeof speakerFieldsSchema>

export type SpeakerRecord = {
  id: string
  nameKk: string
  nameRu: string
  nameEn: string
  roleKk: string
  roleRu: string
  roleEn: string
  organizationKk: string
  organizationRu: string
  organizationEn: string
  bioKk: string | null
  bioRu: string | null
  bioEn: string | null
  avatarUrl: string | null
  order: number
}

export type LocalizedSpeaker = {
  id: string
  name: string
  role: string
  organization: string
  bio: string | null
  avatarUrl: string | null
  order: number
}

export function parseSpeakerFormData(formData: FormData) {
  return speakerFieldsSchema.safeParse({
    nameKk: formData.get("nameKk"),
    nameRu: formData.get("nameRu"),
    nameEn: formData.get("nameEn"),
    roleKk: formData.get("roleKk"),
    roleRu: formData.get("roleRu"),
    roleEn: formData.get("roleEn"),
    organizationKk: formData.get("organizationKk"),
    organizationRu: formData.get("organizationRu"),
    organizationEn: formData.get("organizationEn"),
    bioKk: formData.get("bioKk") || undefined,
    bioRu: formData.get("bioRu") || undefined,
    bioEn: formData.get("bioEn") || undefined,
    order: formData.get("order") || 0,
  })
}

export function localizeSpeaker(
  speaker: SpeakerRecord,
  locale: Locale,
): LocalizedSpeaker {
  const pick = <T extends string | null>(kk: T, ru: T, en: T): T => {
    if (locale === "ru") return ru || kk || en
    if (locale === "en") return en || kk || ru
    return kk || ru || en
  }

  return {
    id: speaker.id,
    name: pick(speaker.nameKk, speaker.nameRu, speaker.nameEn),
    role: pick(speaker.roleKk, speaker.roleRu, speaker.roleEn),
    organization: pick(
      speaker.organizationKk,
      speaker.organizationRu,
      speaker.organizationEn,
    ),
    bio: pick(speaker.bioKk, speaker.bioRu, speaker.bioEn),
    avatarUrl: speaker.avatarUrl,
    order: speaker.order,
  }
}
