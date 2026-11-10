import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-5">
      <h1 className="text-5xl font-normal">Halaman tidak ditemukan</h1>
      <p className="mt-4 text-muted">Alamatnya mungkin salah ketik atau halamannya sudah dipindahkan.</p>
      <p className="mt-6">
        <Link href="/">Kembali ke beranda</Link>
      </p>
    </main>
  )
}
