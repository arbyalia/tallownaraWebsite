import { describe, expect, it } from 'vitest'

import { midtransSignature, parseMidtransNotification } from './midtrans-signature'

const KEY = 'kunci-uji'

function notification(overrides: Record<string, string> = {}) {
  const base = {
    order_id: 'TLN-7KQ4MX',
    status_code: '200',
    gross_amount: '120000.00',
    transaction_id: 'abc',
    transaction_status: 'settlement',
    ...overrides,
  }
  return {
    ...base,
    signature_key: midtransSignature(base.order_id, base.status_code, base.gross_amount, KEY),
  }
}

describe('notifikasi Midtrans', () => {
  it('menerima tanda tangan sah dan memetakan lunas', () => {
    expect(parseMidtransNotification(notification(), KEY)).toEqual({
      eventId: 'abc:settlement',
      orderCode: 'TLN-7KQ4MX',
      grossAmount: 120000,
      state: 'paid',
    })
  })

  it('menolak tanda tangan salah', () => {
    expect(parseMidtransNotification({ ...notification(), signature_key: 'x' }, KEY)).toBeNull()
    expect(parseMidtransNotification({ ...notification(), gross_amount: '1.00' }, KEY)).toBeNull()
  })

  it('menolak bila server key kosong atau bentuk data salah', () => {
    expect(parseMidtransNotification(notification(), '')).toBeNull()
    expect(parseMidtransNotification({ order_id: 'x' }, KEY)).toBeNull()
  })

  it('capture tanpa accept bukan lunas', () => {
    const body = notification({ transaction_status: 'capture', fraud_status: 'challenge' })
    expect(parseMidtransNotification(body, KEY)?.state).toBe('pending')
  })

  it('expire dan cancel dianggap gagal', () => {
    expect(parseMidtransNotification(notification({ transaction_status: 'expire' }), KEY)?.state).toBe('failed')
  })
})
