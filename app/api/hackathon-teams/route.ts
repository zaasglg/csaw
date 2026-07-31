import { NextResponse } from "next/server"
import { z } from "zod"

import { prisma } from "@/lib/prisma"

const teamSchema = z.object({
  teamName: z.string().trim().min(1).max(200),
  country: z.string().trim().min(1).max(120),
  region: z.string().trim().min(1).max(200),
  captainName: z.string().trim().min(1).max(200),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = teamSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 })
  }

  try {
    const created = await prisma.hackathonTeam.create({
      data: parsed.data,
    })
    return NextResponse.json({ id: created.id }, { status: 201 })
  } catch (error) {
    console.error("Failed to create hackathon team", error)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}
