import { NextResponse } from "next/server"
import { z } from "zod"

import { isAdminAuthenticated } from "@/lib/adminAuth"
import { MAX_HACKATHON_TEAM_MEMBERS } from "@/lib/constants"
import { prisma } from "@/lib/prisma"

const memberSchema = z.object({
  fullName: z.string().trim().min(1).max(200),
  countryNationality: z.string().trim().min(1).max(200),
  organization: z.string().trim().min(1).max(200),
  specialty: z.string().trim().min(1).max(200),
})

const teamSchema = z.object({
  teamName: z.string().trim().min(1).max(200),
  country: z.string().trim().min(1).max(120),
  region: z.string().trim().min(1).max(200),
  captainName: z.string().trim().min(1).max(200),
  members: z.array(memberSchema).min(1).max(MAX_HACKATHON_TEAM_MEMBERS),
})

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  if (!(await isAdminAuthenticated())) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 })
  }

  const { id } = await params
  const body = await request.json().catch(() => null)
  const parsed = teamSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 })
  }

  const { members, ...team } = parsed.data

  try {
    await prisma.$transaction([
      prisma.hackathonTeamMember.deleteMany({ where: { teamId: id } }),
      prisma.hackathonTeam.update({
        where: { id },
        data: {
          ...team,
          members: {
            create: members.map((member, index) => ({ ...member, position: index })),
          },
        },
      }),
    ])
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to update hackathon team", error)
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
    await prisma.hackathonTeam.delete({ where: { id } })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("Failed to delete hackathon team", error)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}
