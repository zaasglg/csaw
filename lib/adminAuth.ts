import { createHmac, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"

export const ADMIN_SESSION_COOKIE = "csaw_admin_session"
export const ADMIN_SESSION_MAX_AGE_SECONDS = 8 * 60 * 60

function getSessionSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET
  if (!secret) {
    throw new Error("ADMIN_SESSION_SECRET is not set")
  }
  return secret
}

function sign(payload: string): string {
  return createHmac("sha256", getSessionSecret()).update(payload).digest("hex")
}

function timingSafeEqualStrings(a: string, b: string): boolean {
  const aBuffer = Buffer.from(a)
  const bBuffer = Buffer.from(b)
  if (aBuffer.length !== bBuffer.length) return false
  return timingSafeEqual(aBuffer, bBuffer)
}

export function createSessionToken(): string {
  const expiresAt = String(Date.now() + ADMIN_SESSION_MAX_AGE_SECONDS * 1000)
  return `${expiresAt}.${sign(expiresAt)}`
}

export function verifySessionToken(token: string | undefined): boolean {
  if (!token) return false

  const [expiresAt, signature] = token.split(".")
  if (!expiresAt || !signature) return false
  if (!timingSafeEqualStrings(signature, sign(expiresAt))) return false

  const expiresAtMs = Number(expiresAt)
  return Number.isFinite(expiresAtMs) && Date.now() < expiresAtMs
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const cookieStore = await cookies()
  return verifySessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)
}

export function verifyAdminCredentials(username: string, password: string): boolean {
  const expectedUsername = process.env.ADMIN_USERNAME
  const expectedPassword = process.env.ADMIN_PASSWORD
  if (!expectedUsername || !expectedPassword) return false

  return (
    timingSafeEqualStrings(username, expectedUsername) &&
    timingSafeEqualStrings(password, expectedPassword)
  )
}
