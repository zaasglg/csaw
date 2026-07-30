import { NextResponse } from "next/server"
import { z } from "zod"

import { isAdminAuthenticated } from "@/lib/adminAuth"
import { prisma } from "@/lib/prisma"
import { saveSpeakerAvatar } from "@/lib/uploads"

const speakerFieldsSchema = z.object({
  name: z.string().trim().min(1).max(200),
  role: z.string().trim().min(1).max(200),
  organization: z.string().trim().min(1).max(200),
  bio: z.string().trim().max(2000).optional(),
  order: z.coerce.number().int().default(0),
})

export async function POST(request: Request) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const formData = await request.formData().catch(() => null)
  if (!formData) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 })
  }

  const parsed = speakerFieldsSchema.safeParse({
    name: formData.get("name"),
    role: formData.get("role"),
    organization: formData.get("organization"),
    bio: formData.get("bio") || undefined,
    order: formData.get("order") || 0,
  })
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 })
  }

  const avatarFile = formData.get("avatar")
  let avatarUrl: string | undefined
  if (avatarFile instanceof File && avatarFile.size > 0) {
    try {
      avatarUrl = await saveSpeakerAvatar(avatarFile)
    } catch {
      return NextResponse.json({ error: "invalid_avatar" }, { status: 400 })
    }
  }

  try {
    const speaker = await prisma.speaker.create({
      data: { ...parsed.data, avatarUrl },
    })
    return NextResponse.json({ id: speaker.id }, { status: 201 })
  } catch (error) {
    console.error("Failed to create speaker", error)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}
