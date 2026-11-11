import type { Metadata } from 'next'

import { CartView } from '@/components/shop/CartView'
import { getProducts } from '@/lib/content'
import { toCartProduct } from '@/lib/shop-types'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Keranjang' }

export default async function CartPage() {
  const products = await getProducts()
  return <CartView products={products.map(toCartProduct)} />
}
