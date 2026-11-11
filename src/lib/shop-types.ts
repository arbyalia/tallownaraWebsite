import type { Media, Product } from '@/payload-types'

import type { OrderStatus } from './orders/status'

export type CartProduct = {
  id: number
  slug: string
  name: string
  sizeLabel: string | null
  price: number
  isExamplePrice: boolean
  stock: number
  imageUrl: string | null
  imageAlt: string
}

export function firstImage(product: Product): Media | null {
  const image = product.images?.[0]
  return image && typeof image !== 'number' ? image : null
}

export function toCartProduct(product: Product): CartProduct {
  const image = firstImage(product)
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    sizeLabel: product.sizeLabel ?? null,
    price: product.price,
    isExamplePrice: product.isExamplePrice ?? false,
    stock: product.stock,
    imageUrl: image?.url ?? null,
    imageAlt: image?.alt ?? product.name,
  }
}

export type PublicOrder = {
  code: string
  status: OrderStatus
  createdAt: string
  expiresAt: string
  items: { name: string; quantity: number; unitPrice: number }[]
  subtotal: number
  shippingCost: number
  total: number
  courierName: string
  serviceName: string
  trackingNumber: string | null
  areaLabel: string
  paymentUrl: string | null
  history: { status: string; at: string }[]
}
