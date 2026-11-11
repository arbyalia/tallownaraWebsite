import type { CollectionConfig } from 'payload'

export const Reviews: CollectionConfig = {
  slug: 'reviews',
  labels: { singular: 'Ulasan', plural: 'Ulasan' },
  admin: {
    useAsTitle: 'authorName',
    defaultColumns: ['authorName', 'product', 'rating', 'status', 'createdAt'],
    group: 'Toko',
    description: 'Ulasan hanya tampil di website setelah statusnya Disetujui.',
  },
  fields: [
    { name: 'authorName', type: 'text', label: 'Nama', required: true },
    { name: 'authorNote', type: 'text', label: 'Keterangan penulis' },
    { name: 'product', type: 'relationship', relationTo: 'products', label: 'Produk' },
    { name: 'rating', type: 'number', label: 'Nilai (1-5)', required: true, min: 1, max: 5 },
    { name: 'body', type: 'textarea', label: 'Isi ulasan', required: true },
    { name: 'photo', type: 'upload', relationTo: 'media', label: 'Foto' },
    {
      name: 'status',
      type: 'select',
      label: 'Status',
      required: true,
      defaultValue: 'menunggu',
      options: [
        { label: 'Menunggu persetujuan', value: 'menunggu' },
        { label: 'Disetujui', value: 'disetujui' },
        { label: 'Ditolak', value: 'ditolak' },
      ],
      admin: { position: 'sidebar' },
    },
    { name: 'isFeatured', type: 'checkbox', label: 'Tampilkan di beranda', defaultValue: false, admin: { position: 'sidebar' } },
  ],
}
