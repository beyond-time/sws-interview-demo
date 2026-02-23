import type { Metadata } from 'next'
import { Suspense } from 'react'
import { EditorGuard } from './EditorGuard'

export const metadata: Metadata = {
  title: 'Editor Preview',
  // Prevent search engines from indexing the editor route
  robots: { index: false, follow: false },
}

type PageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

/**
 * Editor preview entry point.
 *
 * Reads the Storyblok Visual Editor query params and delegates to EditorGuard
 * for token verification + draft story rendering.
 *
 * Storyblok appends these params when loading the preview URL:
 *   _storyblok_tk[space_id]  — the Storyblok space ID
 *   _storyblok_tk[timestamp] — Unix timestamp when the token was issued
 *   _storyblok_tk[token]     — SHA1(spaceId:previewToken:timestamp)
 *   slug                     — (optional) full_slug of the story being previewed
 *
 * Token verification and all draft fetches happen in EditorGuard (Server Component).
 * This page itself does not import previewToken or any sensitive value.
 *
 * The page is synchronous — awaiting searchParams happens inside <Suspense> via
 * EditorGuardEntry, satisfying the cacheComponents uncached-data-in-Suspense rule.
 */
export default function EditorPage({ searchParams }: PageProps) {
  return (
    <Suspense>
      <EditorGuardEntry searchParams={searchParams} />
    </Suspense>
  )
}

/**
 * Inner async component — runs inside the <Suspense> boundary.
 * Resolves searchParams and delegates to EditorGuard.
 */
async function EditorGuardEntry({ searchParams }: PageProps) {
  const params = await searchParams

  // Extract bracket-notation Storyblok token params
  // URL: ?_storyblok_tk[space_id]=X&_storyblok_tk[timestamp]=Y&_storyblok_tk[token]=Z
  const tk = {
    space_id: params['_storyblok_tk[space_id]'] as string | undefined,
    timestamp: params['_storyblok_tk[timestamp]'] as string | undefined,
    token: params['_storyblok_tk[token]'] as string | undefined,
  }

  // Optional story slug: ?slug=accessibility-lab
  const slug = params['slug'] as string | undefined

  return <EditorGuard tk={tk} slug={slug} />
}
