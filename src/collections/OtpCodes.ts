import type { CollectionConfig } from 'payload'

export const OtpCodes: CollectionConfig = {
  slug: 'otp-codes',
  labels: { singular: 'Kode OTP', plural: 'Kode OTP' },
  admin: { hidden: true },
  access: { read: () => false, create: () => false, update: () => false, delete: () => false },
  fields: [
    { name: 'phone', type: 'text', required: true, index: true },
    { name: 'codeHash', type: 'text', required: true },
    { name: 'expiresAt', type: 'date', required: true },
    { name: 'attempts', type: 'number', required: true, defaultValue: 0 },
    { name: 'consumedAt', type: 'date' },
  ],
}
