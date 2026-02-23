'use client'

import { storyblokInit, apiPlugin, useStoryblokState } from '@storyblok/react'
import type { ISbStoryData } from '@storyblok/react'
import { componentMap } from '@/lib/storyblok/componentMap'
import { SbPage } from '@/components/storyblok/SbPage'

/**
 * Initialize the Storyblok client-side bridge once at module load time.
 *
 * accessToken here is the PUBLIC token (safe to expose to the browser).
 * It's only used if this client makes direct API calls via getStoryblokApi().
 * The bridge itself works via postMessage — no token required for that.
 *
 * NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN must be set in .env.local.
 */
storyblokInit({
  accessToken: process.env.NEXT_PUBLIC_STORYBLOK_ACCESS_TOKEN ?? '',
  use: [apiPlugin],
  components: componentMap,
})

interface Props {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  initialStory: ISbStoryData<any> | null
}

/**
 * Client component — Storyblok Visual Editor live bridge.
 *
 * Receives the server-fetched draft story as `initialStory`.
 * useStoryblokState returns the live-updated version while inside the
 * Storyblok Visual Editor iframe; outside the iframe it returns the
 * initial story unchanged.
 */
export function EditorClient({ initialStory }: Props) {
  const story = useStoryblokState(initialStory)

  if (!story) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-400">
        <div className="text-center">
          <p className="mb-2 text-sm font-medium">Editor bridge ready</p>
          <p className="text-xs text-zinc-600">
            No draft story found. Create a story in Storyblok and open it in
            the Visual Editor.
          </p>
        </div>
      </div>
    )
  }

  const contentType = story.content?.component ?? 'unknown'
  const bloks = story.content?.body ?? []
  const hasBloks = Array.isArray(bloks) && bloks.length > 0
  const firstBlokIsHero = bloks[0]?.component === 'hero'

  // Non-page content types (author, article, site_config, navigation)
  // don't have a body bloks field — render their fields directly
  const isPageType = contentType === 'page'

  return (
    <div className="min-h-screen bg-white">
      {/* Editor mode banner */}
      <div className="bg-cardinal px-4 py-2 text-center text-xs font-semibold text-white">
        DRAFT PREVIEW — {story.full_slug}
      </div>

      {isPageType ? (
        <>
          {/* Page: let hero blok own the h1; fallback header otherwise */}
          {!firstBlokIsHero && (
            <header className="border-b border-stone-200 bg-fog">
              <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
                <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-stone">
                  {contentType} · draft
                </p>
                <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
                  {story.name}
                </h1>
              </div>
            </header>
          )}
          {hasBloks ? (
            <SbPage bloks={bloks} />
          ) : (
            <div className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
              <p className="text-sm text-zinc-500">
                No content blocks yet — add bloks to the <code className="rounded bg-zinc-100 px-1">body</code> field in Storyblok.
              </p>
            </div>
          )}
        </>
      ) : (
        /* Non-page content type: show fields as a readable card */
        <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
          <header className="mb-6">
            <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-stone">
              {contentType} · draft
            </p>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              {story.name}
            </h1>
          </header>
          <dl className="divide-y divide-stone-100 rounded-lg border border-stone-200 bg-white">
            {Object.entries(story.content)
              .filter(([key]) => !key.startsWith('_') && key !== 'component')
              .map(([key, val]) => (
                <div key={key} className="px-5 py-4">
                  <dt className="text-xs font-semibold uppercase tracking-wider text-stone">
                    {key}
                  </dt>
                  <dd className="mt-1 text-sm text-zinc-700">
                    {typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean'
                      ? String(val)
                      : val && typeof val === 'object' && 'filename' in val
                      ? (val as { filename?: string }).filename || '(empty asset)'
                      : <span className="text-zinc-400 italic">(complex field — see raw JSON)</span>
                    }
                  </dd>
                </div>
              ))}
          </dl>
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
    </div>
  )
}
