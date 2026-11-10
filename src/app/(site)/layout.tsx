import type { Metadata } from 'next'
import { Newsreader, Plus_Jakarta_Sans } from 'next/font/google'
import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/SiteFooter'
import { SiteHeader } from '@/components/SiteHeader'

import './globals.css'

const newsreader = Newsreader({
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
  display: 'swap',
  variable: '--font-newsreader',
})

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-plus-jakarta',
})

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'),
  title: {
    default: 'Tallownara · Perawatan kulit tallow sapi grass-fed',
    template: '%s · Tallownara',
  },
  description: 'Perawatan kulit berbahan tallow sapi grass-fed dari Tuban, Jawa Timur.',
}

export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="id" className={`${newsreader.variable} ${plusJakarta.variable}`}>
      <body className="flex min-h-dvh flex-col text-base sm:text-lg">
        <a
          href="#isi"
          className="sr-only focus:not-sr-only focus:absolute focus:left-5 focus:top-3 focus:z-10 focus:bg-ivory focus:px-3 focus:py-2"
        >
          Langsung ke isi
        </a>
        <SiteHeader />
        <main id="isi" tabIndex={-1} className="flex flex-1 flex-col focus:outline-none">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  )
}
