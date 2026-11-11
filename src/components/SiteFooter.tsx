import Image from 'next/image'
import Link from 'next/link'

import { getSiteSettings } from '@/lib/content'
import { CONTACT } from '@/lib/site'

import logo from '../../public/logo-tallownara.png'
import { TemplateText } from './TemplateText'

const COLUMNS = [
  {
    heading: 'Belanja',
    links: [
      { href: '/produk', label: 'Semua produk' },
      { href: '/keranjang', label: 'Keranjang' },
      { href: '/lacak', label: 'Lacak pesanan' },
      { href: '/riwayat', label: 'Riwayat pesanan' },
    ],
  },
  {
    heading: 'Perusahaan',
    links: [
      { href: '/tentang-kami', label: 'Tentang kami' },
      { href: '/galeri', label: 'Pencapaian dan acara' },
      { href: '/kontak', label: 'Kontak' },
      { href: '/faq', label: 'FAQ' },
    ],
  },
  {
    heading: 'Kebijakan',
    links: [
      { href: '/syarat-ketentuan', label: 'Syarat & Ketentuan' },
      { href: '/kebijakan-pengembalian', label: 'Pengembalian' },
      { href: '/kebijakan-privasi', label: 'Privasi' },
    ],
  },
]

export async function SiteFooter() {
  const settings = await getSiteSettings()

  return (
    <footer className="mt-auto pt-10">
      <div className="page-shell pb-3 sm:pb-4">
        <div className="overflow-hidden rounded-[var(--radius-lg)] bg-olive-deep text-ivory [&_a]:text-ivory [&_a:hover]:text-white">
          <div className="grid grid-cols-12 gap-x-6 gap-y-12 px-6 py-12 sm:px-12 sm:py-16">
            <div className="col-span-12 lg:col-span-5">
              <Image src={logo} alt="Tallownara" className="h-10 w-auto brightness-0 invert" />
              <p className="mt-6 max-w-sm font-serif text-2xl leading-snug">
                Perawatan kulit murni, dari alam untuk keindahan sejatimu.
              </p>
              <ul className="mt-6 space-y-1 text-base">
                <li>
                  <a href={CONTACT.whatsappUrl}>WhatsApp {CONTACT.whatsappDisplay}</a>
                </li>
                <li>
                  <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
                </li>
                <li>
                  <a href={CONTACT.instagramUrl}>Instagram {CONTACT.instagramHandle}</a>
                </li>
              </ul>
            </div>

            <div className="col-span-12 grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:col-span-6 lg:col-start-7">
              {COLUMNS.map(({ heading, links }) => (
                <div key={heading}>
                  <h2 className="font-sans text-base font-semibold tracking-normal text-ivory">{heading}</h2>
                  <ul className="mt-4 space-y-2 text-base">
                    {links.map(({ href, label }) => (
                      <li key={href}>
                        <Link href={href} className="no-underline hover:underline">
                          {label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t border-white/15 bg-black/10">
            <div className="space-y-1 px-6 py-6 text-sm sm:px-12">
              <p>
                <TemplateText text={settings?.legalName ?? '[[ISI: nama badan usaha]]'} /> · NIB{' '}
                <TemplateText text={settings?.nib ?? '[[ISI: NIB]]'} />
              </p>
              <p>
                <TemplateText text={settings?.legalAddress ?? '[[ISI: alamat badan usaha]]'} />
              </p>
              <p>© {new Date().getFullYear()} Tallownara</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
