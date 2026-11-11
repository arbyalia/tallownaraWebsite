export type ShippingArea = { id: string; label: string; postalCode: string }

export type ShippingRate = {
  provider: string
  courierCode: string
  courierName: string
  serviceCode: string
  serviceName: string
  price: number
  estimate: string
}

export type RateRequest = {
  destinationAreaId: string
  weightGrams: number
  itemValue: number
}

export interface ShippingAdapter {
  name: string
  searchAreas(query: string): Promise<ShippingArea[]>
  getRates(request: RateRequest): Promise<ShippingRate[]>
}
