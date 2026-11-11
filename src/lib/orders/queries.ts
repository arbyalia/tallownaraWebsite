import config from '@payload-config'
import { getPayload } from 'payload'

import type { Order } from '@/payload-types'

import { lastFourDigits } from '../phone'
import type { PublicOrder } from '../shop-types'
import { normalizeOrderCode } from './code'
import { expireOverdueOrders } from './service'

function toPublicOrder(order: Order): PublicOrder {
  return {
    code: order.code,
    status: order.status,
    createdAt: order.createdAt,
    expiresAt: order.expiresAt,
    items: order.items.map(({ name, quantity, unitPrice }) => ({ name, quantity, unitPrice })),
    subtotal: order.subtotal,
    shippingCost: order.shippingCost,
    total: order.total,
    courierName: order.courierName,
    serviceName: order.serviceName,
    trackingNumber: order.trackingNumber ?? null,
    areaLabel: order.areaLabel,
    paymentUrl: order.status === 'menunggu_pembayaran' ? (order.paymentUrl ?? null) : null,
    history: (order.statusHistory ?? []).map(({ status, at }) => ({ status, at })),
  }
}

async function findByCode(code: string): Promise<Order | null> {
  const payload = await getPayload({ config })
  await expireOverdueOrders(payload)
  const { docs } = await payload.find({
    collection: 'orders',
    where: { code: { equals: code } },
    depth: 0,
    limit: 1,
  })
  return docs[0] ?? null
}

export async function getOrderByToken(code: string, token: string): Promise<PublicOrder | null> {
  const order = await findByCode(code)
  return order && order.accessToken === token ? toPublicOrder(order) : null
}

export async function trackOrder(rawCode: string, lastFour: string): Promise<PublicOrder | null> {
  const order = await findByCode(normalizeOrderCode(rawCode))
  return order && lastFourDigits(order.customerPhone) === lastFour ? toPublicOrder(order) : null
}

export async function getOrdersForPhone(phone: string): Promise<PublicOrder[]> {
  const payload = await getPayload({ config })
  await expireOverdueOrders(payload)
  const { docs } = await payload.find({
    collection: 'orders',
    where: { customerPhone: { equals: phone } },
    sort: '-createdAt',
    depth: 0,
    limit: 50,
  })
  return docs.map(toPublicOrder)
}
