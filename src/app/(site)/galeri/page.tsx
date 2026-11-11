import type { Metadata } from 'next'

import { EmptyState } from '@/components/EmptyState'
import { MediaImage } from '@/components/MediaImage'
import { TemplateText } from '@/components/TemplateText'
import { getVisibleAchievements } from '@/lib/content'
import type { Achievement } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Pencapaian & acara',
  description: 'Jejak Tallownara di panggung kompetisi dan pameran.',
}

const SECTIONS: { kind: Achievement['kind']; heading: string }[] = [
  { kind: 'lomba', heading: 'Lomba' },
  { kind: 'acara', heading: 'Acara' },
]

function AchievementEntry({ item }: { item: Achievement }) {
  const photos = item.photos ?? []

  return (
    <article className="grid grid-cols-12 gap-x-6 gap-y-3 border-t border-stone py-8">
      <p className="col-span-12 text-sm text-muted sm:text-base lg:col-span-3">
        <TemplateText text={[item.dateLabel, item.location].filter(Boolean).join(' · ')} />
      </p>
      <div className="col-span-12 lg:col-span-9">
        <h3 className="text-3xl font-normal sm:text-4xl">
          <TemplateText text={item.title} />
        </h3>
        {item.summary && (
          <p className="mt-3 max-w-2xl whitespace-pre-line">
            <TemplateText text={item.summary} />
          </p>
        )}
        {photos.length > 0 && (
          <div className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {photos.map((photo, index) => {
              const isLead = index === 0
              const fillsTwoRows = isLead && photos.length >= 3
              return (
                <div
                  key={typeof photo === 'number' ? photo : photo.id}
                  className={`${isLead ? 'col-span-2' : ''} ${fillsTwoRows ? 'lg:row-span-2' : ''}`}
                >
                  <MediaImage
                    media={photo}
                    sizes={isLead ? '(min-width: 1024px) 50vw, 100vw' : '(min-width: 1024px) 25vw, 50vw'}
                    className={`aspect-[3/2] ${fillsTwoRows ? 'lg:aspect-auto lg:h-full' : ''}`}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </article>
  )
}

export default async function GalleryPage() {
  const achievements = await getVisibleAchievements()

  if (achievements.length === 0) {
    return (
      <EmptyState
        title="Galeri masih kosong"
        body="Foto dan cerita dari kompetisi serta pameran kami akan tampil di sini."
        href="/tentang-kami"
        action="Baca cerita kami"
      />
    )
  }

  return (
    <div className="page-shell pb-16 sm:pb-24">
      <div className="py-16 sm:py-24">
        <h1 className="display">Pencapaian &amp; acara</h1>
        <p className="mt-6 max-w-xl text-muted">Jejak Tallownara di panggung kompetisi dan pameran.</p>
      </div>

      <div className="space-y-16">
        {SECTIONS.map(({ kind, heading }) => {
          const items = achievements.filter((item) => item.kind === kind)
          if (items.length === 0) return null

          return (
            <section key={kind}>
              <h2 className="section-title pb-6">{heading}</h2>
              {items.map((item) => (
                <AchievementEntry key={item.id} item={item} />
              ))}
            </section>
          )
        })}
      </div>
    </div>
  )
}
