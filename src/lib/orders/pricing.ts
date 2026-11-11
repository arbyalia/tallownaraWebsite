export type PricedProduct = {
  id: number
  name: string
  price: number
  weightGrams: number
  stock: number
  isVisible: boolean
}

export type RequestedItem = { productId: number; quantity: number }

export type PricedItem = {
  productId: number
  name: string
  unitPrice: number
  quantity: number
  weightGrams: number
}

export type PricingResult =
  | { ok: true; items: PricedItem[]; subtotal: number; totalWeightGrams: number }
  | { ok: false; message: string }

/** Menghitung ulang harga dari data server. Angka dari browser tidak dipakai. */
export function priceItems(requested: RequestedItem[], products: PricedProduct[]): PricingResult {
  if (requested.length === 0) return { ok: false, message: 'Keranjang Anda masih kosong.' }

  const items: PricedItem[] = []
  for (const { productId, quantity } of requested) {
    const product = products.find((candidate) => candidate.id === productId)
    if (!product || !product.isVisible) {
      return { ok: false, message: 'Salah satu produk sudah tidak tersedia. Periksa keranjang Anda.' }
    }
    if (!Number.isInteger(quantity) || quantity < 1) {
      return { ok: false, message: `Jumlah ${product.name} tidak valid.` }
    }
    if (quantity > product.stock) {
      return {
        ok: false,
        message: `Stok ${product.name} tersisa ${product.stock}. Kurangi jumlahnya di keranjang.`,
      }
    }
    items.push({
      productId: product.id,
      name: product.name,
      unitPrice: product.price,
      quantity,
      weightGrams: product.weightGrams,
    })
  }

  return {
    ok: true,
    items,
    subtotal: items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    totalWeightGrams: items.reduce((sum, item) => sum + item.weightGrams * item.quantity, 0),
  }
}
