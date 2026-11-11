import { createHash, timingSafeEqual } from 'node:crypto'

import { z } from 'zod'

import type { PaymentNotification, PaymentState } from './types'

const notificationSchema = z.object({
  order_id: z.string(),
  status_code: z.string(),
  gross_amount: z.string(),
  signature_key: z.string(),
  transaction_id: z.string(),
  transaction_status: z.string(),
  fraud_status: z.string().optional(),
})

export function midtransSignature(
  orderId: string,
  statusCode: string,
  grossAmount: string,
  serverKey: string,
): string {
  return createHash('sha512').update(orderId + statusCode + grossAmount + serverKey).digest('hex')
}

function mapState(status: string, fraudStatus: string | undefined): PaymentState {
  if (status === 'settlement') return 'paid'
  if (status === 'capture') return fraudStatus === 'accept' ? 'paid' : 'pending'
  if (status === 'pending') return 'pending'
  return 'failed'
}

export function parseMidtransNotification(body: unknown, serverKey: string): PaymentNotification | null {
  const parsed = notificationSchema.safeParse(body)
  if (!parsed.success || !serverKey) return null
  const data = parsed.data

  const expected = Buffer.from(
    midtransSignature(data.order_id, data.status_code, data.gross_amount, serverKey),
  )
  const received = Buffer.from(data.signature_key)
  if (expected.length !== received.length || !timingSafeEqual(expected, received)) return null

  return {
    eventId: `${data.transaction_id}:${data.transaction_status}`,
    orderCode: data.order_id,
    grossAmount: Math.round(Number(data.gross_amount)),
    state: mapState(data.transaction_status, data.fraud_status),
  }
}
