import { parseMidtransNotification } from './midtrans-signature'
import type { PaymentAdapter } from './types'

/** Kunci khusus simulasi lokal. Bukan rahasia dan tidak berlaku di produksi. */
export const MOCK_SERVER_KEY = 'simulasi-lokal'

export function createMockPaymentAdapter(): PaymentAdapter {
  return {
    name: 'mock',
    async createPayment({ orderCode, accessToken }) {
      return {
        token: `mock-${orderCode}`,
        redirectUrl: `/bayar-simulasi/${orderCode}?t=${accessToken}`,
      }
    },
    parseNotification: (body) => parseMidtransNotification(body, MOCK_SERVER_KEY),
  }
}
