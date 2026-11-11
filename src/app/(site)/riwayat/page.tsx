import type { Metadata } from 'next'
import Link from 'next/link'

import { HistoryLogin } from '@/components/shop/HistoryLogin'
import { HistoryLogout } from '@/components/shop/HistoryLogout'
import { formatDateTime } from '@/components/shop/OrderDetails'
import { getHistoryOrders } from '@/lib/actions'
import { formatRupiah } from '@/lib/money'
import { STATUS_LABELS } from '@/lib/orders/status'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Riwayat pesanan', robots: { index: false } }

export default async function HistoryPage() {
  const orders = await getHistoryOrders()

  if (orders === null) {
    return (
      <div className="page-shell flex-1 pb-20 pt-12 sm:pt-16">
        <h1 className="display">Riwayat pesanan</h1>
        <p className="mt-4 max-w-xl text-muted">Kami kirim kode 6 angka ke WhatsApp Anda untuk memastikan ini memang Anda.</p>
        <HistoryLogin />
      </div>
    )
  }

  return (
    <div className="page-shell flex-1 pb-20 pt-12 sm:pt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h1 className="display">Riwayat pesanan</h1>
        <HistoryLogout />
      </div>
      {orders.length === 0 ? (
        <div className="mt-10">
          <p className="text-muted">Nomor ini belum memiliki pesanan.</p>
          <Link href="/produk" className="btn btn-primary mt-6">Lihat produk</Link>
        </div>
      ) : (
        <ul className="mt-10">
          {orders.map((order) => (
            <li key={order.code} className="grid gap-2 border-t border-stone py-6 sm:grid-cols-4 sm:items-center">
              <p className="tabular font-serif text-2xl text-olive-deep">{order.code}</p>
              <p className="text-muted">{formatDateTime(order.createdAt)}</p>
              <p className="font-semibold">{STATUS_LABELS[order.status]}</p>
              <p className="tabular sm:text-right">{formatRupiah(order.total)}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
