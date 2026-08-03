import { readFile } from "fs/promises"
import { NextResponse } from "next/server"

import {
  getSpeakerAvatarContentType,
  resolveSpeakerAvatarPath,
} from "@/lib/uploads"

export async function GET(
  _request: Request,
  context: { params: Promise<{ filename: string }> },
) {
  const { filename } = await context.params
  const filePath = resolveSpeakerAvatarPath(filename)
  const contentType = getSpeakerAvatarContentType(filename)

  if (!filePath || !contentType) {
    return new NextResponse("Not Found", { status: 404 })
  }

  try {
    const file = await readFile(filePath)
    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch {
    return new NextResponse("Not Found", { status: 404 })
  }
}
