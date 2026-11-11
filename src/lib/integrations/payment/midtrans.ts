import { parseMidtransNotification } from './midtrans-signature'
import type { CreatePaymentInput, PaymentAdapter } from './types'

export function createMidtransAdapter(): PaymentAdapter {
  const serverKey = process.env.MIDTRANS_SERVER_KEY ?? ''
  const isProduction = process.env.MIDTRANS_IS_PRODUCTION === 'true'
  const baseUrl = isProduction ? 'https://app.midtrans.com' : 'https://app.sandbox.midtrans.com'

  return {
    name: 'midtrans',
    async createPayment(input: CreatePaymentInput) {
      if (!serverKey) throw new Error('MIDTRANS_SERVER_KEY belum diisi')

      const response = await fetch(`${baseUrl}/snap/v1/transactions`, {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
          Authorization: `Basic ${Buffer.from(`${serverKey}:`).toString('base64')}`,
        },
        body: JSON.stringify({
          transaction_details: { order_id: input.orderCode, gross_amount: input.grossAmount },
          item_details: input.items,
          customer_details: {
            first_name: input.customer.name,
            email: input.customer.email,
            phone: input.customer.phone,
          },
          expiry: { unit: 'hours', duration: input.expiryHours },
        }),
      })

      if (!response.ok) throw new Error(`Midtrans menolak transaksi (${response.status})`)
      const data = (await response.json()) as { token: string; redirect_url: string }
      return { token: data.token, redirectUrl: data.redirect_url }
    },
    parseNotification: (body) => parseMidtransNotification(body, serverKey),
  }
}
