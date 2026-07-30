import { NextResponse } from "next/server"
import { z } from "zod"

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

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = teamSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 })
  }

  const { members, ...team } = parsed.data

  try {
    const created = await prisma.hackathonTeam.create({
      data: {
        ...team,
        members: {
          create: members.map((member, index) => ({ ...member, position: index })),
        },
      },
    })
    return NextResponse.json({ id: created.id }, { status: 201 })
  } catch (error) {
    console.error("Failed to create hackathon team", error)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}
