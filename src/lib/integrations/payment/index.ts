import { createMidtransAdapter } from './midtrans'
import { createMockPaymentAdapter } from './mock'
import type { PaymentAdapter } from './types'

export function isMockPayment(): boolean {
  return process.env.PAYMENT_PROVIDER === 'mock' && process.env.NODE_ENV !== 'production'
}

export function getPaymentAdapter(): PaymentAdapter {
  if (process.env.PAYMENT_PROVIDER === 'mock') {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('PAYMENT_PROVIDER=mock tidak boleh dipakai di produksi')
    }
    return createMockPaymentAdapter()
  }
  return createMidtransAdapter()
}
