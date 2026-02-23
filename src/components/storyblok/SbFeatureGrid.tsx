import Link from 'next/link'
import { resolveLink, hasLink, type SbLink } from '@/lib/storyblok/utils'
import { Icon } from '@/components/ui/Icon'

type FeatureCardBlok = {
  _uid: string
  component: 'feature_card'
  title: string
  description?: string
  icon?: string
  link?: SbLink
}

export type SbFeatureGridBlok = {
  _uid: string
  component: 'feature_grid'
  title?: string
  items?: FeatureCardBlok[]
}

function FeatureCard({ blok }: { blok: FeatureCardBlok }) {
  const href = hasLink(blok.link) ? resolveLink(blok.link) : null

  const inner = (
    <div className="flex h-full flex-col rounded-lg border border-stone-200 bg-white p-6 transition-shadow hover:shadow-md">
      {blok.icon && (
        <div className="mb-3 text-cardinal" aria-hidden="true">
          <Icon name={blok.icon} size={24} />
        </div>
      )}
      <h3 className="mb-2 text-base font-semibold text-zinc-900">{blok.title}</h3>
      {blok.description && (
        <p className="mt-auto text-sm leading-relaxed text-zinc-600">{blok.description}</p>
      )}
    </div>
  )

  if (href) {
    return (
      <li>
        <Link
          href={href}
          className="block focus-visible:outline-2 focus-visible:outline-cardinal"
        >
          {inner}
        </Link>
      </li>
    )
  }

  return <li>{inner}</li>
}

export function SbFeatureGrid({ blok }: { blok: SbFeatureGridBlok }) {
  const items = blok.items ?? []

  return (
    <section className="bg-white py-16" aria-labelledby={`fg-heading-${blok._uid}`}>
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        {blok.title && (
          <h2
            id={`fg-heading-${blok._uid}`}
            className="mb-10 text-2xl font-bold tracking-tight text-zinc-900"
          >
            {blok.title}
          </h2>
        )}
        {items.length > 0 && (
          <ul
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            {items.map((card) => (
              <FeatureCard key={card._uid} blok={card} />
            ))}
          </ul>
        )}
      </div>
    </section>
  )
}
