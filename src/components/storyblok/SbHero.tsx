import Link from 'next/link'
import { resolveLink, hasLink, type SbLink } from '@/lib/storyblok/utils'

export type SbHeroBlok = {
  _uid: string
  component: 'hero'
  heading: string
  subheading?: string
  cta_label?: string
  cta_url?: SbLink
  image?: { filename?: string; alt?: string }
  layout_variant?: 'centered' | 'left_aligned' | 'split'
}

export function SbHero({ blok }: { blok: SbHeroBlok }) {
  const centered = blok.layout_variant !== 'left_aligned' && blok.layout_variant !== 'split'
  const hasCta = blok.cta_label && hasLink(blok.cta_url)
  const ctaHref = resolveLink(blok.cta_url)

  return (
    <section
      className="bg-cardinal text-white"
      aria-labelledby={`hero-heading-${blok._uid}`}
    >
      <div
        className={[
          'mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28',
          centered ? 'text-center' : '',
        ].join(' ')}
      >
        <h1
          id={`hero-heading-${blok._uid}`}
          className="text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
        >
          {blok.heading}
        </h1>

        {blok.subheading && (
          <p
            className={[
              'mt-6 text-lg leading-relaxed text-white/80',
              centered ? 'mx-auto max-w-2xl' : 'max-w-2xl',
            ].join(' ')}
          >
            {blok.subheading}
          </p>
        )}

        {hasCta && (
          <div className={['mt-8', centered ? 'flex justify-center' : ''].join(' ')}>
            {ctaHref.startsWith('/') ? (
              <Link
                href={ctaHref}
                className="inline-block rounded bg-white px-6 py-3 text-sm font-semibold text-cardinal transition-colors hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-white"
              >
                {blok.cta_label}
              </Link>
            ) : (
              <a
                href={ctaHref}
                className="inline-block rounded bg-white px-6 py-3 text-sm font-semibold text-cardinal transition-colors hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-white"
              >
                {blok.cta_label}
              </a>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
