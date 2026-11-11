import type { Metadata } from 'next'

import { LegalPageView } from '@/components/LegalPageView'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Syarat & Ketentuan' }

export default function Page() {
  return <LegalPageView slug="syarat-ketentuan" />
}
