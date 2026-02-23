/**
 * Storyblok Content Delivery API client.
 *
 * Published stories use 'use cache' + cacheTag so revalidateTag() can target
 * specific stories or the full storyblok bucket. See docs/adr/0001-caching-strategy.md.
 *
 * Draft stories are fetched without caching — they are only accessed from
 * editor routes that are marked `dynamic = 'force-dynamic'`.
 *
 * @storyblok/react is reserved for the client-side editor bridge only.
 */

import { cacheTag, cacheLife } from 'next/cache'

export type StoryblokVersion = 'draft' | 'published'

/** Storyblok CDN base URL by region. */
const REGION_BASE: Record<string, string> = {
  eu: 'https://api.storyblok.com',
  us: 'https://api-us.storyblok.com',
  ca: 'https://api-ca.storyblok.com',
  ap: 'https://api-ap.storyblok.com',
  cn: 'https://app.storyblok.cn',
}

function apiBase(): string {
  const region = process.env.STORYBLOK_REGION ?? 'us'
  return REGION_BASE[region] ?? REGION_BASE.us
}

/**
 * Cached fetch for published stories.
 *
 * 'use cache' + cacheTag replaces the old `next: { tags }` pattern.
 * Called only for version === 'published'.
 */
async function fetchPublishedStory(
  slug: string,
  resolveRelations: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any | null> {
  'use cache'
  cacheTag(`story:${slug}`, 'storyblok')
  cacheLife('days')

  const token = process.env.STORYBLOK_PUBLIC_ACCESS_TOKEN
  if (!token) {
    console.warn(`[Storyblok] No public token configured — skipping fetch for "${slug}"`)
    return null
  }

  const params = new URLSearchParams({ token, version: 'published' })
  if (resolveRelations.length) {
    params.set('resolve_relations', resolveRelations.join(','))
  }

  try {
    const res = await fetch(`${apiBase()}/v2/cdn/stories/${slug}?${params}`)
    if (res.status === 404) return null
    if (!res.ok) {
      console.error(`[Storyblok] ${res.status} fetching story "${slug}"`)
      return null
    }
    const json = await res.json()
    return json.story ?? null
  } catch (err) {
    console.error(`[Storyblok] Network error fetching story "${slug}"`, err)
    return null
  }
}

/**
 * Uncached fetch for draft stories.
 * Only called from editor routes (force-dynamic) — never during prerendering.
 */
async function fetchDraftStory(
  slug: string,
  resolveRelations: string[],
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any | null> {
  const token = process.env.STORYBLOK_PREVIEW_ACCESS_TOKEN
  if (!token) {
    console.warn(`[Storyblok] No preview token configured — skipping draft fetch for "${slug}"`)
    return null
  }

  const params = new URLSearchParams({ token, version: 'draft' })
  if (resolveRelations.length) {
    params.set('resolve_relations', resolveRelations.join(','))
  }

  try {
    const res = await fetch(`${apiBase()}/v2/cdn/stories/${slug}?${params}`, {
      cache: 'no-store',
    })
    if (res.status === 404) return null
    if (!res.ok) {
      console.error(`[Storyblok] ${res.status} fetching draft story "${slug}"`)
      return null
    }
    const json = await res.json()
    return json.story ?? null
  } catch (err) {
    console.error(`[Storyblok] Network error fetching draft story "${slug}"`, err)
    return null
  }
}

/**
 * Fetch a single story by its full Storyblok slug (e.g. "site/home").
 *
 * Published: cached via 'use cache' + cacheTag — invalidated by revalidateTag().
 * Draft: always fresh, no-store — only used in force-dynamic editor routes.
 *
 * Returns null on 404, missing token, or network error (never throws).
 */
export async function fetchStory(
  slug: string,
  opts: {
    version?: StoryblokVersion
    resolveRelations?: string[]
  } = {},
) {
  const { version = 'published', resolveRelations = [] } = opts

  if (version === 'draft') {
    return fetchDraftStory(slug, resolveRelations)
  }

  return fetchPublishedStory(slug, resolveRelations)
}

/**
 * Fetch all published story slugs from the site/ folder.
 * Used by generateStaticParams to pre-build all CMS pages.
 *
 * Returns [] when tokens aren't configured so the build succeeds
 * without a live Storyblok space.
 *
 * Each entry is a slug array ready for Next.js params:
 *   "site/accessibility-lab" → ["accessibility-lab"]
 */
export async function fetchSiteSlugs(): Promise<string[][]> {
  'use cache'
  cacheTag('storyblok-links', 'storyblok')
  cacheLife('days')

  const token = process.env.STORYBLOK_PUBLIC_ACCESS_TOKEN
  if (!token) {
    console.warn(
      '[Storyblok] No public token — generateStaticParams returns [] (no CMS pages built)',
    )
    return []
  }

  const params = new URLSearchParams({
    token,
    version: 'published',
    per_page: '100',
    starts_with: 'site/',
  })

  try {
    const res = await fetch(`${apiBase()}/v2/cdn/links/?${params}`)
    if (!res.ok) return []

    const json = await res.json()
    const links = Object.values(json.links ?? {}) as Array<{
      slug: string
      is_folder: boolean
    }>

    return links
      .filter((l) => !l.is_folder && l.slug !== 'site/home')
      .map((l) => l.slug.replace(/^site\//, '').split('/'))
  } catch (err) {
    console.error('[Storyblok] Error fetching links for generateStaticParams', err)
    return []
  }
}
