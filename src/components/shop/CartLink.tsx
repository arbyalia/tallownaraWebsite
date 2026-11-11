'use client'

import Link from 'next/link'

import { useCart } from './cart-store'

export function CartLink({ onNavigate }: { onNavigate?: () => void }) {
  const count = useCart().reduce((sum, line) => sum + line.quantity, 0)

  return (
    <Link
      href="/keranjang"
      onClick={onNavigate}
      aria-label={count > 0 ? `Keranjang, ${count} barang` : 'Keranjang, kosong'}
      className="inline-flex min-h-11 min-w-11 items-center justify-center gap-2 rounded-full border border-stone/80 bg-white/70 px-2 text-ink no-underline transition-colors hover:bg-white hover:text-ink sm:pl-4 sm:pr-2"
    >
      <span className="hidden sm:inline">Keranjang</span>
      <span className="tabular grid h-6 min-w-6 place-items-center rounded-full bg-forest px-1.5 text-sm font-semibold text-white">
        {count}
      </span>
    </Link>
  )
}
