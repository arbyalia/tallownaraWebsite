import { describe, expect, it } from 'vitest'

import { generateOrderCode, normalizeOrderCode } from './orders/code'
import { normalizePhone } from './phone'

describe('normalizePhone', () => {
  it.each(['0815-819-2911', '+62 815 819 2911', '628158192911', '8158192911'])('menerima %s', (input) => {
    expect(normalizePhone(input)).toBe('+628158192911')
  })

  it.each(['12345', '0215551234', 'abc', ''])('menolak %s', (input) => {
    expect(normalizePhone(input)).toBeNull()
  })
})

describe('kode pesanan', () => {
  it('berformat TLN- + 6 karakter tanpa huruf ambigu', () => {
    for (let i = 0; i < 200; i += 1) expect(generateOrderCode()).toMatch(/^TLN-[2-9A-HJKMNP-Z]{6}$/)
  })

  it('merapikan masukan pengguna', () => {
    expect(normalizeOrderCode(' tln-7kq4mx ')).toBe('TLN-7KQ4MX')
    expect(normalizeOrderCode('7kq4mx')).toBe('TLN-7KQ4MX')
  })
})
