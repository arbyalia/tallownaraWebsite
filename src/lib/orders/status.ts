export const ORDER_STATUSES = [
  'menunggu_pembayaran',
  'dibayar',
  'dikemas',
  'dikirim',
  'selesai',
  'kedaluwarsa',
  'dibatalkan',
  'dikembalikan',
] as const

export type OrderStatus = (typeof ORDER_STATUSES)[number]

export const STATUS_LABELS: Record<OrderStatus, string> = {
  menunggu_pembayaran: 'Menunggu pembayaran',
  dibayar: 'Dibayar',
  dikemas: 'Dikemas',
  dikirim: 'Dikirim',
  selesai: 'Selesai',
  kedaluwarsa: 'Kedaluwarsa',
  dibatalkan: 'Dibatalkan',
  dikembalikan: 'Dikembalikan',
}

export const MAIN_FLOW: OrderStatus[] = [
  'menunggu_pembayaran',
  'dibayar',
  'dikemas',
  'dikirim',
  'selesai',
]

const BRANCHES: Partial<Record<OrderStatus, OrderStatus[]>> = {
  menunggu_pembayaran: ['kedaluwarsa', 'dibatalkan'],
  dibayar: ['dibatalkan'],
  dikemas: ['dibatalkan'],
  dikirim: ['dikembalikan'],
  selesai: ['dikembalikan'],
}

/** Status hanya boleh maju. Pembayaran tidak boleh dilompati. */
export function canTransition(from: OrderStatus, to: OrderStatus): boolean {
  if (from === to) return false
  if (BRANCHES[from]?.includes(to)) return true

  const fromRank = MAIN_FLOW.indexOf(from)
  const toRank = MAIN_FLOW.indexOf(to)
  if (fromRank === -1 || toRank === -1 || toRank <= fromRank) return false
  if (from === 'menunggu_pembayaran') return to === 'dibayar'
  return true
}
