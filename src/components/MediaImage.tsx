import Image from 'next/image'

import type { Media } from '@/payload-types'

type MediaImageProps = {
  media: number | Media | null | undefined
  sizes: string
  className?: string
}

export function MediaImage({ media, sizes, className = 'aspect-[3/2]' }: MediaImageProps) {
  if (!media || typeof media === 'number' || !media.url) return null

  return (
    <div className={`relative overflow-hidden rounded-[4px] bg-paper ${className}`}>
      <Image src={media.url} alt={media.alt} fill sizes={sizes} className="object-cover" />
    </div>
  )
}
