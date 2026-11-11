'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { simulatePaymentAction } from '@/lib/actions'

export function SimulatePayment({ code, token }: { code: string; token: string }) {
  const router = useRouter()
  const [failed, setFailed] = useState(false)
  const [pending, startTransition] = useTransition()

  const pay = () =>
    startTransition(async () => {
      const { ok } = await simulatePaymentAction(code, token)
      if (ok) router.push(`/pesanan/${code}?t=${token}`)
      else setFailed(true)
    })

  return (
    <div className="mt-8">
      <button type="button" onClick={pay} className="btn btn-primary w-full">
        {pending ? 'Memproses pembayaran…' : 'Bayar pesanan (simulasi)'}
      </button>
      {failed && <p role="alert" className="field-error">Simulasi gagal. Muat ulang halaman lalu coba lagi.</p>}
    </div>
  )
}
