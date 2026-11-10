import { EmptyState } from '@/components/EmptyState'

export default function NotFound() {
  return (
    <EmptyState
      title="Halaman tidak ditemukan"
      body="Alamatnya mungkin salah ketik atau halamannya sudah dipindahkan."
      href="/"
      action="Kembali ke beranda"
    />
  )
}
