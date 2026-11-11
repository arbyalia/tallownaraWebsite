/** Mengubah nomor WA ke format +62, atau null bila bukan nomor seluler Indonesia. */
export function normalizePhone(input: string): string | null {
  const digits = input.replace(/[\s\-().]/g, '').replace(/^\+/, '')
  let national: string
  if (digits.startsWith('62')) national = digits.slice(2)
  else if (digits.startsWith('0')) national = digits.slice(1)
  else national = digits

  return /^8\d{7,12}$/.test(national) ? `+62${national}` : null
}

export function lastFourDigits(phone: string): string {
  return phone.slice(-4)
}
