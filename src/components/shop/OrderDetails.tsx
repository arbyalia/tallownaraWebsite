import { formatRupiah } from '@/lib/money'
import { MAIN_FLOW, STATUS_LABELS, type OrderStatus } from '@/lib/orders/status'
import type { PublicOrder } from '@/lib/shop-types'

const dateFormat = new Intl.DateTimeFormat('id-ID', {
  dateStyle: 'medium',
  timeStyle: 'short',
  timeZone: 'Asia/Jakarta',
})

export function formatDateTime(value: string): string {
  return `${dateFormat.format(new Date(value))} WIB`
}

function OrderTimeline({ order }: { order: PublicOrder }) {
  const isBranch = !MAIN_FLOW.includes(order.status)
  const steps: OrderStatus[] = isBranch
    ? [...new Set([...order.history.map((entry) => entry.status as OrderStatus), order.status])]
    : MAIN_FLOW
  const currentIndex = steps.indexOf(order.status)

  return (
    <ol className="mt-6">
      {steps.map((step, index) => {
        const done = index <= currentIndex
        const entry = order.history.find((item) => item.status === step)
        return (
          <li key={step} aria-current={step === order.status ? 'step' : undefined} className="relative flex gap-4 pb-6 last:pb-0">
            {index < steps.length - 1 && (
              <span aria-hidden className={`absolute left-[9px] top-5 h-full w-0.5 ${index < currentIndex ? 'bg-forest' : 'bg-stone'}`} />
            )}
            <span aria-hidden className={`relative mt-1 h-5 w-5 shrink-0 rounded-full border-2 ${done ? 'border-forest bg-forest' : 'border-stone bg-white'}`} />
            <div>
              <p className={done ? 'font-semibold text-ink' : 'text-muted'}>
                {STATUS_LABELS[step]}
                {!done && <span className="sr-only"> (belum)</span>}
              </p>
              {entry && <p className="text-base text-muted">{formatDateTime(entry.at)}</p>}
            </div>
          </li>
        )
      })}
    </ol>
  )
}

export function OrderDetails({ order }: { order: PublicOrder }) {
  return (
    <div className="grid grid-cols-12 gap-x-6 gap-y-10">
      <div className="col-span-12 lg:col-span-6">
        <h2 className="text-3xl font-normal">Status pesanan</h2>
        <OrderTimeline order={order} />
        {order.status === 'menunggu_pembayaran' && (
          <p className="mt-6 text-warning">Selesaikan pembayaran sebelum {formatDateTime(order.expiresAt)}.</p>
        )}
        {order.paymentUrl && (
          <a href={order.paymentUrl} className="btn btn-primary mt-4">
            Selesaikan pembayaran
          </a>
        )}
      </div>
      <div className="col-span-12 panel-white rounded-[var(--radius-md)] p-6 lg:col-span-5 lg:col-start-8">
        <h2 className="text-3xl font-normal">Rincian</h2>
        <ul className="mt-4 space-y-2 border-t border-stone pt-4">
          {order.items.map((item) => (
            <li key={item.name} className="flex justify-between gap-4 text-base">
              <span>{item.name} × {item.quantity}</span>
              <span className="tabular">{formatRupiah(item.unitPrice * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <dl className="mt-4 space-y-2 border-t border-stone pt-4 text-base">
          <div className="flex justify-between">
            <dt>Ongkir</dt>
            <dd className="tabular">{formatRupiah(order.shippingCost)}</dd>
          </div>
          <div className="flex justify-between text-lg font-semibold">
            <dt>Total</dt>
            <dd className="tabular">{formatRupiah(order.total)}</dd>
          </div>
          <div className="border-t border-stone pt-3">
            <dt className="text-muted">Dikirim ke</dt>
            <dd>{order.areaLabel}</dd>
          </div>
          <div>
            <dt className="text-muted">Kurir</dt>
            <dd>{order.courierName} {order.serviceName}</dd>
          </div>
          {order.trackingNumber && (
            <div>
              <dt className="text-muted">Nomor resi</dt>
              <dd className="tabular font-semibold">{order.trackingNumber}</dd>
            </div>
          )}
        </dl>
      </div>
    </div>
  )
}
