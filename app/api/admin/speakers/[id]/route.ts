import { NextResponse } from "next/server"
import { z } from "zod"

import { isAdminAuthenticated } from "@/lib/adminAuth"
import { prisma } from "@/lib/prisma"
import { deleteSpeakerAvatar, saveSpeakerAvatar } from "@/lib/uploads"

const speakerFieldsSchema = z.object({
  name: z.string().trim().min(1).max(200),
  role: z.string().trim().min(1).max(200),
  organization: z.string().trim().min(1).max(200),
  bio: z.string().trim().max(2000).optional(),
  order: z.coerce.number().int().default(0),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const { id } = await params
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

  const existing = await prisma.speaker.findUnique({ where: { id } })
  if (!existing) {
    return NextResponse.json({ error: "not_found" }, { status: 404 })
  }

  const avatarFile = formData.get("avatar")
  let avatarUrl = existing.avatarUrl
  if (avatarFile instanceof File && avatarFile.size > 0) {
    try {
      avatarUrl = await saveSpeakerAvatar(avatarFile)
    } catch {
      return NextResponse.json({ error: "invalid_avatar" }, { status: 400 })
    }
    await deleteSpeakerAvatar(existing.avatarUrl)
  }

  try {
    await prisma.speaker.update({ where: { id }, data: { ...parsed.data, avatarUrl } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to update speaker", error)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const { id } = await params

  try {
    const speaker = await prisma.speaker.delete({ where: { id } })
    await deleteSpeakerAvatar(speaker.avatarUrl)
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to delete speaker", error)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}
