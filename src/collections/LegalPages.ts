import type { CollectionConfig } from 'payload'

export const LegalPages: CollectionConfig = {
  slug: 'legal-pages',
  labels: { singular: 'Halaman kebijakan', plural: 'Halaman kebijakan' },
  admin: { useAsTitle: 'title', group: 'Konten', defaultColumns: ['title', 'slug', 'updatedLabel'] },
  fields: [
    { name: 'title', type: 'text', label: 'Judul', required: true },
    { name: 'slug', type: 'text', label: 'Alamat halaman', required: true, unique: true },
    { name: 'lead', type: 'textarea', label: 'Pengantar' },
    { name: 'updatedLabel', type: 'text', label: 'Terakhir diperbarui' },
    {
      name: 'sections',
      type: 'array',
      label: 'Bagian',
      labels: { singular: 'Bagian', plural: 'Bagian' },
      fields: [
        { name: 'heading', type: 'text', label: 'Judul bagian', required: true },
        { name: 'body', type: 'textarea', label: 'Isi', required: true, admin: { rows: 6, description: 'Pisahkan paragraf dengan satu baris kosong.' } },
      ],
    },
  ],
}
