import type { Metadata } from 'next'
import { Newsreader, Plus_Jakarta_Sans } from 'next/font/google'
import type { ReactNode } from 'react'

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
      <body className="min-h-dvh text-base sm:text-lg">{children}</body>
    </html>
  )
}
