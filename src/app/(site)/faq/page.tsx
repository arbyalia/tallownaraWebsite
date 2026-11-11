import type { Metadata } from 'next'

import { EmptyState } from '@/components/EmptyState'
import { getFaqs } from '@/lib/content'
import { CONTACT } from '@/lib/site'
import type { Faq } from '@/payload-types'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'FAQ', description: 'Pertanyaan umum tentang produk, pesanan, dan pengiriman Tallownara.' }

const GROUPS: { value: Faq['category']; label: string }[] = [
  { value: 'produk', label: 'Produk' },
  { value: 'pesanan', label: 'Pesanan dan pembayaran' },
  { value: 'pengiriman', label: 'Pengiriman dan pengembalian' },
]

export default async function FaqPage() {
  const faqs = await getFaqs()

  if (faqs.length === 0) {
    return <EmptyState title="Pertanyaan sedang disusun" body="Tanyakan langsung kepada kami lewat WhatsApp." href={CONTACT.whatsappUrl} action="Tanya lewat WhatsApp" />
  }

  return (
    <div className="page-shell grid grid-cols-12 gap-x-6 pb-20 pt-12 sm:pt-16">
      <header className="col-span-12 lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <h1 className="display">FAQ</h1>
          <p className="mt-4 max-w-sm text-muted">
            Jawaban belum ada di sini? <a href={CONTACT.whatsappUrl}>Tanya kami lewat WhatsApp</a>.
          </p>
        </div>
      </header>
      <div className="col-span-12 mt-10 space-y-12 lg:col-span-7 lg:col-start-6 lg:mt-0">
        {GROUPS.map(({ value, label }) => {
          const items = faqs.filter((faq) => faq.category === value)
          if (items.length === 0) return null
          return (
            <section key={value}>
              <h2 className="text-3xl font-normal">{label}</h2>
              <div className="mt-4">
                {items.map((faq) => (
                  <details key={faq.id} className="group border-t border-stone last:border-b">
                    <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 py-3 font-semibold">
                      {faq.question}
                      <span aria-hidden className="text-xl text-olive group-open:rotate-45">+</span>
                    </summary>
                    <p className="pb-5 text-ink">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          )
        })}
      </div>
    </div>
  )
}
