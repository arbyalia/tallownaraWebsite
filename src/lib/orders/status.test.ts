import { describe, expect, it } from 'vitest'

import { canTransition } from './status'

describe('transisi status pesanan', () => {
  it('mengizinkan langkah maju', () => {
    expect(canTransition('menunggu_pembayaran', 'dibayar')).toBe(true)
    expect(canTransition('dibayar', 'dikemas')).toBe(true)
    expect(canTransition('dibayar', 'dikirim')).toBe(true)
    expect(canTransition('dikirim', 'selesai')).toBe(true)
  })

  it('menolak langkah mundur dan status yang sama', () => {
    expect(canTransition('dikirim', 'dikemas')).toBe(false)
    expect(canTransition('dibayar', 'menunggu_pembayaran')).toBe(false)
    expect(canTransition('dibayar', 'dibayar')).toBe(false)
  })

  it('tidak bisa melompati pembayaran', () => {
    expect(canTransition('menunggu_pembayaran', 'dikemas')).toBe(false)
    expect(canTransition('menunggu_pembayaran', 'selesai')).toBe(false)
  })

  it('status akhir tidak bisa berubah', () => {
    expect(canTransition('kedaluwarsa', 'dibayar')).toBe(false)
    expect(canTransition('dibatalkan', 'dikemas')).toBe(false)
  })

  it('mengizinkan cabang yang sah', () => {
    expect(canTransition('menunggu_pembayaran', 'kedaluwarsa')).toBe(true)
    expect(canTransition('dikirim', 'dikembalikan')).toBe(true)
  })
})
