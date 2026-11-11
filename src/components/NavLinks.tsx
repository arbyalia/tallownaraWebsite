'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

import { CartLink } from './shop/CartLink'

const LINKS = [
  { href: '/produk', label: 'Produk' },
  { href: '/#cara-pakai', label: 'Cara pakai' },
  { href: '/tentang-kami', label: 'Tentang kami' },
  { href: '/galeri', label: 'Pencapaian' },
  { href: '/lacak', label: 'Lacak pesanan' },
]

export function NavLinks() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  const isCurrent = (href: string) => pathname === href || pathname.startsWith(`${href}/`)
  const linkClass =
    'inline-flex min-h-11 items-center rounded-full px-4 text-ink no-underline transition-colors hover:bg-white/70 hover:text-ink aria-[current=page]:bg-white aria-[current=page]:font-semibold aria-[current=page]:shadow-[0_1px_2px_rgb(34_32_26/0.08)]'

  return (
    <>
      <nav aria-label="Utama" className="hidden lg:block">
        <ul className="flex items-center gap-x-1 text-base">
          {LINKS.map(({ href, label }) => (
            <li key={href}>
              <Link href={href} aria-current={isCurrent(href) ? 'page' : undefined} className={linkClass}>
                {label}
              </Link>
            </li>
          ))}
          <li className="ml-3">
            <CartLink />
          </li>
        </ul>
      </nav>

      <div className="flex items-center gap-2 text-base lg:hidden">
        <CartLink onNavigate={close} />
        <button
          type="button"
          aria-expanded={open}
          aria-controls="menu-seluler"
          onClick={() => setOpen((value) => !value)}
          className="btn min-h-11 border-stone/80 bg-white/70 px-4 py-1 text-ink hover:bg-white"
        >
          {open ? 'Tutup' : 'Menu'}
        </button>
      </div>

      {open && (
        <nav
          id="menu-seluler"
          aria-label="Menu seluler"
          onKeyDown={(event) => event.key === 'Escape' && close()}
          className="w-full border-t border-stone/70 pb-2 pr-3 pt-2 lg:hidden"
        >
          <ul className="space-y-1 text-lg">
            {LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={close}
                  aria-current={isCurrent(href) ? 'page' : undefined}
                  className={`${linkClass} -ml-4 w-full py-2`}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </>
  )
}
