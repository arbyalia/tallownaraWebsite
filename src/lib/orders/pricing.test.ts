import { describe, expect, it } from 'vitest'

import { priceItems, type PricedProduct } from './pricing'

const balm: PricedProduct = { id: 1, name: 'Balm', price: 150000, weightGrams: 200, stock: 3, isVisible: true }
const soap: PricedProduct = { id: 2, name: 'Sabun', price: 90000, weightGrams: 300, stock: 1, isVisible: true }

describe('priceItems', () => {
  it('memakai harga server dan menjumlahkan total', () => {
    const result = priceItems(
      [
        { productId: 1, quantity: 2 },
        { productId: 2, quantity: 1 },
      ],
      [balm, soap],
    )
    expect(result).toMatchObject({ ok: true, subtotal: 390000, totalWeightGrams: 700 })
  })

  it('menolak jumlah melebihi stok', () => {
    expect(priceItems([{ productId: 2, quantity: 2 }], [soap]).ok).toBe(false)
  })

  it('menolak produk tersembunyi atau tidak dikenal', () => {
    expect(priceItems([{ productId: 1, quantity: 1 }], [{ ...balm, isVisible: false }]).ok).toBe(false)
    expect(priceItems([{ productId: 9, quantity: 1 }], [balm]).ok).toBe(false)
  })

  it('menolak jumlah bukan bilangan bulat positif dan keranjang kosong', () => {
    expect(priceItems([{ productId: 1, quantity: 0 }], [balm]).ok).toBe(false)
    expect(priceItems([{ productId: 1, quantity: 1.5 }], [balm]).ok).toBe(false)
    expect(priceItems([], [balm]).ok).toBe(false)
  })
})
