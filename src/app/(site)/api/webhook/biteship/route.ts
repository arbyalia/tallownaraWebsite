import { createHash, timingSafeEqual } from 'node:crypto'

import config from '@payload-config'
import { NextResponse } from 'next/server'
import { getPayload } from 'payload'
import { z } from 'zod'

import { canTransition, type OrderStatus } from '@/lib/orders/status'

const bodySchema = z.object({
  order_id: z.string(),
  status: z.string(),
  courier_waybill_id: z.string().optional(),
  updated_at: z.string().optional(),
  reference_id: z.string().optional(),
})

const STATUS_MAP: Record<string, OrderStatus> = {
  picked: 'dikirim',
  dropping_off: 'dikirim',
  delivered: 'selesai',
  returned: 'dikembalikan',
}

function isAuthorized(request: Request): boolean {
  const secret = process.env.BITESHIP_WEBHOOK_SECRET
  const received = request.headers.get('x-webhook-secret')
  if (!secret || !received) return false
  const a = Buffer.from(secret)
  const b = Buffer.from(received)
  return a.length === b.length && timingSafeEqual(a, b)
}

export async function POST(request: Request) {
  if (!isAuthorized(request)) return NextResponse.json({ error: 'Tidak sah' }, { status: 403 })

  const parsed = bodySchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ error: 'Data tidak dikenal' }, { status: 400 })
  const { order_id, status, courier_waybill_id, updated_at, reference_id } = parsed.data

  const payload = await getPayload({ config })
  const eventId = `biteship:${createHash('sha256').update(`${order_id}:${status}:${updated_at ?? ''}`).digest('hex')}`
  const { totalDocs } = await payload.count({ collection: 'webhook-events', where: { eventId: { equals: eventId } } })
  if (totalDocs > 0) return NextResponse.json({ outcome: 'duplicate' })
  await payload.create({ collection: 'webhook-events', data: { eventId, source: 'biteship' } })

  const nextStatus = STATUS_MAP[status]
  if (!nextStatus || !reference_id) return NextResponse.json({ outcome: 'ignored' })

  const { docs } = await payload.find({
    collection: 'orders',
    where: { code: { equals: reference_id } },
    limit: 1,
    depth: 0,
  })
  const order = docs[0]
  if (!order || !canTransition(order.status, nextStatus)) return NextResponse.json({ outcome: 'ignored' })

  await payload.update({
    collection: 'orders',
    id: order.id,
    data: { status: nextStatus, trackingNumber: courier_waybill_id ?? order.trackingNumber },
  })
  return NextResponse.json({ outcome: 'processed' })
}
