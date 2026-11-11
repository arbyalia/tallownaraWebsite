'use server'

import config from '@payload-config'
import { cookies } from 'next/headers'
import { getPayload } from 'payload'
import { z } from 'zod'

import { sendEmail } from './integrations/email'
import { isMockPayment } from './integrations/payment'
import { midtransSignature } from './integrations/payment/midtrans-signature'
import { MOCK_SERVER_KEY, createMockPaymentAdapter } from './integrations/payment/mock'
import { getShippingAdapter } from './integrations/shipping'
import type { ShippingArea, ShippingRate } from './integrations/shipping/types'
import { sendWhatsapp } from './integrations/whatsapp'
import { getOrderByToken, getOrdersForPhone, trackOrder } from './orders/queries'
import { priceItems } from './orders/pricing'
import { checkoutSchema } from './orders/schema'
import { applyPaymentNotification, createOrder, type CreateOrderResult } from './orders/service'
import {
  generateOtp,
  hashOtp,
  HISTORY_SESSION_MS,
  OTP_MAX_ATTEMPTS,
  OTP_MAX_PER_HOUR,
  OTP_RESEND_MS,
  OTP_TTL_MS,
  readSession,
  signSession,
  verifyOtpHash,
} from './otp'
import { normalizePhone } from './phone'
import type { PublicOrder } from './shop-types'

const SESSION_COOKIE = 'riwayat_sesi'

export async function searchAreasAction(
  query: string,
): Promise<{ ok: true; areas: ShippingArea[] } | { ok: false }> {
  try {
    return { ok: true, areas: await getShippingAdapter().searchAreas(query.slice(0, 80)) }
  } catch (error) {
    console.error('Pencarian area gagal', error)
    return { ok: false }
  }
}

const rateRequestSchema = z.object({
  areaId: z.string().min(1),
  items: z.array(z.object({ productId: z.number().int(), quantity: z.number().int() })).min(1),
})

export async function getRatesAction(
  input: z.infer<typeof rateRequestSchema>,
): Promise<{ ok: true; rates: ShippingRate[] } | { ok: false; message: string }> {
  const parsed = rateRequestSchema.safeParse(input)
  if (!parsed.success) return { ok: false, message: 'Data pengiriman belum lengkap.' }

  try {
    const payload = await getPayload({ config })
    const { docs } = await payload.find({
      collection: 'products',
      where: { id: { in: parsed.data.items.map((item) => item.productId) } },
      pagination: false,
      depth: 0,
    })
    const priced = priceItems(
      parsed.data.items,
      docs.map((doc) => ({ ...doc, isVisible: doc.isVisible ?? false })),
    )
    if (!priced.ok) return priced

    const rates = await getShippingAdapter().getRates({
      destinationAreaId: parsed.data.areaId,
      weightGrams: priced.totalWeightGrams,
      itemValue: priced.subtotal,
    })
    return { ok: true, rates }
  } catch (error) {
    console.error('Ongkir gagal dimuat', error)
    return { ok: false, message: 'Ongkir belum bisa dimuat.' }
  }
}

export async function placeOrderAction(input: unknown): Promise<CreateOrderResult> {
  const parsed = checkoutSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, message: parsed.error.issues[0]?.message ?? 'Periksa kembali data Anda.' }
  }
  try {
    return await createOrder(parsed.data)
  } catch (error) {
    console.error('Pesanan gagal dibuat', error)
    return { ok: false, message: 'Pesanan belum bisa dibuat. Data Anda aman, silakan coba lagi.' }
  }
}

export async function simulatePaymentAction(code: string, token: string): Promise<{ ok: boolean }> {
  if (!isMockPayment()) return { ok: false }
  const order = await getOrderByToken(code, token)
  if (!order) return { ok: false }

  const body = {
    order_id: code,
    status_code: '200',
    gross_amount: `${order.total}.00`,
    transaction_id: `simulasi-${code}`,
    transaction_status: 'settlement',
    signature_key: midtransSignature(code, '200', `${order.total}.00`, MOCK_SERVER_KEY),
  }
  const notification = createMockPaymentAdapter().parseNotification(body)
  if (!notification) return { ok: false }
  await applyPaymentNotification(notification, 'mock')
  return { ok: true }
}

export type TrackState = { status: 'idle' | 'not_found' | 'error' | 'found'; order?: PublicOrder }

const trackSchema = z.object({
  code: z.string().trim().min(6),
  lastFour: z.string().regex(/^\d{4}$/),
})

export async function trackOrderAction(_previous: TrackState, formData: FormData): Promise<TrackState> {
  const parsed = trackSchema.safeParse({ code: formData.get('code'), lastFour: formData.get('lastFour') })
  if (!parsed.success) return { status: 'not_found' }
  try {
    const order = await trackOrder(parsed.data.code, parsed.data.lastFour)
    return order ? { status: 'found', order } : { status: 'not_found' }
  } catch (error) {
    console.error('Lacak pesanan gagal', error)
    return { status: 'error' }
  }
}

export type OtpRequestResult = { ok: true; phone: string } | { ok: false; message: string }

