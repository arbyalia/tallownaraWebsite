import type { GlobalConfig } from 'payload'

const PARAGRAPH_HINT = 'Pisahkan paragraf dengan satu baris kosong.'

export const About: GlobalConfig = {
  slug: 'about',
  label: 'Tentang kami',
  fields: [
    {
      type: 'tabs',
      tabs: [
        {
          label: 'Cerita',
          fields: [
            { name: 'heroTitle', type: 'text', label: 'Judul halaman' },
            {
              name: 'storyBody',
              type: 'textarea',
              label: 'Cerita merek',
              admin: { description: PARAGRAPH_HINT, rows: 12 },
            },
            { name: 'storyImage', type: 'upload', relationTo: 'media', label: 'Foto cerita' },
          ],
        },
        {
          label: 'Visi dan misi',
          fields: [
            { name: 'vision', type: 'textarea', label: 'Visi' },
            {
              name: 'missions',
              type: 'array',
              label: 'Misi',
              labels: { singular: 'Misi', plural: 'Misi' },
              fields: [{ name: 'text', type: 'textarea', label: 'Isi misi', required: true }],
            },
          ],
        },
        {
          label: 'Bahan baku dan proses',
          fields: [
            { name: 'sourcingTitle', type: 'text', label: 'Judul bagian' },
            {
              name: 'sourcingBody',
              type: 'textarea',
              label: 'Uraian',
              admin: { description: PARAGRAPH_HINT, rows: 8 },
            },
            { name: 'sourcingImage', type: 'upload', relationTo: 'media', label: 'Foto proses' },
            {
              name: 'sourcingPoints',
              type: 'array',
              label: 'Poin penting',
              labels: { singular: 'Poin', plural: 'Poin' },
              fields: [
                { name: 'title', type: 'text', label: 'Judul poin', required: true },
                { name: 'body', type: 'textarea', label: 'Penjelasan', required: true },
              ],
            },
          ],
        },
        {
          label: 'Tim',
          fields: [
            {
              name: 'team',
              type: 'array',
              label: 'Anggota tim',
              labels: { singular: 'Anggota', plural: 'Anggota' },
              fields: [
                { name: 'name', type: 'text', label: 'Nama lengkap dan gelar', required: true },
                { name: 'role', type: 'text', label: 'Jabatan atau instansi', required: true },
                {
                  name: 'group',
                  type: 'select',
                  label: 'Kelompok',
                  required: true,
                  defaultValue: 'founder',
                  options: [
                    { label: 'Tim pendiri', value: 'founder' },
                    { label: 'Penasihat', value: 'advisor' },
                  ],
                },
                { name: 'photo', type: 'upload', relationTo: 'media', label: 'Foto' },
              ],
            },
          ],
        },
      ],
    },
  ],
}
