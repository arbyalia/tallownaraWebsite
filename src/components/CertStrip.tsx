import Image from 'next/image'

const CERTS = [
  { src: '/foto/sertifikasi-bpom.webp', alt: 'Badan POM', label: 'Terdaftar di BPOM' },
  { src: '/foto/sertifikasi-halal.webp', alt: 'Label Halal Indonesia', label: 'Halal Indonesia' },
  { src: '/foto/sertifikasi-organik.webp', alt: 'Organik Indonesia', label: 'Organik Indonesia' },
  { src: '/foto/sertifikasi-cpkb.webp', alt: 'Sertifikat CPKB', label: 'Sertifikat CPKB' },
  { src: '/foto/sertifikasi-lab.webp', alt: 'Lab tested', label: 'Teruji laboratorium' },
]

export function CertStrip() {
  return (
    <ul className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-3 lg:grid-cols-5">
      {CERTS.map(({ src, alt, label }) => (
        <li key={src} className="flex items-center gap-3">
          <span className="relative block h-12 w-12 shrink-0">
            <Image src={src} alt={alt} fill sizes="48px" className="object-contain" />
          </span>
          <span className="text-base font-medium leading-tight text-ink">{label}</span>
        </li>
      ))}
    </ul>
  )
}
