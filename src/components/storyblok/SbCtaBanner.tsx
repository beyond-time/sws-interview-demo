import Link from 'next/link'
import { resolveLink, hasLink, type SbLink } from '@/lib/storyblok/utils'

export type SbCtaBannerBlok = {
  _uid: string
  component: 'cta_banner'
  heading: string
  description?: string
  primary_cta_label?: string
  primary_cta_url?: SbLink
  secondary_cta_label?: string
  secondary_cta_url?: SbLink
}

function CtaLink({
  href,
  label,
  variant,
}: {
  href: string
  label: string
  variant: 'primary' | 'secondary'
}) {
  const cls =
    variant === 'primary'
      ? 'rounded bg-cardinal px-5 py-2.5 text-sm font-semibold text-white hover:bg-cardinal-dark focus-visible:outline-2 focus-visible:outline-cardinal transition-colors'
      : 'rounded border border-stone-300 px-5 py-2.5 text-sm font-semibold text-zinc-700 hover:border-stone-400 hover:bg-stone-50 focus-visible:outline-2 focus-visible:outline-cardinal transition-colors'

  if (href.startsWith('/')) {
    return <Link href={href} className={cls}>{label}</Link>
  }
  return <a href={href} className={cls}>{label}</a>
}

export function SbCtaBanner({ blok }: { blok: SbCtaBannerBlok }) {
  const hasPrimary = blok.primary_cta_label && hasLink(blok.primary_cta_url)
  const hasSecondary = blok.secondary_cta_label && hasLink(blok.secondary_cta_url)

  return (
    <section className="border-y border-stone-200 bg-fog py-16">
      <div className="mx-auto max-w-6xl px-4 text-center sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">
          {blok.heading}
        </h2>
        {blok.description && (
          <p className="mx-auto mt-4 max-w-xl text-zinc-600">{blok.description}</p>
        )}
        {(hasPrimary || hasSecondary) && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {hasPrimary && (
              <CtaLink
                href={resolveLink(blok.primary_cta_url)}
                label={blok.primary_cta_label!}
                variant="primary"
              />
            )}
            {hasSecondary && (
              <CtaLink
                href={resolveLink(blok.secondary_cta_url)}
                label={blok.secondary_cta_label!}
                variant="secondary"
              />
            )}
          </div>
        )}
      </div>
    </section>
  )
}
