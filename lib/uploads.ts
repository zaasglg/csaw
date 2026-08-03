import { randomUUID } from "crypto"
import { mkdir, unlink, writeFile } from "fs/promises"
import path from "path"

const ALLOWED_MIME_TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
}
const ALLOWED_EXTENSIONS = new Set(Object.values(ALLOWED_MIME_TYPES))
const CONTENT_TYPES_BY_EXT: Record<string, string> = {
  jpg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
}
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024
const SPEAKER_FILENAME_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp)$/i

export function getSpeakersUploadDir(): string {
  if (process.env.UPLOADS_DIR) {
    return path.resolve(process.env.UPLOADS_DIR)
  }
  return path.join(process.cwd(), "data", "uploads", "speakers")
}

export function isValidSpeakerAvatarFilename(fileName: string): boolean {
  return SPEAKER_FILENAME_RE.test(fileName)
}

export function getSpeakerAvatarContentType(fileName: string): string | null {
  const extension = path.extname(fileName).slice(1).toLowerCase()
  if (!ALLOWED_EXTENSIONS.has(extension)) return null
  return CONTENT_TYPES_BY_EXT[extension] ?? null
}

export function resolveSpeakerAvatarPath(fileName: string): string | null {
  if (!isValidSpeakerAvatarFilename(fileName)) return null
  const uploadDir = getSpeakersUploadDir()
  const resolved = path.resolve(uploadDir, fileName)
  if (!resolved.startsWith(uploadDir + path.sep)) return null
  return resolved
}

export async function saveSpeakerAvatar(file: File): Promise<string> {
  const extension = ALLOWED_MIME_TYPES[file.type]
  if (!extension) {
    throw new Error("unsupported_file_type")
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("file_too_large")
  }

  const uploadDir = getSpeakersUploadDir()
  await mkdir(uploadDir, { recursive: true })

  const fileName = `${randomUUID()}.${extension}`
  const buffer = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(uploadDir, fileName), buffer)

  return `/uploads/speakers/${fileName}`
}

export async function deleteSpeakerAvatar(avatarUrl: string | null): Promise<void> {
  if (!avatarUrl || !avatarUrl.startsWith("/uploads/speakers/")) return

  const fileName = path.basename(avatarUrl)
  const filePath = resolveSpeakerAvatarPath(fileName)
  if (!filePath) return

  await unlink(filePath).catch(() => {})
}
