import type { Metadata } from 'next'

import { LegalPageView } from '@/components/LegalPageView'

export const dynamic = 'force-dynamic'
export const metadata: Metadata = { title: 'Kebijakan privasi' }

export default function Page() {
  return <LegalPageView slug="kebijakan-privasi" />
}
