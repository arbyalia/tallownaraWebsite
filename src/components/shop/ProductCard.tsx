import Link from 'next/link'

import { firstImage } from '@/lib/shop-types'
import type { Product } from '@/payload-types'

import { MediaImage } from '../MediaImage'
import { AddToCart } from './AddToCart'
import { Price } from './Price'

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  return (
    <article className="reveal flex h-full flex-col">
      <Link
        href={`/produk/${product.slug}`}
        className="group panel relative block overflow-hidden bg-[radial-gradient(circle_at_50%_35%,var(--white),var(--paper)_70%)] p-8 no-underline transition-shadow duration-200 hover:shadow-[var(--shadow-float)] sm:p-10"
      >
        {product.isBestSeller && (
          <span className="glass chip absolute left-4 top-4 z-10 text-amber">Terlaris</span>
        )}
        <MediaImage
          media={firstImage(product)}
          fit="contain"
          priority={priority}
          sizes="(min-width: 1024px) 28vw, (min-width: 640px) 45vw, 85vw"
          className="aspect-square transition-transform duration-200 group-hover:-translate-y-1.5 group-hover:scale-[1.02]"
        />
      </Link>
      <div className="flex flex-1 flex-col px-1 pt-5">
        <h3 className="text-[1.75rem] font-normal">
          <Link href={`/produk/${product.slug}`} className="text-olive-deep no-underline hover:underline">
            {product.name}
          </Link>
        </h3>
        {product.tagline && <p className="mt-2 text-base text-muted">{product.tagline}</p>}
        <div className="mt-auto pt-4">
          <Price amount={product.price} isExample={product.isExamplePrice} />
          <p className="mb-4 mt-1 text-sm text-muted">BPOM {product.bpomNumber.startsWith('[[') ? 'menyusul' : product.bpomNumber} · Halal</p>
          <AddToCart compact productId={product.id} productName={product.name} stock={product.stock} />
        </div>
      </div>
    </article>
  )
}
