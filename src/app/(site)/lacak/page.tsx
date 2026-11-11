import type { Metadata } from 'next'

import { TrackForm } from '@/components/shop/TrackForm'

export const metadata: Metadata = { title: 'Lacak pesanan' }

export default function TrackPage() {
  return (
    <div className="page-shell flex-1 pb-20 pt-12 sm:pt-16">
      <h1 className="display">Lacak pesanan</h1>
      <p className="mt-4 max-w-xl text-muted">
        Masukkan kode yang kami kirim lewat WhatsApp, contoh TLN-7KQ4MX, dan 4 digit terakhir nomor Anda.
      </p>
      <TrackForm />
    </div>
  )
}
