import { randomInt } from 'node:crypto'

// Tanpa 0, O, 1, I, L agar mudah dibaca dan didiktekan.
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'

export function generateOrderCode(): string {
  let suffix = ''
  for (let i = 0; i < 6; i += 1) suffix += ALPHABET[randomInt(ALPHABET.length)]
  return `TLN-${suffix}`
}

export function normalizeOrderCode(input: string): string {
  const cleaned = input.trim().toUpperCase().replace(/\s+/g, '')
  return cleaned.startsWith('TLN-') ? cleaned : `TLN-${cleaned.replace(/^TLN/, '')}`
}
