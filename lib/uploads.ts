import { randomUUID } from "crypto"
import { mkdir, unlink, writeFile } from "fs/promises"
import path from "path"

const SPEAKERS_UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "speakers")
const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024

export async function saveSpeakerAvatar(file: File): Promise<string> {
  const extension = ALLOWED_MIME_TYPES[file.type]
  if (!extension) {
    throw new Error("unsupported_file_type")
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("file_too_large")
  }

  await mkdir(SPEAKERS_UPLOAD_DIR, { recursive: true })

  const fileName = `${randomUUID()}.${extension}`
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(SPEAKERS_UPLOAD_DIR, fileName), buffer)

  return `/uploads/speakers/${fileName}`
}

export async function deleteSpeakerAvatar(avatarUrl: string | null): Promise<void> {
  if (!avatarUrl || !avatarUrl.startsWith("/uploads/speakers/")) return

  const fileName = path.basename(avatarUrl)
  await unlink(path.join(SPEAKERS_UPLOAD_DIR, fileName)).catch(() => {})
}
