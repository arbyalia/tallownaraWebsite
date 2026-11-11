'use client'

import { useState, useTransition } from 'react'

import { submitReviewAction } from '@/lib/actions'

export function ReviewForm({ productId }: { productId: number }) {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [sent, setSent] = useState(false)
  const [pending, startTransition] = useTransition()

  if (sent) {
    return (
      <p role="status" className="border-l-2 border-forest pl-4 text-forest">
        Terima kasih. Ulasan Anda sedang kami periksa.
      </p>
    )
  }

  const submit = (formData: FormData) => {
    if (pending) return
    startTransition(async () => {
      const result = await submitReviewAction({
        productId,
        authorName: String(formData.get('authorName') ?? ''),
        rating: Number(formData.get('rating') ?? 0),
        body: String(formData.get('body') ?? ''),
        website: String(formData.get('website') ?? ''),
      })
      if (result.ok) setSent(true)
      else setErrors(result.errors)
    })
  }

  return (
    <form action={submit} noValidate className="space-y-5">
      <div>
        <label htmlFor="review-name" className="field-label">Nama</label>
        <input id="review-name" name="authorName" autoComplete="name" className="field-input" aria-invalid={Boolean(errors.authorName)} aria-describedby="review-name-error" />
        {errors.authorName && <p id="review-name-error" className="field-error">{errors.authorName}</p>}
      </div>
      <fieldset>
        <legend className="field-label">Nilai</legend>
        <div className="flex flex-wrap gap-4">
          {[5, 4, 3, 2, 1].map((value) => (
            <label key={value} className="inline-flex min-h-11 items-center gap-2">
              <input type="radio" name="rating" value={value} defaultChecked={value === 5} className="h-5 w-5 accent-forest" />
              {value}
            </label>
          ))}
        </div>
        {errors.rating && <p className="field-error">{errors.rating}</p>}
      </fieldset>
      <div>
        <label htmlFor="review-body" className="field-label">Ulasan</label>
        <textarea id="review-body" name="body" rows={4} className="field-input" aria-invalid={Boolean(errors.body)} aria-describedby="review-body-error" />
        {errors.body && <p id="review-body-error" className="field-error">{errors.body}</p>}
      </div>
      <div aria-hidden className="absolute left-[-9999px]">
        <label>
          Website
          <input name="website" tabIndex={-1} autoComplete="off" />
        </label>
      </div>
      {errors.form && <p role="alert" className="field-error">{errors.form}</p>}
      <button type="submit" className="btn btn-outline">{pending ? 'Mengirim ulasan…' : 'Kirim ulasan'}</button>
    </form>
  )
}
