import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import Link from 'next/link'
import { fetchStory, fetchSiteSlugs } from '@/lib/storyblok/client'
import { SbPage } from '@/components/storyblok/SbPage'

/**
 * Per-slug CTAs that link to the interactive /gql-demo page.
 * These are purely static and require no CMS content changes.
 */
const gqlDemoCta: Record<string, { heading: string; body: string; cta: string }> = {
  'cache-revalidation-lab': {
    heading: 'Try it live on the GraphQL Demo page',
    body: 'The /gql-demo page has a live revalidation panel — pick a cache tag or path, hit Revalidate, then reload to watch the "rendered at" timestamp change.',
    cta: 'Open the revalidation panel →',
  },
  'data-integration-lab': {
    heading: 'See the GraphQL query run on the GraphQL Demo page',
    body: 'The /gql-demo page executes the ArticleItems query against Storyblok\'s GraphQL API and shows the full response. The query source and GQL client code are visible there too.',
    cta: 'Open the live query →',
  },
}

/**
 * Storyblok CMS pages.
 *
 * Route:   /[...slug]   (one or more segments — root "/" is handled by (site)/page.tsx)
 * Source:  site/ folder in Storyblok
 * Example: /accessibility-lab → fetches story "site/accessibility-lab"
 *
 * generateStaticParams pre-builds all published stories at build time.
 * dynamicParams = false means unknown slugs return 404 immediately.
 *
 * In `next dev` all routes are rendered on-demand, so you can test new
 * slugs without rebuilding.
 */

type PageProps = {
  params: Promise<{ slug: string[] }>
}

export async function generateStaticParams() {
  const slugArrays = await fetchSiteSlugs()
  return slugArrays.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const story = await fetchStory(`site/${slug.join('/')}`)
  if (!story) return {}

  return {
    title: story.content?.seo_title ?? story.name,
    description: story.content?.seo_description ?? undefined,
  }
}

export default async function StoryblokPage({ params }: PageProps) {
  const { slug } = await params
  const pageSlug = slug.join('/')
  const storySlug = `site/${pageSlug}`

  const story = await fetchStory(storySlug)
  if (!story) notFound()

  const bloks = story.content?.body ?? []

  // If the first blok is a hero it renders its own <h1>.
  // Otherwise show a fallback page header so the page always has an <h1>.
  const firstBlokIsHero = bloks[0]?.component === 'hero'

  const cta = gqlDemoCta[pageSlug]

  return (
    <>
      {!firstBlokIsHero && (
        <header className="border-b border-stone-200 bg-fog">
          <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              {story.name}
            </h1>
          </div>
        </header>
      )}

      {/* Body bloks — rendered via component registry */}
      <SbPage bloks={bloks} />

      {/* Slug-specific CTA pointing to the interactive /gql-demo page */}
      {cta && (
        <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
          <div className="flex flex-col gap-3 rounded-lg border border-digital-blue/20 bg-digital-blue/5 px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-zinc-900">{cta.heading}</p>
              <p className="mt-1 text-xs leading-relaxed text-zinc-600">{cta.body}</p>
            </div>
            <Link
              href="/gql-demo"
              className="shrink-0 rounded bg-digital-blue px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 focus-visible:outline-2 focus-visible:outline-cardinal"
            >
              {cta.cta}
            </Link>
          </div>
        </div>
      )}

      {/* Dev-only: raw content inspector */}
      {process.env.NODE_ENV === 'development' && (
        <details className="mx-auto mt-8 max-w-6xl px-4 pb-16 sm:px-6">
          <summary className="cursor-pointer text-xs font-medium text-zinc-400 hover:text-zinc-600">
            [dev] Raw story content
          </summary>
          <pre className="mt-2 overflow-auto rounded bg-zinc-50 p-4 text-xs text-zinc-700">
            {JSON.stringify(story.content, null, 2)}
          </pre>
        </details>
      )}
    </>
  )
}
