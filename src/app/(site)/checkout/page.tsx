import type { Metadata } from 'next'

import { CheckoutClient } from '@/components/shop/CheckoutClient'
import { getProducts } from '@/lib/content'
import { toCartProduct } from '@/lib/shop-types'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Checkout' }

export default async function CheckoutPage() {
  const products = await getProducts()
  return <CheckoutClient products={products.map(toCartProduct)} />
}
