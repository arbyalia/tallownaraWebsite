import type { Metadata } from 'next'
import Image from 'next/image'

import { TemplateText } from '@/components/TemplateText'
import { getSiteSettings } from '@/lib/content'
import { CONTACT } from '@/lib/site'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Kontak', description: 'Hubungi Tallownara lewat WhatsApp, email, atau Instagram.' }

export default async function ContactPage() {
  const settings = await getSiteSettings()
  const rows = [
    { label: 'WhatsApp', value: CONTACT.whatsappDisplay, href: CONTACT.whatsappUrl },
    { label: 'Email', value: CONTACT.email, href: `mailto:${CONTACT.email}` },
    { label: 'Instagram', value: CONTACT.instagramHandle, href: CONTACT.instagramUrl },
  ]

  return (
    <div className="page-shell grid grid-cols-12 items-start gap-x-6 gap-y-10 pb-20 pt-12 sm:pt-16">
      <div className="col-span-12 lg:col-span-6">
        <h1 className="display">Kontak</h1>
        <p className="mt-4 max-w-md text-muted">Kami senang membantu soal produk, pesanan, kemitraan, dan lokakarya.</p>
        <dl className="mt-10">
          {rows.map(({ label, value, href }) => (
            <div key={label} className="grid grid-cols-3 gap-4 border-t border-stone py-4">
              <dt className="text-muted">{label}</dt>
              <dd className="col-span-2 font-semibold">
                <a href={href}>{value}</a>
              </dd>
            </div>
          ))}
          <div className="grid grid-cols-3 gap-4 border-t border-stone py-4">
            <dt className="text-muted">Jam layanan</dt>
            <dd className="col-span-2"><TemplateText text={settings?.hours} /></dd>
          </div>
          <div className="grid grid-cols-3 gap-4 border-y border-stone py-4">
            <dt className="text-muted">Alamat</dt>
            <dd className="col-span-2"><TemplateText text={settings?.legalAddress} /></dd>
          </div>
        </dl>
      </div>
      <div className="relative col-span-12 aspect-[4/5] overflow-hidden rounded-[var(--radius-lg)] lg:col-span-5 lg:col-start-8">
        <Image src="/foto/hero-potret.webp" alt="Produk Tallownara di peternakan saat senja" fill priority sizes="(min-width: 1024px) 40vw, 100vw" className="object-cover" />
      </div>
    </div>
  )
}
