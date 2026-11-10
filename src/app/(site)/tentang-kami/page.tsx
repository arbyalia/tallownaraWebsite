import type { Metadata } from 'next'

import { EmptyState } from '@/components/EmptyState'
import { MediaImage } from '@/components/MediaImage'
import { Paragraphs } from '@/components/Paragraphs'
import { getAbout } from '@/lib/content'
import { CONTACT } from '@/lib/site'
import type { About } from '@/payload-types'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tentang kami',
  description: 'Kisah Tallownara, visi-misi, sumber bahan baku di Tuban, dan orang di baliknya.',
}

type TeamMember = NonNullable<About['team']>[number]

function TeamList({ heading, members }: { heading: string; members: TeamMember[] }) {
  if (members.length === 0) return null

  return (
    <div>
      <h2 className="text-4xl font-normal sm:text-5xl">{heading}</h2>
      <ul className="mt-8 grid gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
        {members.map((member) => (
          <li key={member.id ?? member.name} className="border-t border-stone pt-4">
            <MediaImage
              media={member.photo}
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 50vw, 100vw"
              className="mb-4 aspect-[4/5]"
            />
            <p className="font-serif text-2xl leading-tight text-olive-deep">{member.name}</p>
            <p className="mt-1 text-muted">{member.role}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}

export default async function AboutPage() {
  const about = await getAbout()
  const missions = about.missions ?? []
  const points = about.sourcingPoints ?? []
  const team = about.team ?? []

  const isEmpty =
    !about.storyBody && !about.vision && missions.length === 0 && !about.sourcingBody && team.length === 0

  if (isEmpty) {
    return (
      <EmptyState
        title="Cerita kami sedang ditulis"
        body="Sementara halaman ini disiapkan, kami senang menjawab pertanyaan Anda secara langsung."
        href={CONTACT.whatsappUrl}
        action="Tanya lewat WhatsApp"
      />
    )
  }

  return (
    <div className="page-shell">
      <section className="grid grid-cols-12 gap-x-6 gap-y-10 py-16 sm:py-24">
        <div className="col-span-12 lg:col-span-10">
          {about.heroTitle && <p className="text-sm text-muted sm:text-base">Tentang kami</p>}
          <h1 className="mt-4 text-[3.5rem] font-normal sm:text-[4.5rem] lg:text-[5.5rem]">
            {about.heroTitle ?? 'Tentang kami'}
          </h1>
        </div>
        {about.storyImage && (
          <div className="col-span-12 lg:col-span-5">
            <MediaImage media={about.storyImage} sizes="(min-width: 1024px) 40vw, 100vw" />
          </div>
        )}
        {about.storyBody && (
          <div className="col-span-12 sm:col-span-10 sm:col-start-3 lg:col-span-6 lg:col-start-7">
            <Paragraphs text={about.storyBody} />
          </div>
        )}
      </section>

      {(about.vision || missions.length > 0) && (
        <section className="grid grid-cols-12 gap-x-6 gap-y-12 border-t border-stone py-16 sm:py-24">
          {about.vision && (
            <div className="col-span-12 lg:col-span-5">
              <h2 className="text-4xl font-normal sm:text-5xl">Visi</h2>
              <p className="mt-6 font-serif text-2xl leading-snug text-ink sm:text-3xl">
                {about.vision}
              </p>
            </div>
          )}
          {missions.length > 0 && (
            <div className="col-span-12 lg:col-span-6 lg:col-start-7">
              <h2 className="text-4xl font-normal sm:text-5xl">Misi</h2>
              <ol className="mt-6 list-decimal space-y-4 pl-6 marker:text-olive">
                {missions.map((mission) => (
                  <li key={mission.id ?? mission.text} className="pl-2">
                    {mission.text}
                  </li>
                ))}
              </ol>
            </div>
          )}
        </section>
      )}

      {(about.sourcingBody || points.length > 0) && (
        <section className="grid grid-cols-12 gap-x-6 gap-y-10 border-t border-stone py-16 sm:py-24">
          <div className="col-span-12 lg:col-span-6">
            <p className="text-sm text-muted sm:text-base">Sumber bahan baku dan proses</p>
            <h2 className="mt-4 text-4xl font-normal sm:text-5xl">
              {about.sourcingTitle ?? 'Bahan baku kami'}
            </h2>
            <div className="mt-6">
              <Paragraphs text={about.sourcingBody} />
            </div>
          </div>
          <div className="col-span-12 lg:col-span-5 lg:col-start-8">
            {about.sourcingImage && (
              <div className="mb-8">
                <MediaImage media={about.sourcingImage} sizes="(min-width: 1024px) 40vw, 100vw" />
              </div>
            )}
            {points.length > 0 && (
              <dl>
                {points.map((point) => (
                  <div key={point.id ?? point.title} className="border-t border-stone py-4">
                    <dt className="font-serif text-2xl leading-tight text-olive-deep">{point.title}</dt>
                    <dd className="mt-1 text-muted">{point.body}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
        </section>
      )}

      {team.length > 0 && (
        <section className="space-y-16 border-t border-stone py-16 sm:py-24">
          <TeamList heading="Tim pendiri" members={team.filter((m) => m.group === 'founder')} />
          <TeamList heading="Penasihat" members={team.filter((m) => m.group === 'advisor')} />
        </section>
      )}
    </div>
  )
}
