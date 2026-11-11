import Image from 'next/image'
import Link from 'next/link'

import logo from '../../public/logo-tallownara.png'
import { NavLinks } from './NavLinks'

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 pt-3 sm:pt-4">
      <div className="page-shell">
        <div className="glass flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-[1.75rem] py-2 pl-5 pr-2 sm:pl-6">
          <Link href="/" className="inline-block py-1">
            <Image src={logo} alt="Tallownara, ke beranda" priority className="h-7 w-auto sm:h-8" />
          </Link>
          <NavLinks />
        </div>
      </div>
    </header>
  )
}
