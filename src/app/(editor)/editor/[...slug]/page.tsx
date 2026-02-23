import type { Metadata } from 'next'
import { Suspense } from 'react'
import { EditorGuard } from '../EditorGuard'

export const metadata: Metadata = {
  title: 'Editor Preview',
  robots: { index: false, follow: false },
}

type PageProps = {
  params: Promise<{ slug: string[] }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

/**
 * Story-specific editor preview route.
 *
 * Storyblok appends the story's slug to your configured preview URL, so
 * a story at `site/accessibility-lab` opens as:
 *   https://localhost:3000/editor/accessibility-lab
 *
 * This catch-all captures that segment and forwards it to EditorGuard,
 * which does token verification before fetching any draft content.
 *
 * The page itself is synchronous — awaiting dynamic values (params, searchParams)
 * happens inside the <Suspense> boundary via EditorGuardSlug, satisfying the
 * cacheComponents requirement that uncached data access occurs within Suspense.
 */
export default function EditorSlugPage({ params, searchParams }: PageProps) {
  return (
    <Suspense>
      <EditorGuardSlug params={params} searchParams={searchParams} />
    </Suspense>
  )
}

/**
 * Inner async component — runs inside the <Suspense> boundary.
 * Resolves params/searchParams and delegates to EditorGuard.
 */
async function EditorGuardSlug({ params, searchParams }: PageProps) {
  const [{ slug }, sp] = await Promise.all([params, searchParams])

  const tk = {
    space_id: sp['_storyblok_tk[space_id]'] as string | undefined,
    timestamp: sp['_storyblok_tk[timestamp]'] as string | undefined,
    token: sp['_storyblok_tk[token]'] as string | undefined,
  }

  // slug array → joined path, e.g. ['accessibility-lab'] → 'accessibility-lab'
  // EditorGuard prepends 'site/' when fetching from Storyblok
  const storySlug = slug.join('/')

  return <EditorGuard tk={tk} slug={storySlug} />
}
