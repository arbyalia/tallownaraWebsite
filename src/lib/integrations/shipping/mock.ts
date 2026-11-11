import type { ShippingAdapter, ShippingArea, ShippingRate } from './types'

const AREAS: (ShippingArea & { zone: number })[] = [
  ['Tuban', 'Kab. Tuban, Jawa Timur', '62311', 0],
  ['Merakurak', 'Kab. Tuban, Jawa Timur', '62355', 0],
  ['Gubeng', 'Kota Surabaya, Jawa Timur', '60281', 1],
  ['Lowokwaru', 'Kota Malang, Jawa Timur', '65141', 1],
  ['Banyumanik', 'Kota Semarang, Jawa Tengah', '50263', 1],
  ['Depok', 'Kab. Sleman, DI Yogyakarta', '55281', 1],
  ['Kebayoran Baru', 'Kota Jakarta Selatan, DKI Jakarta', '12110', 2],
  ['Menteng', 'Kota Jakarta Pusat, DKI Jakarta', '10310', 2],
  ['Cibinong', 'Kab. Bogor, Jawa Barat', '16911', 2],
  ['Coblong', 'Kota Bandung, Jawa Barat', '40132', 2],
  ['Serpong', 'Kota Tangerang Selatan, Banten', '15310', 2],
  ['Denpasar Selatan', 'Kota Denpasar, Bali', '80221', 2],
  ['Medan Baru', 'Kota Medan, Sumatera Utara', '20154', 3],
  ['Panakkukang', 'Kota Makassar, Sulawesi Selatan', '90231', 3],
  ['Balikpapan Selatan', 'Kota Balikpapan, Kalimantan Timur', '76114', 3],
].map(([name, region, postalCode, zone], index) => ({
  id: `mock-${index + 1}`,
  label: `${name}, ${region}`,
  postalCode: postalCode as string,
  zone: zone as number,
}))

const SERVICES = [
  { courierCode: 'jne', courierName: 'JNE', serviceCode: 'reg', serviceName: 'Reguler', perKg: [8000, 12000, 18000, 34000], estimate: ['1-2 hari', '2-3 hari', '2-4 hari', '4-6 hari'] },
  { courierCode: 'jnt', courierName: 'J&T Express', serviceCode: 'ez', serviceName: 'EZ', perKg: [8000, 11000, 17000, 32000], estimate: ['1-2 hari', '2-3 hari', '3-4 hari', '4-7 hari'] },
  { courierCode: 'sicepat', courierName: 'SiCepat', serviceCode: 'best', serviceName: 'Best', perKg: [12000, 18000, 26000, 48000], estimate: ['1 hari', '1-2 hari', '1-2 hari', '2-3 hari'] },
]

/** Data tiruan untuk pengembangan, dipakai selama belum ada API key Biteship. */
export function createMockShippingAdapter(): ShippingAdapter {
  return {
    name: 'mock',
    async searchAreas(query) {
      const needle = query.trim().toLowerCase()
      if (needle.length < 3) return []
      return AREAS.filter((area) => area.label.toLowerCase().includes(needle))
        .slice(0, 8)
        .map(({ id, label, postalCode }) => ({ id, label, postalCode }))
    },
    async getRates({ destinationAreaId, weightGrams }) {
      const area = AREAS.find((candidate) => candidate.id === destinationAreaId)
      if (!area) return []
      const kilograms = Math.max(1, Math.ceil(weightGrams / 1000))
      return SERVICES.map<ShippingRate>((service) => ({
        provider: 'mock',
        courierCode: service.courierCode,
        courierName: service.courierName,
        serviceCode: service.serviceCode,
        serviceName: service.serviceName,
        price: service.perKg[area.zone] * kilograms,
        estimate: service.estimate[area.zone],
      }))
    },
  }
}
