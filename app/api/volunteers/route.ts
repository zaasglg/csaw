import { NextResponse } from "next/server"
import { z } from "zod"

import { Prisma } from "@/lib/generated/prisma/client"
import { prisma } from "@/lib/prisma"

const volunteerSchema = z.object({
  surname: z.string().trim().min(1).max(200),
  firstName: z.string().trim().min(1).max(200),
  patronymic: z.string().trim().max(200).optional(),
  birthDate: z.coerce.date(),
  citizenship: z.string().trim().min(1).max(120),
  country: z.string().trim().min(1).max(120),
  region: z.string().trim().min(1).max(200),
  category: z.string().trim().min(1).max(120),
  infoLanguage: z.enum(["kk", "ru", "en"]).optional(),
  phone: z.string().trim().min(1).max(40),
  email: z.string().trim().toLowerCase().email().max(200),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = volunteerSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_input" }, { status: 400 })
  }

  try {
    const volunteer = await prisma.volunteer.create({ data: parsed.data })
    return NextResponse.json({ id: volunteer.id }, { status: 201 })
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "email_taken" }, { status: 409 })
    }
    console.error("Failed to create volunteer", error)
    return NextResponse.json({ error: "server_error" }, { status: 500 })
  }
}
