import Image from 'next/image'
import Link from 'next/link'

import logo from '../../public/logo-tallownara.png'
import { NavLinks } from './NavLinks'

export function SiteHeader() {
  return (
    <header className="page-shell">
      <div className="flex flex-wrap items-center justify-between gap-x-8 gap-y-3 border-b border-stone py-5">
        <Link href="/" className="inline-block">
          <Image src={logo} alt="Tallownara" priority className="h-8 w-auto sm:h-9" />
        </Link>
        <NavLinks />
      </div>
    </header>
  )
}
