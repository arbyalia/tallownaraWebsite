'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const LINKS = [
  { href: '/tentang-kami', label: 'Tentang kami' },
  { href: '/galeri', label: 'Pencapaian & acara' },
]

export function NavLinks() {
  const pathname = usePathname()

  return (
    <nav aria-label="Utama">
      <ul className="flex flex-wrap gap-x-6 gap-y-1 text-base">
        {LINKS.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={pathname === href ? 'page' : undefined}
              className="inline-block py-1 text-ink no-underline decoration-olive decoration-2 hover:underline aria-[current=page]:underline"
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
