'use client'

export default function ErrorPage({ retry }: { error: unknown; retry: () => void }) {
  return (
    <div role="alert" className="page-shell flex flex-1 flex-col justify-center py-24">
      <h1 className="text-5xl font-normal">Halaman gagal dimuat</h1>
      <p className="mt-4 max-w-xl text-muted">
        Terjadi gangguan di sisi kami. Muat ulang, atau hubungi hello@tallownara.com bila masih
        berlanjut.
      </p>
      <p className="mt-6">
        <button
          type="button"
          onClick={() => retry()}
          className="cursor-pointer rounded-[4px] bg-forest px-5 py-3 font-medium text-ivory hover:bg-olive-deep"
        >
          Coba lagi
        </button>
      </p>
    </div>
  )
}
