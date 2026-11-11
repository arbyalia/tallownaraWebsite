import { randomBytes } from 'node:crypto'

import config from '@payload-config'
import { sql } from '@payloadcms/db-postgres'
import { getPayload, type Payload } from 'payload'

import { getPaymentAdapter } from '../integrations/payment'
import type { PaymentNotification } from '../integrations/payment/types'
import { getShippingAdapter } from '../integrations/shipping'
import { normalizePhone } from '../phone'
import { generateOrderCode } from './code'
import { notifyOrder } from './notify'
import { priceItems } from './pricing'
import type { CheckoutInput } from './schema'

export type CreateOrderResult =
  | { ok: true; code: string; redirectUrl: string }
  | { ok: false; message: string }

function expiryHours(): number {
  const parsed = Number(process.env.ORDER_EXPIRY_HOURS)
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 24
}

export async function expireOverdueOrders(payload: Payload): Promise<void> {
  const { docs } = await payload.find({
    collection: 'orders',
    where: {
      and: [
        { status: { equals: 'menunggu_pembayaran' } },
        { expiresAt: { less_than: new Date().toISOString() } },
      ],
    },
    limit: 50,
    pagination: false,
    depth: 0,
  })
  await Promise.all(
    docs.map((order) =>
      payload.update({ collection: 'orders', id: order.id, data: { status: 'kedaluwarsa' } }),
    ),
  )
}

export async function createOrder(input: CheckoutInput): Promise<CreateOrderResult> {
  const payload = await getPayload({ config })
  await expireOverdueOrders(payload)

  const customerPhone = normalizePhone(input.customerPhone)
  if (!customerPhone) return { ok: false, message: 'Nomor WhatsApp tidak valid.' }

  const { docs: products } = await payload.find({
    collection: 'products',
    where: { id: { in: input.items.map((item) => item.productId) } },
    pagination: false,
    depth: 0,
  })

  const priced = priceItems(
    input.items,
    products.map((product) => ({
      id: product.id,
      name: product.name,
      price: product.price,
      weightGrams: product.weightGrams,
      stock: product.stock,
      isVisible: product.isVisible ?? false,
    })),
  )
  if (!priced.ok) return priced

  const shipping = getShippingAdapter()
  const rates = await shipping.getRates({
    destinationAreaId: input.areaId,
    weightGrams: priced.totalWeightGrams,
    itemValue: priced.subtotal,
  })
  const rate = rates.find(
    (candidate) =>
      candidate.courierCode === input.courierCode && candidate.serviceCode === input.serviceCode,
  )
  if (!rate) {
    return { ok: false, message: 'Layanan kurir yang dipilih sudah tidak tersedia. Pilih layanan lain.' }
  }

  const code = await uniqueOrderCode(payload)
  const accessToken = randomBytes(24).toString('hex')
  const total = priced.subtotal + rate.price
  const hours = expiryHours()

  const order = await payload.create({
    collection: 'orders',
    data: {
      code,
      accessToken,
      status: 'menunggu_pembayaran',
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone,
      addressStreet: input.addressStreet,
      areaLabel: input.areaLabel,
      areaId: input.areaId,
      postalCode: input.postalCode,
      items: priced.items,
      subtotal: priced.subtotal,
      shippingCost: rate.price,
      total,
      shippingProvider: rate.provider,
      courierCode: rate.courierCode,
      courierName: rate.courierName,
      serviceCode: rate.serviceCode,
      serviceName: rate.serviceName,
      expiresAt: new Date(Date.now() + hours * 3_600_000).toISOString(),
    },
  })

  try {
    const adapter = getPaymentAdapter()
    const payment = await adapter.createPayment({
      orderCode: code,
      accessToken,
      grossAmount: total,
      expiryHours: hours,
      customer: { name: input.customerName, email: input.customerEmail, phone: customerPhone },
      items: [
        ...priced.items.map((item) => ({
          id: String(item.productId),
          name: item.name.slice(0, 50),
          price: item.unitPrice,
          quantity: item.quantity,
        })),
        { id: 'ongkir', name: `Ongkir ${rate.courierName}`.slice(0, 50), price: rate.price, quantity: 1 },
      ],
    })

    await payload.update({
      collection: 'orders',
      id: order.id,
      data: { paymentProvider: adapter.name, paymentUrl: payment.redirectUrl },
    })
    await notifyOrder('pesanan_dibuat', order)
    return { ok: true, code, redirectUrl: payment.redirectUrl }
  } catch (error) {
    console.error('Gagal membuat pembayaran', error)
    await payload.update({ collection: 'orders', id: order.id, data: { status: 'dibatalkan' } })
    return { ok: false, message: 'Pembayaran belum bisa dibuat. Data Anda aman, silakan coba lagi.' }
  }
}

