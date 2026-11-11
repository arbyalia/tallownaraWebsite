import { notFound } from 'next/navigation'

import { getLegalPage } from '@/lib/content'

import { Paragraphs } from './Paragraphs'
import { TemplateText } from './TemplateText'

export async function LegalPageView({ slug }: { slug: string }) {
  const page = await getLegalPage(slug)
  if (!page) notFound()

  return (
    <div className="page-shell grid grid-cols-12 gap-x-6 pb-20 pt-12 sm:pt-16">
      <header className="col-span-12 lg:col-span-4">
        <div className="lg:sticky lg:top-28">
          <h1 className="section-title">{page.title}</h1>
          {page.updatedLabel && (
            <p className="mt-4 text-base text-muted">
              Terakhir diperbarui <TemplateText text={page.updatedLabel} />
            </p>
          )}
        </div>
      </header>
      <div className="col-span-12 mt-10 lg:col-span-7 lg:col-start-6 lg:mt-0">
        {page.lead && <p className="font-serif text-2xl leading-snug text-ink"><TemplateText text={page.lead} /></p>}
        {(page.sections ?? []).map((section) => (
          <section key={section.id ?? section.heading} className="mt-10 border-t border-stone pt-6">
            <h2 className="text-3xl font-normal">{section.heading}</h2>
            <div className="mt-4">
              <Paragraphs text={section.body} />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
