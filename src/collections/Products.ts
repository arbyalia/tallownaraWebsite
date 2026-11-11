import type { CollectionConfig } from 'payload'

const wholeNumber = (value: unknown) =>
  Number.isInteger(value) && Number(value) >= 0 ? true : 'Isi dengan angka bulat tanpa titik atau koma.'

export const Products: CollectionConfig = {
  slug: 'products',
  labels: { singular: 'Produk', plural: 'Produk' },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'price', 'stock', 'bpomNumber', 'isVisible'],
    group: 'Toko',
  },
  defaultSort: 'sortOrder',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Utama',
          fields: [
            { name: 'name', type: 'text', label: 'Nama produk', required: true },
            {
              name: 'slug',
              type: 'text',
              label: 'Alamat halaman',
              required: true,
              unique: true,
              admin: { description: 'Huruf kecil dan tanda hubung. Contoh: luxury-tallow-balm' },
            },
            { name: 'tagline', type: 'text', label: 'Keterangan singkat' },
            { name: 'sizeLabel', type: 'text', label: 'Ukuran', admin: { description: 'Contoh: 120 ml' } },
            {
              type: 'row',
              fields: [
                { name: 'price', type: 'number', label: 'Harga (rupiah)', required: true, validate: wholeNumber },
                { name: 'stock', type: 'number', label: 'Stok', required: true, defaultValue: 0, validate: wholeNumber },
                { name: 'weightGrams', type: 'number', label: 'Berat kirim (gram)', required: true, validate: wholeNumber },
              ],
            },
            {
              name: 'isExamplePrice',
              type: 'checkbox',
              label: 'Harga masih contoh',
              defaultValue: true,
              admin: { description: 'Hilangkan centang setelah harga asli diisi. Selama tercentang, website menandai harga sebagai contoh.' },
            },
            { name: 'images', type: 'upload', relationTo: 'media', hasMany: true, label: 'Foto produk' },
          ],
        },
        {
          label: 'Keterangan',
          fields: [
            { name: 'description', type: 'textarea', label: 'Deskripsi', admin: { rows: 6, description: 'Pakai bahasa kosmetik. Hindari klaim mengobati atau menyembuhkan.' } },
            { name: 'benefits', type: 'array', label: 'Manfaat', labels: { singular: 'Manfaat', plural: 'Manfaat' }, fields: [{ name: 'text', type: 'text', label: 'Isi', required: true }] },
            { name: 'howToUse', type: 'array', label: 'Cara pakai', labels: { singular: 'Langkah', plural: 'Langkah' }, fields: [{ name: 'text', type: 'textarea', label: 'Isi', required: true }] },
            { name: 'ingredients', type: 'textarea', label: 'Komposisi' },
            { name: 'storage', type: 'textarea', label: 'Penyimpanan' },
          ],
        },
        {
          label: 'Legal',
          fields: [
            { name: 'bpomNumber', type: 'text', label: 'Nomor notifikasi BPOM', required: true },
            { name: 'halalNumber', type: 'text', label: 'Nomor sertifikat halal', required: true },
          ],
        },
      ],
    },
    { name: 'isBestSeller', type: 'checkbox', label: 'Produk terlaris', defaultValue: false, admin: { position: 'sidebar' } },
    { name: 'isVisible', type: 'checkbox', label: 'Tampilkan di website', defaultValue: true, admin: { position: 'sidebar' } },
    { name: 'sortOrder', type: 'number', label: 'Urutan', defaultValue: 100, required: true, admin: { position: 'sidebar', description: 'Angka kecil tampil lebih dulu.' } },
  ],
}
