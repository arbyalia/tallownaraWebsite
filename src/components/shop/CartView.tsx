'use client'

import Image from 'next/image'
import Link from 'next/link'

import { formatRupiah } from '@/lib/money'
import type { CartProduct } from '@/lib/shop-types'

import { TemplateText } from '../TemplateText'
import { removeFromCart, setCartQuantity, useCart, useHydrated } from './cart-store'
import { QuantityStepper } from './QuantityStepper'

export function CartView({ products }: { products: CartProduct[] }) {
  const lines = useCart()
  const hydrated = useHydrated()

  if (!hydrated) {
    return (
      <p role="status" className="page-shell flex-1 py-24 text-muted">
        Memuat keranjang…
      </p>
    )
  }

  const rows = lines.flatMap((line) => {
    const product = products.find((candidate) => candidate.id === line.productId)
    return product ? [{ line, product }] : []
  })
  const hasMissing = rows.length !== lines.length
  const hasOverStock = rows.some(({ line, product }) => line.quantity > product.stock)
  const subtotal = rows.reduce((sum, { line, product }) => sum + product.price * line.quantity, 0)

  if (rows.length === 0) {
    return (
      <div className="page-shell flex flex-1 flex-col items-start justify-center py-24">
        <h1 className="text-5xl font-normal">Keranjang masih kosong</h1>
        <p className="mt-4 max-w-xl text-muted">Pilih balm atau sabun yang ingin Anda coba lebih dulu.</p>
        <Link href="/produk" className="btn btn-primary mt-8">
          Lihat produk
        </Link>
      </div>
    )
  }

  return (
    <div className="page-shell grid grid-cols-12 gap-x-6 gap-y-10 pb-20 pt-12 sm:pt-16">
      <div className="col-span-12 lg:col-span-7">
        <h1 className="section-title">Keranjang</h1>
        {hasMissing && (
          <p role="status" className="mt-4 text-warning">Ada produk yang sudah tidak tersedia dan kami sembunyikan.</p>
        )}
        <ul className="mt-8">
          {rows.map(({ line, product }) => (
            <li key={product.id} className="flex gap-4 border-t border-stone py-6 sm:gap-6">
              <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-[var(--radius-sm)] bg-paper sm:h-32 sm:w-32">
                {product.imageUrl && (
                  <Image src={product.imageUrl} alt={product.imageAlt} fill sizes="128px" className="object-contain p-2" />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap justify-between gap-x-4">
                  <h2 className="text-2xl font-normal">
                    <Link href={`/produk/${product.slug}`} className="text-olive-deep no-underline hover:underline">
                      {product.name}
                    </Link>
                  </h2>
                  <p className="tabular font-semibold">{formatRupiah(product.price * line.quantity)}</p>
                </div>
                <p className="mt-1 text-base text-muted">
                  <TemplateText text={product.sizeLabel} />
                </p>
                {line.quantity > product.stock && (
                  <p className="field-error">Stok tersisa {product.stock}. Kurangi jumlahnya untuk melanjutkan.</p>
                )}
                <div className="mt-3 flex flex-wrap items-center gap-4">
                  <QuantityStepper
                    value={line.quantity}
                    max={product.stock}
                    label={`Jumlah ${product.name}`}
                    onChange={(quantity) => setCartQuantity(product.id, quantity)}
                  />
                  <button
                    type="button"
                    onClick={() => removeFromCart(product.id)}
                    className="min-h-11 text-base text-error underline"
                    aria-label={`Hapus ${product.name} dari keranjang`}
                  >
                    Hapus
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <aside className="col-span-12 lg:col-span-4 lg:col-start-9">
        <div className="panel-white rounded-[var(--radius-md)] p-6 lg:sticky lg:top-28">
          <h2 className="text-3xl font-normal">Ringkasan</h2>
          <dl className="mt-5 flex justify-between border-t border-stone pt-4">
            <dt>Subtotal</dt>
            <dd className="tabular font-semibold">{formatRupiah(subtotal)}</dd>
          </dl>
          <p className="mt-2 text-base text-muted">Ongkir dihitung saat checkout.</p>
          {hasOverStock ? (
            <p className="field-error">Sesuaikan jumlah barang lebih dulu.</p>
          ) : (
            <Link href="/checkout" className="btn btn-primary mt-6 w-full">
              Lanjut ke checkout
            </Link>
          )}
          <Link href="/produk" className="link-arrow mt-4 text-base">
            Tambah produk lain
          </Link>
        </div>
      </aside>
    </div>
  )
}
