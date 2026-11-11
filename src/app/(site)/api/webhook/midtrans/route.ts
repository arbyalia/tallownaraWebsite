import { NextResponse } from 'next/server'

import { getPaymentAdapter } from '@/lib/integrations/payment'
import { applyPaymentNotification } from '@/lib/orders/service'

export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null)
  const adapter = getPaymentAdapter()
  const notification = adapter.parseNotification(body)
  if (!notification) return NextResponse.json({ error: 'Tanda tangan tidak sah' }, { status: 403 })

  const outcome = await applyPaymentNotification(notification, adapter.name)
  return NextResponse.json({ outcome })
}
