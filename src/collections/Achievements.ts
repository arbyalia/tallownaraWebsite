import type { CollectionConfig } from 'payload'

export const Achievements: CollectionConfig = {
  slug: 'achievements',
  labels: { singular: 'Pencapaian atau acara', plural: 'Pencapaian dan acara' },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'kind', 'dateLabel', 'sortOrder', 'isVisible'],
  },
  defaultSort: 'sortOrder',
  fields: [
    { name: 'title', type: 'text', label: 'Nama lomba atau acara', required: true },
    {
      name: 'kind',
      type: 'select',
      label: 'Jenis',
      required: true,
      defaultValue: 'acara',
      options: [
        { label: 'Lomba', value: 'lomba' },
        { label: 'Acara', value: 'acara' },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'dateLabel',
          type: 'text',
          label: 'Waktu',
          admin: { description: 'Contoh: Mei 2026' },
        },
        { name: 'location', type: 'text', label: 'Lokasi' },
      ],
    },
    { name: 'summary', type: 'textarea', label: 'Cerita singkat' },
    {
      name: 'photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      label: 'Foto',
    },
    {
      name: 'sortOrder',
      type: 'number',
      label: 'Urutan',
      defaultValue: 100,
      required: true,
      admin: { position: 'sidebar', description: 'Angka kecil tampil lebih dulu.' },
    },
    {
      name: 'isVisible',
      type: 'checkbox',
      label: 'Tampilkan di website',
      defaultValue: true,
      admin: { position: 'sidebar' },
    },
  ],
}
