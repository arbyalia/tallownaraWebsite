import { CONTACT } from '@/lib/site'

export function SiteFooter() {
  return (
    <footer className="page-shell">
      <div className="flex flex-col gap-2 border-t border-stone py-6 text-sm text-muted sm:flex-row sm:justify-between">
        <p>[[ISI: nama badan usaha, alamat, dan NIB]]</p>
        <p className="flex gap-5">
          <a href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a>
          <a href={CONTACT.instagramUrl}>{CONTACT.instagramHandle}</a>
        </p>
      </div>
    </footer>
  )
}
