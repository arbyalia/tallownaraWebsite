'use client'

type QuantityStepperProps = {
  value: number
  max: number
  label: string
  onChange: (value: number) => void
}

export function QuantityStepper({ value, max, label, onChange }: QuantityStepperProps) {
  const buttonClass =
    'grid h-11 w-11 place-items-center text-xl text-olive-deep hover:bg-paper aria-disabled:cursor-not-allowed aria-disabled:text-muted'

  return (
    <div role="group" aria-label={label} className="inline-flex items-center overflow-hidden rounded-full border border-muted bg-white">
      <button
        type="button"
        aria-label="Kurangi jumlah"
        aria-disabled={value <= 1}
        className={buttonClass}
        onClick={() => value > 1 && onChange(value - 1)}
      >
        −
      </button>
      <output aria-live="polite" className="tabular w-10 text-center font-semibold">
        {value}
      </output>
      <button
        type="button"
        aria-label="Tambah jumlah"
        aria-disabled={value >= max}
        className={buttonClass}
        onClick={() => value < max && onChange(value + 1)}
      >
        +
      </button>
    </div>
  )
}
