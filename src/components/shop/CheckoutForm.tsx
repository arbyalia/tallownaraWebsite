'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type FormEvent } from 'react'

import { getRatesAction, placeOrderAction, searchAreasAction } from '@/lib/actions'
import type { ShippingArea, ShippingRate } from '@/lib/integrations/shipping/types'
import { formatRupiah } from '@/lib/money'
import { contactFields } from '@/lib/orders/schema'
import type { CartProduct } from '@/lib/shop-types'

import { clearCart } from './cart-store'

const STORAGE_KEY = 'tallownara-checkout'

type Values = {
  customerName: string
  customerEmail: string
  customerPhone: string
  addressStreet: string
  postalCode: string
}
type FieldName = keyof Values
type Errors = Partial<Record<FieldName | 'area' | 'courier' | 'acceptTerms', string>>
type Saved = Values & { area: ShippingArea | null; rateKey: string }
type RateState =
  | { kind: 'idle' }
  | { kind: 'loading' }
  | { kind: 'error'; message: string }
  | { kind: 'ready'; rates: ShippingRate[] }
type AreaState = 'idle' | 'loading' | 'error' | 'done'

const EMPTY: Saved = {
  customerName: '',
  customerEmail: '',
  customerPhone: '',
  addressStreet: '',
  postalCode: '',
  area: null,
  rateKey: '',
}

function readSaved(): Saved {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY)
    return raw ? { ...EMPTY, ...(JSON.parse(raw) as Partial<Saved>) } : EMPTY
  } catch {
    return EMPTY
  }
}

const rateKeyOf = (rate: ShippingRate) => `${rate.courierCode}:${rate.serviceCode}`

const validateField = (name: FieldName, value: string) =>
  contactFields[name].safeParse(value).error?.issues[0]?.message

const FIELD_ORDER = ['customerName', 'customerEmail', 'customerPhone', 'area', 'addressStreet', 'postalCode', 'courier', 'acceptTerms'] as const
const FOCUS_ID: Record<(typeof FIELD_ORDER)[number], string> = {
  customerName: 'customerName',
  customerEmail: 'customerEmail',
  customerPhone: 'customerPhone',
  area: 'area-search',
  addressStreet: 'addressStreet',
  postalCode: 'postalCode',
  courier: 'courier-group',
  acceptTerms: 'acceptTerms',
}

type Row = { quantity: number; product: CartProduct }