export async function requestOtpAction(rawPhone: string): Promise<OtpRequestResult> {
  const phone = normalizePhone(rawPhone)
  if (!phone) return { ok: false, message: 'Isi nomor WhatsApp aktif, contoh: 0812 3456 7890.' }

  try {
    const payload = await getPayload({ config })
    const now = Date.now()
    const { docs: recent } = await payload.find({
      collection: 'otp-codes',
      where: {
        and: [
          { phone: { equals: phone } },
          { createdAt: { greater_than: new Date(now - 3_600_000).toISOString() } },
        ],
      },
      sort: '-createdAt',
      limit: OTP_MAX_PER_HOUR,
      depth: 0,
    })

    if (recent.length >= OTP_MAX_PER_HOUR) {
      return { ok: false, message: 'Batas 5 kode per jam tercapai. Coba lagi satu jam kemudian.' }
    }
    if (recent[0] && now - new Date(recent[0].createdAt).getTime() < OTP_RESEND_MS) {
      return { ok: false, message: 'Tunggu 60 detik sebelum meminta kode baru.' }
    }

    const { docs: orders } = await payload.find({
      collection: 'orders',
      where: { customerPhone: { equals: phone } },
      limit: 1,
      depth: 0,
    })

    const code = generateOtp()
    await payload.create({
      collection: 'otp-codes',
      data: { phone, codeHash: hashOtp(phone, code), expiresAt: new Date(now + OTP_TTL_MS).toISOString(), attempts: 0 },
    })

    const order = orders[0]
    if (order) {
      try {
        await sendWhatsapp({ to: phone, template: 'kode_otp', params: [code] })
      } catch (error) {
        console.error('OTP WhatsApp gagal, memakai email', error)
        await sendEmail({
          to: order.customerEmail,
          subject: 'Kode masuk Riwayat pesanan',
          text: `Kode Anda ${code}. Berlaku 5 menit.`,
        })
      }
    }
    return { ok: true, phone }
  } catch (error) {
    console.error('OTP gagal dibuat', error)
    return { ok: false, message: 'Kode belum bisa dikirim. Coba lagi beberapa saat.' }
  }
}

export async function verifyOtpAction(
  phone: string,
  code: string,
): Promise<{ ok: true } | { ok: false; message: string }> {
  const invalid = { ok: false as const, message: 'Kode salah atau sudah kedaluwarsa. Periksa lalu coba lagi.' }
  if (!/^\d{6}$/.test(code)) return { ok: false, message: 'Kode terdiri dari 6 angka.' }

  const payload = await getPayload({ config })
  const { docs } = await payload.find({
    collection: 'otp-codes',
    where: { and: [{ phone: { equals: phone } }, { consumedAt: { exists: false } }] },
    sort: '-createdAt',
    limit: 1,
    depth: 0,
  })
  const record = docs[0]
  if (!record || new Date(record.expiresAt).getTime() < Date.now() || record.attempts >= OTP_MAX_ATTEMPTS) {
    return invalid
  }

  if (!verifyOtpHash(phone, code, record.codeHash)) {
    await payload.update({ collection: 'otp-codes', id: record.id, data: { attempts: record.attempts + 1 } })
    return invalid
  }

  await payload.update({ collection: 'otp-codes', id: record.id, data: { consumedAt: new Date().toISOString() } })
  const cookieStore = await cookies()
  cookieStore.set(SESSION_COOKIE, signSession(phone), {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: HISTORY_SESSION_MS / 1000,
    path: '/',
  })
  return { ok: true }
}

export async function getHistorySession(): Promise<string | null> {
  const cookieStore = await cookies()
  return readSession(cookieStore.get(SESSION_COOKIE)?.value)
}

export async function getHistoryOrders(): Promise<PublicOrder[] | null> {
  const phone = await getHistorySession()
  return phone ? getOrdersForPhone(phone) : null
}

export async function endHistorySession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}

const reviewSchema = z.object({
  productId: z.number().int().positive(),
  authorName: z.string().trim().min(2, 'Isi nama Anda, minimal 2 huruf.').max(80),
  rating: z.number().int().min(1, 'Pilih nilai 1 sampai 5.').max(5, 'Pilih nilai 1 sampai 5.'),
  body: z.string().trim().min(10, 'Tulis ulasan minimal 10 huruf.').max(1000, 'Ulasan maksimal 1.000 huruf.'),
  website: z.string().max(0),
})

export type ReviewResult = { ok: true } | { ok: false; errors: Record<string, string> }

export async function submitReviewAction(input: unknown): Promise<ReviewResult> {
  const parsed = reviewSchema.safeParse(input)
  if (!parsed.success) {
    return {
      ok: false,
      errors: Object.fromEntries(parsed.error.issues.map((issue) => [String(issue.path[0]), issue.message])),
    }
  }
  try {
    const payload = await getPayload({ config })
    const { productId, authorName, rating, body } = parsed.data
    await payload.create({
      collection: 'reviews',
      data: { product: productId, authorName, rating, body, status: 'menunggu' },
    })
    return { ok: true }
  } catch (error) {
    console.error('Ulasan gagal disimpan', error)
    return { ok: false, errors: { form: 'Ulasan belum bisa dikirim. Coba lagi beberapa saat.' } }
  }
}