async function uniqueOrderCode(payload: Payload): Promise<string> {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const code = generateOrderCode()
    const { totalDocs } = await payload.count({ collection: 'orders', where: { code: { equals: code } } })
    if (totalDocs === 0) return code
  }
  throw new Error('Gagal membuat kode pesanan unik')
}

export type WebhookOutcome = 'processed' | 'duplicate' | 'ignored'

/** Satu-satunya jalur yang menandai pesanan Dibayar. Tanda tangan sudah diperiksa pemanggil. */
export async function applyPaymentNotification(
  notification: PaymentNotification,
  source: string,
): Promise<WebhookOutcome> {
  const payload = await getPayload({ config })
  const transactionID = (await payload.db.beginTransaction()) ?? undefined
  const req = { transactionID, context: { verifiedPayment: true } }

  try {
    const { totalDocs: seen } = await payload.count({
      collection: 'webhook-events',
      where: { eventId: { equals: notification.eventId } },
      req,
    })
    if (seen > 0) {
      if (transactionID) await payload.db.rollbackTransaction(transactionID)
      return 'duplicate'
    }
    await payload.create({
      collection: 'webhook-events',
      data: { eventId: notification.eventId, source },
      req,
    })

    const { docs } = await payload.find({
      collection: 'orders',
      where: { code: { equals: notification.orderCode } },
      limit: 1,
      depth: 0,
      req,
    })
    const order = docs[0]

    let outcome: WebhookOutcome = 'ignored'
    let paidOrder: typeof order | undefined

    if (order?.status === 'menunggu_pembayaran' && notification.state === 'paid') {
      if (notification.grossAmount !== order.total) {
        console.error(`Nominal webhook tidak cocok untuk ${order.code}`)
      } else {
        paidOrder = await payload.update({
          collection: 'orders',
          id: order.id,
          data: { status: 'dibayar', paidAt: new Date().toISOString() },
          req,
          context: req.context,
        })
        const db = ((transactionID && payload.db.sessions?.[transactionID]?.db) || payload.db.drizzle) as {
          execute: (query: unknown) => Promise<unknown>
        }
        for (const item of order.items) {
          await db.execute(
            sql`UPDATE products SET stock = GREATEST(stock - ${item.quantity}, 0) WHERE id = ${item.productId}`,
          )
        }
        outcome = 'processed'
      }
    } else if (order?.status === 'menunggu_pembayaran' && notification.state === 'failed') {
      await payload.update({ collection: 'orders', id: order.id, data: { status: 'kedaluwarsa' }, req })
      outcome = 'processed'
    } else if (order && notification.state === 'paid') {
      console.error(`Pembayaran masuk untuk ${order.code} berstatus ${order.status}, perlu dicek manual`)
    }

    if (transactionID) await payload.db.commitTransaction(transactionID)
    if (paidOrder) await notifyOrder('pembayaran_diterima', paidOrder)
    return outcome
  } catch (error) {
    if (transactionID) await payload.db.rollbackTransaction(transactionID)
    throw error
  }
}
