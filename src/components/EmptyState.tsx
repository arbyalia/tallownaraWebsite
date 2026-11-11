import Link from 'next/link'

type EmptyStateProps = {
  title: string
  body: string
  href: string
  action: string
}

export function EmptyState({ title, body, href, action }: EmptyStateProps) {
  return (
    <div className="page-shell flex flex-1 flex-col justify-center py-24">
      <h1 className="text-5xl font-normal">{title}</h1>
      <p className="mt-4 max-w-xl text-muted">{body}</p>
      <p className="mt-6">
        <Link href={href} className="btn btn-primary">
          {action}
        </Link>
      </p>
    </div>
  )
}
