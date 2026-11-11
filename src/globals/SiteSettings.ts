import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: 'Identitas dan angka',
  fields: [
    { name: 'legalName', type: 'text', label: 'Nama badan usaha' },
    { name: 'legalAddress', type: 'textarea', label: 'Alamat badan usaha' },
    { name: 'nib', type: 'text', label: 'NIB' },
    { name: 'hours', type: 'text', label: 'Jam operasional' },
    {
      name: 'stats',
      type: 'array',
      label: 'Angka di beranda',
      labels: { singular: 'Angka', plural: 'Angka' },
      fields: [
        { name: 'value', type: 'text', label: 'Nilai', required: true },
        { name: 'label', type: 'text', label: 'Keterangan', required: true },
      ],
    },
  ],
}
