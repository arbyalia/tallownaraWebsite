import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { OrderDetails } from '@/components/shop/OrderDetails'
import { getOrderByToken } from '@/lib/orders/queries'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Pesanan', robots: { index: false } }

type Props = { params: Promise<{ code: string }>; searchParams: Promise<{ t?: string }> }

export default async function OrderPage({ params, searchParams }: Props) {
  const [{ code }, { t }] = await Promise.all([params, searchParams])
  const order = t ? await getOrderByToken(code, t) : null
  if (!order) notFound()

  return (
    <div className="page-shell pb-20 pt-12 sm:pt-16">
      <p className="kicker">Kode pesanan</p>
      <h1 className="section-title tabular mt-2">{order.code}</h1>
      <p className="mb-12 mt-4 max-w-xl text-muted">
        Terima kasih. Simpan kode ini. Anda bisa melacak pesanan kapan saja dengan kode ini dan 4
        digit terakhir nomor WhatsApp Anda.
      </p>
      <OrderDetails order={order} />
    </div>
  )
}
