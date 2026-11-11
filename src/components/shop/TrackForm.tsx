'use client'

import { useActionState } from 'react'

import { trackOrderAction, type TrackState } from '@/lib/actions'

import { OrderDetails } from './OrderDetails'

const INITIAL: TrackState = { status: 'idle' }

export function TrackForm() {
  const [state, action, pending] = useActionState(trackOrderAction, INITIAL)

  return (
    <>
      <form action={action} className="mt-10 grid max-w-3xl gap-5 sm:grid-cols-[2fr_1fr_auto] sm:items-end">
        <div>
          <label htmlFor="code" className="field-label">Kode pesanan</label>
          <input id="code" name="code" required autoCapitalize="characters" autoComplete="off" className="field-input uppercase" />
        </div>
        <div>
          <label htmlFor="lastFour" className="field-label">4 digit nomor WA</label>
          <input id="lastFour" name="lastFour" required inputMode="numeric" maxLength={4} pattern="\d{4}" autoComplete="off" className="field-input tabular" />
        </div>
        <button type="submit" className="btn btn-primary">{pending ? 'Mencari pesanan…' : 'Lacak pesanan'}</button>
      </form>

      <div aria-live="polite" className="mt-12">
        {state.status === 'not_found' && (
          <p className="max-w-xl text-error">Pesanan tidak ditemukan. Periksa kode dan 4 digit terakhir nomor WhatsApp Anda.</p>
        )}
        {state.status === 'error' && <p className="max-w-xl text-error">Pencarian gagal karena gangguan di sisi kami. Coba lagi beberapa saat.</p>}
        {state.status === 'found' && state.order && (
          <div className="border-t border-stone pt-10">
            <p className="tabular mb-8 font-serif text-4xl text-olive-deep">{state.order.code}</p>
            <OrderDetails order={state.order} />
          </div>
        )}
      </div>
    </>
  )
}
