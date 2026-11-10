import { CONTACT } from '@/lib/site'

export default function HomePage() {
  return (
    <div className="page-shell grid flex-1 grid-cols-12 content-center gap-x-6 gap-y-10 py-16 sm:py-24">
      <div className="col-span-12 lg:col-span-9">
        <p className="text-sm text-muted sm:text-base">Tuban, Jawa Timur</p>
        <h1 className="mt-4 text-[3.5rem] font-normal sm:text-[4.5rem] lg:text-[5.5rem]">
          Tallow sapi grass-fed untuk kulit yang terawat.
        </h1>
      </div>

      <div className="col-span-12 border-t border-stone pt-6 sm:col-span-8 sm:col-start-5 lg:col-span-5 lg:col-start-8">
        <p>
          Balm dan sabun yang melembapkan serta membantu menjaga skin barrier. Terdaftar di BPOM,
          halal, dan organik.
        </p>
        <p className="mt-4 text-muted">Toko online kami sedang disiapkan.</p>
        <a
          href={CONTACT.whatsappUrl}
          className="mt-6 inline-block rounded-[4px] bg-forest px-5 py-3 font-medium text-ivory no-underline transition-colors duration-200 hover:bg-olive-deep hover:text-ivory"
        >
          Tanya lewat WhatsApp
        </a>
      </div>
    </div>
  )
}
