import { z } from "zod"

import type { Locale } from "@/components/providers/LocaleProvider"

export const speakerFieldsSchema = z.object({
  nameKk: z.string().trim().min(1).max(300),
  nameRu: z.string().trim().min(1).max(300),
  nameEn: z.string().trim().min(1).max(300),
  roleKk: z.string().trim().min(1).max(300),
  roleRu: z.string().trim().min(1).max(300),
  roleEn: z.string().trim().min(1).max(300),
  organizationKk: z.string().trim().min(1).max(300),
  organizationRu: z.string().trim().min(1).max(300),
  organizationEn: z.string().trim().min(1).max(300),
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
  avatarUrl: string | null
  order: number
}

export type LocalizedSpeaker = {
  id: string
  name: string
  role: string
  organization: string
  avatarUrl: string | null
  order: number
}

const FIELD_LABELS: Record<string, string> = {
  nameKk: "Имя (ҚАЗ)",
  nameRu: "Имя (РУС)",
  nameEn: "Имя (ENG)",
  roleKk: "Должность (ҚАЗ)",
  roleRu: "Должность (РУС)",
  roleEn: "Должность (ENG)",
  organizationKk: "Организация (ҚАЗ)",
  organizationRu: "Организация (РУС)",
  organizationEn: "Организация (ENG)",
  order: "Порядок",
}

function formText(formData: FormData, key: string): string {
  const value = formData.get(key)
  return typeof value === "string" ? value : ""
}

export function parseSpeakerFormData(formData: FormData) {
  return speakerFieldsSchema.safeParse({
    nameKk: formText(formData, "nameKk"),
    nameRu: formText(formData, "nameRu"),
    nameEn: formText(formData, "nameEn"),
    roleKk: formText(formData, "roleKk"),
    roleRu: formText(formData, "roleRu"),
    roleEn: formText(formData, "roleEn"),
    organizationKk: formText(formData, "organizationKk"),
    organizationRu: formText(formData, "organizationRu"),
    organizationEn: formText(formData, "organizationEn"),
    order: formText(formData, "order") || "0",
  })
}

export function formatSpeakerValidationError(error: z.ZodError): string {
  const labels = error.issues.map((issue) => {
    const key = String(issue.path[0] ?? "")
    return FIELD_LABELS[key] ?? key
  })
  const unique = [...new Set(labels.filter(Boolean))]
  if (unique.length === 0) {
    return "Проверьте заполнение полей спикера"
  }
  return `Ошибка в полях: ${unique.join(", ")}`
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
    avatarUrl: speaker.avatarUrl,
    order: speaker.order,
  }
}
