import Image from 'next/image'
import Link from 'next/link'

// Langkah diambil dari petunjuk pakai di katalog produk; tanpa klaim manfaat baru.
const STEPS = [
  {
    title: 'Ambil secukupnya',
    body: 'Ambil sedikit balm dengan ujung jari, lalu gosok perlahan sampai melunak oleh hangat jari.',
  },
  {
    title: 'Oleskan tipis',
    body: 'Ratakan pada kulit yang terasa kering. Tambahkan sedikit demi sedikit sampai kulit terasa nyaman.',
  },
  {
    title: 'Pijat perlahan',
    body: 'Pijat dengan gerakan melingkar, lalu vertikal dan horizontal, sekitar 1 menit di area yang sama.',
  },
]

export function UsageGuide() {
  return (
    <section id="cara-pakai" aria-labelledby="judul-cara-pakai" className="scroll-mt-28 py-20 sm:py-28">
      <div className="page-shell grid grid-cols-12 items-center gap-x-6 gap-y-14">
        <div className="reveal relative col-span-12 md:col-span-10 md:col-start-2 lg:col-span-6 lg:col-start-1">
          <div className="media-round relative aspect-square shadow-[var(--shadow-float)]">
            <Image
              src="/foto/panduan-penggunaan.webp"
              alt="Toples Tallow Balm di atas alas kayu dengan keterangan: bahan alami, membantu mengunci kelembapan, aroma bunga yang lembut, dan lembut untuk kulit kering. BPOM NA18250118219."
              fill
              sizes="(min-width: 1024px) 45vw, (min-width: 768px) 80vw, 100vw"
              className="object-cover"
            />
          </div>
          <div className="glass glass-strong relative mx-4 -mt-12 max-w-xs sm:-mt-20 rounded-[var(--radius-md)] p-6 sm:mx-8 lg:absolute lg:-bottom-10 lg:-right-10 lg:m-0">
            <p className="text-sm font-semibold text-forest">Multifungsi</p>
            <p className="mt-1 text-lg font-semibold leading-snug text-olive-deep">Satu balm, banyak kegunaan</p>
            <p className="mt-2 text-base text-muted">
              Pelembap untuk wajah, tangan, dan bibir, juga cleansing balm untuk melepas riasan.
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-5 lg:col-start-8">
          <p className="kicker">Cara pakai</p>
          <h2 id="judul-cara-pakai" className="section-title mt-4">
            Panduan penggunaan tallow balm
          </h2>
          <p className="mt-6 max-w-lg text-muted">
            Di dalam toples teksturnya padat, lalu melunak saat menyentuh kulit. Tiga langkah ini
            cukup untuk pemakaian sehari-hari.
          </p>

          <ol className="mt-10 space-y-3">
            {STEPS.map(({ title, body }, index) => (
              <li key={title} className="reveal panel-white flex gap-5 rounded-[var(--radius-md)] p-5 sm:p-6">
                <span
                  aria-hidden
                  className="tabular grid h-11 w-11 shrink-0 place-items-center rounded-full border border-stone bg-white font-semibold text-olive-deep shadow-[0_1px_2px_rgb(34_32_26/0.08)]"
                >
                  {index + 1}
                </span>
                <div>
                  <h3 className="font-sans text-lg font-semibold tracking-normal text-olive-deep">
                    <span className="sr-only">Langkah {index + 1}: </span>
                    {title}
                  </h3>
                  <p className="mt-1 text-base text-muted">{body}</p>
                </div>
              </li>
            ))}
          </ol>

          <Link href="/produk" className="link-arrow mt-8">
            Lihat petunjuk tiap produk
          </Link>
        </div>
      </div>
    </section>
  )
}
