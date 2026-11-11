import { createHmac, randomInt, timingSafeEqual } from 'node:crypto'

export const OTP_TTL_MS = 5 * 60_000
export const OTP_RESEND_MS = 60_000
export const OTP_MAX_PER_HOUR = 5
export const OTP_MAX_ATTEMPTS = 5
export const HISTORY_SESSION_MS = 30 * 60_000

function secret(): string {
  const value = process.env.OTP_HASH_SECRET
  if (!value) throw new Error('OTP_HASH_SECRET belum diisi')
  return value
}

function hmac(value: string): string {
  return createHmac('sha256', secret()).update(value).digest('hex')
}

function safeEqual(a: string, b: string): boolean {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

export function generateOtp(): string {
  return String(randomInt(0, 1_000_000)).padStart(6, '0')
}

export function hashOtp(phone: string, code: string): string {
  return hmac(`otp:${phone}:${code}`)
}

export function verifyOtpHash(phone: string, code: string, hash: string): boolean {
  return safeEqual(hashOtp(phone, code), hash)
}

export function signSession(phone: string, now = Date.now()): string {
  const payload = `${phone}.${now + HISTORY_SESSION_MS}`
  return `${payload}.${hmac(`sesi:${payload}`)}`
}

export function readSession(token: string | undefined, now = Date.now()): string | null {
  if (!token) return null
  const [phone, expires, signature] = token.split('.')
  if (!phone || !expires || !signature) return null
  if (!safeEqual(hmac(`sesi:${phone}.${expires}`), signature)) return null
  return Number(expires) > now ? phone : null
}
