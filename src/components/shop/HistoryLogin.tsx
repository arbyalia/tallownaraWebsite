'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'

import { requestOtpAction, verifyOtpAction } from '@/lib/actions'

export function HistoryLogin() {
  const router = useRouter()
  const [rawPhone, setRawPhone] = useState('')
  const [phone, setPhone] = useState<string | null>(null)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [pending, startTransition] = useTransition()

  const request = (target: string) =>
    startTransition(async () => {
      setError('')
      const result = await requestOtpAction(target)
      if (result.ok) {
        setPhone(result.phone)
        setNotice('Bila nomor ini pernah memesan, kode sudah kami kirim. Berlaku 5 menit.')
      } else {
        setError(result.message)
      }
    })

  const verify = () =>
    startTransition(async () => {
      setError('')
      if (!phone) return
      const result = await verifyOtpAction(phone, code.trim())
      if (result.ok) router.refresh()
      else setError(result.message)
    })

  return (
    <form
      noValidate
      className="mt-10 max-w-md space-y-5"
      onSubmit={(event) => {
        event.preventDefault()
        if (pending) return
        if (phone) verify()
        else request(rawPhone)
      }}
    >
      {!phone ? (
        <div>
          <label htmlFor="history-phone" className="field-label">Nomor WhatsApp</label>
          <input id="history-phone" type="tel" autoComplete="tel" value={rawPhone} onChange={(event) => setRawPhone(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? 'history-error' : undefined} className="field-input" />
        </div>
      ) : (
        <div>
          <label htmlFor="history-code" className="field-label">Kode 6 angka</label>
          <input id="history-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} value={code} onChange={(event) => setCode(event.target.value)} aria-invalid={Boolean(error)} aria-describedby={error ? 'history-error' : undefined} className="field-input tabular tracking-widest" />
        </div>
      )}
      <div aria-live="polite">
        {error && <p id="history-error" className="field-error">{error}</p>}
        {!error && notice && <p className="text-forest">{notice}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-4">
        <button type="submit" className="btn btn-primary">
          {pending ? 'Memproses…' : phone ? 'Masuk ke riwayat' : 'Kirim kode'}
        </button>
        {phone && (
          <button type="button" className="min-h-11 underline" onClick={() => request(phone)}>
            Kirim ulang kode
          </button>
        )}
      </div>
    </form>
  )
}
