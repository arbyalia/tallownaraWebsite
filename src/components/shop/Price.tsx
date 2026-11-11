import { formatRupiah } from '@/lib/money'

export function Price({
  amount,
  isExample,
  className = 'text-lg font-semibold',
}: {
  amount: number
  isExample?: boolean | null
  className?: string
}) {
  return (
    <p className={`tabular text-ink ${className}`}>
      {formatRupiah(amount)}
      {isExample && <span className="template-chip ml-2 text-sm font-normal">harga contoh</span>}
    </p>
  )
}
