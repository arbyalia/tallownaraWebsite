import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { MediaImage } from '@/components/MediaImage'
import { Paragraphs } from '@/components/Paragraphs'
import { AddToCart } from '@/components/shop/AddToCart'
import { Price } from '@/components/shop/Price'
import { ReviewForm } from '@/components/shop/ReviewForm'
import { TemplateText } from '@/components/TemplateText'
import { getApprovedReviews, getProductBySlug } from '@/lib/content'
import { CONTACT } from '@/lib/site'

export const dynamic = 'force-dynamic'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const product = await getProductBySlug((await params).slug)
  return product ? { title: product.name, description: product.tagline ?? undefined } : {}
}

function Detail({ title, children, open }: { title: string; children: React.ReactNode; open?: boolean }) {
  return (
    <details open={open} className="group border-t border-stone last:border-b">
      <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between font-semibold text-ink">
        {title}
        <span aria-hidden className="text-xl text-olive group-open:hidden">+</span>
        <span aria-hidden className="hidden text-xl text-olive group-open:inline">−</span>
      </summary>
      <div className="pb-6">{children}</div>
    </details>
  )
}

export default async function ProductPage({ params }: Props) {
  const product = await getProductBySlug((await params).slug)
  if (!product) notFound()

  const reviews = await getApprovedReviews(product.id)
  const images = product.images ?? []
  const benefits = product.benefits ?? []
  const steps = product.howToUse ?? []

  return (
    <div className="page-shell pb-20">
      <nav aria-label="Jejak halaman" className="py-5 text-base text-muted">
        <Link href="/produk">Produk</Link> <span aria-hidden>/</span> <span aria-current="page">{product.name}</span>
      </nav>

      <div className="grid grid-cols-12 gap-x-6 gap-y-10">
        <div className="col-span-12 grid grid-cols-2 gap-3 lg:col-span-7">
          {images.length === 0 && <div className="panel col-span-2 aspect-square" />}
          {images.map((image, index) => (
            <div key={typeof image === 'number' ? image : image.id} className={`panel p-8 ${index === 0 ? 'col-span-2 sm:p-16' : 'rounded-[var(--radius-md)]'}`}>
              <MediaImage
                media={image}
                fit="contain"
                priority={index === 0}
                sizes={index === 0 ? '(min-width: 1024px) 55vw, 100vw' : '(min-width: 1024px) 27vw, 50vw'}
                className="aspect-square"
              />
            </div>
          ))}
        </div>

        <div className="col-span-12 lg:col-span-5">
          <div className="lg:sticky lg:top-28 lg:pl-8">
            <h1 className="text-[clamp(2.5rem,4.5vw,3.75rem)] font-normal">{product.name}</h1>
            {product.tagline && <p className="mt-3 text-muted">{product.tagline}</p>}
            <Price amount={product.price} isExample={product.isExamplePrice} className="mt-6 text-2xl font-semibold" />
            <p className="mt-1 text-base text-muted">
              Ukuran <TemplateText text={product.sizeLabel} />
            </p>

            <div className="mt-6">
              <AddToCart productId={product.id} productName={product.name} stock={product.stock} />
            </div>
            <a href={CONTACT.whatsappUrl} className="link-arrow">
              Tanya produk ini lewat WhatsApp
            </a>

            <div className="mt-8 flex items-center gap-4 border-t border-stone pt-6">
              <span className="relative block h-16 w-12 shrink-0">
                <Image src="/foto/sertifikasi-halal.webp" alt="Label Halal Indonesia" fill sizes="48px" className="object-contain" />
              </span>
              <dl className="text-base">
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-muted">BPOM</dt>
                  <dd className="tabular font-semibold">
                    <TemplateText text={product.bpomNumber} />
                  </dd>
                </div>
                <div className="flex flex-wrap gap-x-2">
                  <dt className="text-muted">Sertifikat halal</dt>
                  <dd className="tabular font-semibold">
                    <TemplateText text={product.halalNumber} />
                  </dd>
                </div>
              </dl>
            </div>

            <div className="mt-8">
              {product.description && (
                <Detail title="Deskripsi" open>
                  <Paragraphs text={product.description} />
                </Detail>
              )}
              {benefits.length > 0 && (
                <Detail title="Manfaat">
                  <ul className="list-disc space-y-2 pl-5 marker:text-olive">
                    {benefits.map((benefit) => (
                      <li key={benefit.id ?? benefit.text}>{benefit.text}</li>
                    ))}
                  </ul>
                </Detail>
              )}
              {steps.length > 0 && (
                <Detail title="Cara pakai">
                  <ol className="list-decimal space-y-2 pl-5 marker:text-olive">
                    {steps.map((step) => (
                      <li key={step.id ?? step.text}>{step.text}</li>
                    ))}
                  </ol>
                </Detail>
              )}
              {product.ingredients && (
                <Detail title="Komposisi">
                  <p><TemplateText text={product.ingredients} /></p>
                </Detail>
              )}
              {product.storage && (
                <Detail title="Penyimpanan">
                  <Paragraphs text={product.storage} />
                </Detail>
              )}
            </div>
          </div>
        </div>
      </div>

      <section className="mt-20 grid grid-cols-12 gap-x-6 gap-y-10 border-t border-stone pt-14">
        <div className="col-span-12 lg:col-span-7">
          <h2 className="section-title">Ulasan pembeli</h2>
          {reviews.length === 0 ? (
            <p className="mt-6 text-muted">Belum ada ulasan untuk produk ini. Jadilah yang pertama menulisnya.</p>
          ) : (
            <ul className="mt-8">
              {reviews.map((review) => (
                <li key={review.id} className="border-t border-stone py-6">
                  <p aria-label={`Nilai ${review.rating} dari 5`} className="text-amber">
                    {'★'.repeat(review.rating)}
                  </p>
                  <p className="mt-2">{review.body}</p>
                  <p className="mt-2 text-base text-muted">
                    {review.authorName}
                    {review.authorNote ? `, ${review.authorNote}` : ''}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div className="col-span-12 lg:col-span-4 lg:col-start-9">
          <h3 className="text-3xl font-normal">Tulis ulasan</h3>
          <p className="mb-5 mt-2 text-base text-muted">Ulasan tampil setelah kami periksa.</p>
          <ReviewForm productId={product.id} />
        </div>
      </section>
    </div>
  )
}
