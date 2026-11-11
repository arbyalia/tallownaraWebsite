import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { SimulatePayment } from '@/components/shop/SimulatePayment'
import { isMockPayment } from '@/lib/integrations/payment'
import { formatRupiah } from '@/lib/money'
import { getOrderByToken } from '@/lib/orders/queries'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Simulasi pembayaran', robots: { index: false } }

type Props = { params: Promise<{ code: string }>; searchParams: Promise<{ t?: string }> }

export default async function SimulatedPaymentPage({ params, searchParams }: Props) {
  if (!isMockPayment()) notFound()
  const [{ code }, { t }] = await Promise.all([params, searchParams])
  const order = t ? await getOrderByToken(code, t) : null
  if (!order || !t) notFound()

  return (
    <div className="page-shell max-w-xl flex-1 py-16">
      <p role="note" className="border-l-2 border-warning pl-4 text-warning">
        Ini halaman simulasi untuk uji coba. Setelah akun Midtrans terhubung, pembeli memilih QRIS,
        virtual account, e-wallet, atau kartu di sini.
      </p>
      <h1 className="section-title mt-8">Bayar pesanan</h1>
      <dl className="mt-6 space-y-2">
        <div className="flex justify-between border-t border-stone pt-3">
          <dt>Kode pesanan</dt>
          <dd className="tabular font-semibold">{order.code}</dd>
        </div>
        <div className="flex justify-between border-t border-stone pt-3 text-xl font-semibold">
          <dt>Total</dt>
          <dd className="tabular">{formatRupiah(order.total)}</dd>
        </div>
      </dl>
      <SimulatePayment code={order.code} token={t} />
    </div>
  )
}
