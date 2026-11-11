'use client'

import Link from 'next/link'

import type { CartProduct } from '@/lib/shop-types'

import { useCart, useHydrated } from './cart-store'
import { CheckoutForm } from './CheckoutForm'

export function CheckoutClient({ products }: { products: CartProduct[] }) {
  const lines = useCart()
  const hydrated = useHydrated()

  if (!hydrated) {
    return (
      <p role="status" className="page-shell flex-1 py-24 text-muted">
        Memuat checkout…
      </p>
    )
  }

  const rows = lines.flatMap((line) => {
    const product = products.find((candidate) => candidate.id === line.productId)
    return product ? [{ quantity: line.quantity, product }] : []
  })

  if (rows.length === 0) {
    return (
      <div className="page-shell flex flex-1 flex-col items-start justify-center py-24">
        <h1 className="text-5xl font-normal">Belum ada barang untuk dibayar</h1>
        <p className="mt-4 max-w-xl text-muted">Pilih produk lebih dulu, lalu kembali ke halaman ini.</p>
        <Link href="/produk" className="btn btn-primary mt-8">
          Lihat produk
        </Link>
      </div>
    )
  }

  return <CheckoutForm rows={rows} />
}
