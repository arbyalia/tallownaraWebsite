'use client'

export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <main role="alert" className="mx-auto flex min-h-dvh max-w-2xl flex-col justify-center px-5">
      <h1 className="text-5xl font-normal">Halaman gagal dimuat</h1>
      <p className="mt-4 text-muted">
        Terjadi gangguan di sisi kami. Muat ulang, atau hubungi hello@tallownara.com bila masih
        berlanjut.
      </p>
      <p className="mt-6">
        <button
          type="button"
          onClick={reset}
          className="cursor-pointer rounded-[4px] bg-forest px-5 py-3 font-medium text-ivory hover:bg-olive-deep"
        >
          Coba lagi
        </button>
      </p>
    </main>
  )
}
