import { z } from 'zod'

import { normalizePhone } from '../phone'

export const contactFields = {
  customerName: z.string().trim().min(2, 'Isi nama lengkap penerima, minimal 2 huruf.'),
  customerEmail: z.email('Periksa alamat email, contoh: nama@email.com.'),
  customerPhone: z
    .string()
    .refine((value) => normalizePhone(value) !== null, 'Isi nomor WhatsApp aktif, contoh: 0812 3456 7890.'),
  addressStreet: z.string().trim().min(10, 'Tulis alamat lengkap: jalan, nomor rumah, RT/RW.'),
  postalCode: z.string().regex(/^\d{5}$/, 'Kode pos terdiri dari 5 angka.'),
}

export const checkoutSchema = z.object({
  ...contactFields,
  areaId: z.string().min(1, 'Cari lalu pilih kecamatan tujuan.'),
  areaLabel: z.string().min(1),
  courierCode: z.string().min(1, 'Pilih salah satu layanan kurir.'),
  serviceCode: z.string().min(1, 'Pilih salah satu layanan kurir.'),
  acceptTerms: z.literal(true, 'Centang persetujuan Syarat & Ketentuan untuk melanjutkan.'),
  items: z
    .array(z.object({ productId: z.number().int().positive(), quantity: z.number().int().positive() }))
    .min(1, 'Keranjang Anda masih kosong.'),
})

export type CheckoutInput = z.infer<typeof checkoutSchema>
