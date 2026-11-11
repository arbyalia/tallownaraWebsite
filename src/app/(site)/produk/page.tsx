import type { Metadata } from 'next'
import Image from 'next/image'

import { CertStrip } from '@/components/CertStrip'
import { EmptyState } from '@/components/EmptyState'
import { ProductCard } from '@/components/shop/ProductCard'
import { getProducts } from '@/lib/content'
import { CONTACT } from '@/lib/site'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Produk',
  description: 'Balm dan sabun tallow sapi grass-fed, terdaftar di BPOM dan halal.',
}

export default async function ProductsPage() {
  const products = await getProducts()

  if (products.length === 0) {
    return (
      <EmptyState
        title="Produk sedang disiapkan"
        body="Hubungi kami lewat WhatsApp untuk memesan lebih dulu."
        href={CONTACT.whatsappUrl}
        action="Tanya lewat WhatsApp"
      />
    )
  }

  return (
    <>
      <section className="page-shell grid grid-cols-12 items-end gap-x-6 gap-y-6 pb-14 pt-14 sm:pt-20">
        <div className="col-span-12 lg:col-span-8">
          <p className="kicker">Toko</p>
          <h1 className="display mt-4">Produk</h1>
          <p className="mt-6 max-w-xl">
            Setiap produk memakai tallow dari sapi yang diberi pakan rumput, diolah di Tuban, dan
            terdaftar di BPOM.
          </p>
        </div>
        <div className="relative col-span-4 hidden aspect-[9/7] lg:block">
          <Image src="/foto/batu-daun.webp" alt="" fill sizes="30vw" className="object-contain" />
        </div>
      </section>
      <section className="page-shell pb-20 pt-4">
        <h2 className="sr-only">Daftar produk</h2>
        <div className="grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, index) => (
            <ProductCard key={product.id} product={product} priority={index === 0} />
          ))}
        </div>
      </section>
      <section aria-label="Sertifikasi" className="page-shell">
        <div className="panel-white px-6 py-6 sm:px-10">
          <CertStrip />
        </div>
      </section>
    </>
  )
}
