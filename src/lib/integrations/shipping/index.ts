import { createBiteshipAdapter } from './biteship'
import { createMockShippingAdapter } from './mock'
import type { ShippingAdapter } from './types'

export function getShippingAdapter(): ShippingAdapter {
  return process.env.SHIPPING_PROVIDER === 'biteship' ? createBiteshipAdapter() : createMockShippingAdapter()
}
