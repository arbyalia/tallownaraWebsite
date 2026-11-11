'use client'

import { useRouter } from 'next/navigation'

import { endHistorySession } from '@/lib/actions'

export function HistoryLogout() {
  const router = useRouter()
  return (
    <button
      type="button"
      className="btn btn-outline"
      onClick={() => void endHistorySession().then(() => router.refresh())}
    >
      Keluar dari riwayat
    </button>
  )
}
