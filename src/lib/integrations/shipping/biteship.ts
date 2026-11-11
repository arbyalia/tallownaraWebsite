import type { ShippingAdapter, ShippingArea, ShippingRate } from './types'

const BASE_URL = 'https://api.biteship.com/v1'
const COURIERS = 'jne,jnt,sicepat,anteraja,pos'

type BiteshipArea = { id: string; name: string; postal_code: number | string }
type BiteshipPricing = {
  courier_code: string
  courier_name: string
  courier_service_code: string
  courier_service_name: string
  price: number
  duration: string
}

export function createBiteshipAdapter(): ShippingAdapter {
  const apiKey = process.env.BITESHIP_API_KEY ?? ''
  const originAreaId = process.env.SHIPPING_ORIGIN_AREA_ID ?? ''
  const headers = { Authorization: apiKey, 'Content-Type': 'application/json' }

  return {
    name: 'biteship',
    async searchAreas(query) {
      const params = new URLSearchParams({ countries: 'ID', input: query, type: 'single' })
      const response = await fetch(`${BASE_URL}/maps/areas?${params}`, { headers })
      if (!response.ok) throw new Error(`Biteship areas gagal (${response.status})`)
      const data = (await response.json()) as { areas?: BiteshipArea[] }
      return (data.areas ?? []).map<ShippingArea>((area) => ({
        id: area.id,
        label: area.name,
        postalCode: String(area.postal_code ?? ''),
      }))
    },
    async getRates({ destinationAreaId, weightGrams, itemValue }) {
      const response = await fetch(`${BASE_URL}/rates/couriers`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          origin_area_id: originAreaId,
          destination_area_id: destinationAreaId,
          couriers: COURIERS,
          items: [{ name: 'Produk Tallownara', value: itemValue, weight: weightGrams, quantity: 1 }],
        }),
      })
      if (!response.ok) throw new Error(`Biteship rates gagal (${response.status})`)
      const data = (await response.json()) as { pricing?: BiteshipPricing[] }
      return (data.pricing ?? []).map<ShippingRate>((rate) => ({
        provider: 'biteship',
        courierCode: rate.courier_code,
        courierName: rate.courier_name,
        serviceCode: rate.courier_service_code,
        serviceName: rate.courier_service_name,
        price: rate.price,
        estimate: rate.duration,
      }))
    },
  }
}