export function CheckoutForm({ rows }: { rows: Row[] }) {
  const [initial] = useState(readSaved)
  const [values, setValues] = useState<Values>(initial)
  const [area, setArea] = useState<ShippingArea | null>(initial.area)
  const [rateKey, setRateKey] = useState(initial.rateKey)
  const [accepted, setAccepted] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [formError, setFormError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [rateState, setRateState] = useState<RateState>(initial.area ? { kind: 'loading' } : { kind: 'idle' })
  const [areaQuery, setAreaQuery] = useState('')
  const [areaResults, setAreaResults] = useState<ShippingArea[]>([])
  const [areaState, setAreaState] = useState<AreaState>('idle')
  const searchTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const submittingRef = useRef(false)

  const items = rows.map(({ quantity, product }) => ({ productId: product.id, quantity }))
  const itemsKey = JSON.stringify(items)

  useEffect(() => {
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify({ ...values, area, rateKey }))
  }, [values, area, rateKey])

  const fetchRates = (areaId: string) =>
    getRatesAction({ areaId, items: JSON.parse(itemsKey) as typeof items })
      .then((result) =>
        setRateState(result.ok ? { kind: 'ready', rates: result.rates } : { kind: 'error', message: result.message }),
      )
      .catch(() => setRateState({ kind: 'error', message: 'Ongkir belum bisa dimuat.' }))

  const initialAreaId = initial.area?.id
  useEffect(() => {
    if (!initialAreaId) return
    void fetchRates(initialAreaId)
    // Hanya memuat ulang ongkir dari data tersimpan saat halaman dibuka.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialAreaId])

  const loadRates = (areaId: string) => {
    setRateState({ kind: 'loading' })
    void fetchRates(areaId)
  }

  const onAreaQuery = (query: string) => {
    setAreaQuery(query)
    clearTimeout(searchTimer.current)
    if (query.trim().length < 3) {
      setAreaResults([])
      setAreaState('idle')
      return
    }
    setAreaState('loading')
    searchTimer.current = setTimeout(() => {
      searchAreasAction(query)
        .then((result) => {
          if (result.ok) {
            setAreaResults(result.areas)
            setAreaState('done')
          } else {
            setAreaState('error')
          }
        })
        .catch(() => setAreaState('error'))
    }, 300)
  }

  const chooseArea = (chosen: ShippingArea) => {
    setArea(chosen)
    setRateKey('')
    setAreaQuery('')
    setAreaResults([])
    setAreaState('idle')
    setErrors((current) => ({ ...current, area: undefined }))
    setValues((current) => ({ ...current, postalCode: chosen.postalCode || current.postalCode }))
    loadRates(chosen.id)
  }

  const setField = (name: FieldName, value: string) => {
    setValues((current) => ({ ...current, [name]: value }))
    if (errors[name]) setErrors((current) => ({ ...current, [name]: validateField(name, value) }))
  }

  const rates = rateState.kind === 'ready' ? rateState.rates : []
  const selectedRate = rates.find((rate) => rateKeyOf(rate) === rateKey)
  const subtotal = rows.reduce((sum, { quantity, product }) => sum + product.price * quantity, 0)
  const total = subtotal + (selectedRate?.price ?? 0)

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (submittingRef.current) return
    setFormError('')

    const nextErrors: Errors = {}
    for (const name of Object.keys(values).filter((key) => key in contactFields) as FieldName[]) {
      nextErrors[name] = validateField(name, values[name])
    }
    if (!area) nextErrors.area = 'Cari lalu pilih kecamatan tujuan.'
    if (!selectedRate) nextErrors.courier = 'Pilih salah satu layanan kurir.'
    if (!accepted) nextErrors.acceptTerms = 'Centang persetujuan Syarat & Ketentuan untuk melanjutkan.'
    setErrors(nextErrors)

    const firstInvalid = FIELD_ORDER.find((name) => nextErrors[name])
    if (firstInvalid) {
      document.getElementById(FOCUS_ID[firstInvalid])?.focus()
      return
    }

    submittingRef.current = true
    setSubmitting(true)
    const result = await placeOrderAction({
      ...values,
      areaId: area?.id,
      areaLabel: area?.label,
      courierCode: selectedRate?.courierCode,
      serviceCode: selectedRate?.serviceCode,
      acceptTerms: accepted,
      items,
    }).catch(() => ({ ok: false as const, message: 'Koneksi terputus. Data Anda aman, silakan coba lagi.' }))

    if (result.ok) {
      clearCart()
      window.sessionStorage.removeItem(STORAGE_KEY)
      window.location.assign(result.redirectUrl)
      return
    }
    submittingRef.current = false
    setSubmitting(false)
    setFormError(result.message)
  }

  const textField = (name: FieldName, label: string, props: React.InputHTMLAttributes<HTMLInputElement> = {}, hint?: string) => (
    <div>
      <label htmlFor={name} className="field-label">{label}</label>
      {hint && <p id={`${name}-hint`} className="mb-1.5 text-base text-muted">{hint}</p>}
      <input
        id={name}
        value={values[name]}
        onChange={(event) => setField(name, event.target.value)}
        onBlur={(event) => setErrors((current) => ({ ...current, [name]: validateField(name, event.target.value) }))}
        aria-invalid={Boolean(errors[name])}
        aria-describedby={[hint ? `${name}-hint` : '', errors[name] ? `${name}-error` : ''].join(' ').trim() || undefined}
        className="field-input"
        {...props}
      />
      {errors[name] && <p id={`${name}-error`} className="field-error">{errors[name]}</p>}
    </div>
  )

  return (
    <form onSubmit={submit} noValidate className="page-shell grid grid-cols-12 gap-x-6 gap-y-10 pb-20 pt-12 sm:pt-16">
      <div className="col-span-12 space-y-12 lg:col-span-7">
        <h1 className="section-title">Checkout</h1>

        <section className="space-y-5">
          <h2 className="border-t border-stone pt-6 text-3xl font-normal">Kontak penerima</h2>
          {textField('customerName', 'Nama lengkap', { autoComplete: 'name' })}
          {textField('customerEmail', 'Email', { type: 'email', autoComplete: 'email', inputMode: 'email' })}
          {textField('customerPhone', 'Nomor WhatsApp', { type: 'tel', autoComplete: 'tel', inputMode: 'tel' }, 'Kode pesanan dan nomor resi kami kirim ke nomor ini.')}
        </section>

        <section className="space-y-5">
          <h2 className="border-t border-stone pt-6 text-3xl font-normal">Alamat pengiriman</h2>

          <div>
            <label htmlFor="area-search" className="field-label">Kecamatan tujuan</label>
            {area && (
              <p className="mb-2 flex flex-wrap items-center justify-between gap-2 rounded-[var(--radius-sm)] bg-paper px-3 py-2">
                <span>{area.label}</span>
              </p>
            )}
            <input
              id="area-search"
              value={areaQuery}
              onChange={(event) => onAreaQuery(event.target.value)}
              placeholder={area ? 'Ganti kecamatan' : 'Ketik minimal 3 huruf, contoh: Gubeng'}
              autoComplete="off"
              aria-invalid={Boolean(errors.area)}
              aria-describedby={errors.area ? 'area-error' : undefined}
              className="field-input"
            />
            <div aria-live="polite">
              {areaState === 'loading' && <p className="mt-2 text-base text-muted">Mencari kecamatan…</p>}
              {areaState === 'error' && (
                <p className="field-error">
                  Pencarian gagal.{' '}
                  <button type="button" className="underline" onClick={() => onAreaQuery(areaQuery)}>Coba lagi</button>
                </p>
              )}
              {areaState === 'done' && areaResults.length === 0 && (
                <p className="mt-2 text-base text-muted">Kecamatan tidak ditemukan. Periksa ejaannya atau coba nama kota.</p>
              )}
            </div>
            {areaResults.length > 0 && (
              <ul className="mt-2 divide-y divide-stone border border-stone">
                {areaResults.map((result) => (
                  <li key={result.id}>
                    <button type="button" onClick={() => chooseArea(result)} className="min-h-11 w-full px-3 py-2 text-left hover:bg-paper">
                      {result.label} <span className="text-muted">{result.postalCode}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            {errors.area && <p id="area-error" className="field-error">{errors.area}</p>}
          </div>

          {textField('addressStreet', 'Alamat lengkap', { autoComplete: 'street-address' }, 'Nama jalan, nomor rumah, RT/RW, dan patokan.')}
          {textField('postalCode', 'Kode pos', { autoComplete: 'postal-code', inputMode: 'numeric', maxLength: 5 })}
        </section>

        <section>
          <h2 className="border-t border-stone pt-6 text-3xl font-normal">Kurir</h2>
          <div id="courier-group" tabIndex={-1} role="radiogroup" aria-label="Pilihan kurir" aria-describedby={errors.courier ? 'courier-error' : undefined} className="mt-5">
            <div aria-live="polite">
              {rateState.kind === 'idle' && <p className="text-muted">Pilih kecamatan tujuan untuk melihat ongkir.</p>}
              {rateState.kind === 'loading' && <p className="text-muted">Menghitung ongkir…</p>}
              {rateState.kind === 'error' && (
                <div role="alert">
                  <p className="text-error">{rateState.message} Data yang sudah Anda isi tetap tersimpan.</p>
                  <button type="button" className="btn btn-outline mt-3" onClick={() => area && loadRates(area.id)}>Coba lagi</button>
                </div>
              )}
              {rateState.kind === 'ready' && rates.length === 0 && (
                <p className="text-warning">Belum ada kurir yang melayani alamat ini. Coba kecamatan terdekat atau hubungi kami.</p>
              )}
            </div>
            <div className="divide-y divide-stone">
              {rates.map((rate) => (
                <label key={rateKeyOf(rate)} className="flex min-h-14 cursor-pointer items-center gap-3 py-3">
                  <input
                    type="radio"
                    name="courier"
                    className="h-5 w-5 accent-forest"
                    checked={rateKey === rateKeyOf(rate)}
                    onChange={() => {
                      setRateKey(rateKeyOf(rate))
                      setErrors((current) => ({ ...current, courier: undefined }))
                    }}
                  />
                  <span className="flex-1">
                    {rate.courierName} {rate.serviceName}
                    <span className="block text-base text-muted">Estimasi {rate.estimate}</span>
                  </span>
                  <span className="tabular font-semibold">{formatRupiah(rate.price)}</span>
                </label>
              ))}
            </div>
          </div>
          {errors.courier && <p id="courier-error" className="field-error">{errors.courier}</p>}
        </section>
      </div>

      <aside className="col-span-12 lg:col-span-4 lg:col-start-9">
        <div className="panel-white rounded-[var(--radius-md)] p-6 lg:sticky lg:top-28">
          <h2 className="text-3xl font-normal">Ringkasan</h2>
          <ul className="mt-5 space-y-3 border-t border-stone pt-4">
            {rows.map(({ quantity, product }) => (
              <li key={product.id} className="flex justify-between gap-4 text-base">
                <span>{product.name} × {quantity}</span>
                <span className="tabular">{formatRupiah(product.price * quantity)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-4 space-y-2 border-t border-stone pt-4">
            <div className="flex justify-between">
              <dt>Subtotal</dt>
              <dd className="tabular">{formatRupiah(subtotal)}</dd>
            </div>
            <div className="flex justify-between">
              <dt>Ongkir</dt>
              <dd className="tabular">{selectedRate ? formatRupiah(selectedRate.price) : 'Pilih kurir'}</dd>
            </div>
            <div className="flex justify-between border-t border-stone pt-3 text-xl font-semibold">
              <dt>Total</dt>
              <dd className="tabular">{formatRupiah(total)}</dd>
            </div>
          </dl>

          <div className="mt-5">
            <label className="flex items-start gap-3 text-base">
              <input
                id="acceptTerms"
                type="checkbox"
                checked={accepted}
                onChange={(event) => {
                  setAccepted(event.target.checked)
                  if (event.target.checked) setErrors((current) => ({ ...current, acceptTerms: undefined }))
                }}
                aria-invalid={Boolean(errors.acceptTerms)}
                aria-describedby={errors.acceptTerms ? 'acceptTerms-error' : undefined}
                className="mt-1 h-5 w-5 shrink-0 accent-forest"
              />
              <span>
                Saya setuju dengan <Link href="/syarat-ketentuan" target="_blank">Syarat & Ketentuan</Link> dan{' '}
                <Link href="/kebijakan-privasi" target="_blank">Kebijakan Privasi</Link>.
              </span>
            </label>
            {errors.acceptTerms && <p id="acceptTerms-error" className="field-error">{errors.acceptTerms}</p>}
          </div>

          <div aria-live="assertive">{formError && <p className="field-error">{formError}</p>}</div>
          <button type="submit" className="btn btn-primary mt-5 w-full">
            {submitting ? 'Membuat pesanan…' : 'Lanjut ke pembayaran'}
          </button>
          <p className="mt-3 text-base text-muted">QRIS, transfer virtual account, e-wallet, atau kartu.</p>
        </div>
      </aside>
    </form>
  )
}
