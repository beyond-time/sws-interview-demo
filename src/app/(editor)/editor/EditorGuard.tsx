import { forbidden } from 'next/navigation'
import { connection } from 'next/server'
import { verifyStoryblokToken } from '@/lib/storyblok/tokenVerify'
import { fetchStory } from '@/lib/storyblok/client'
import { EditorClient } from './EditorClient'

interface EditorTokenParams {
  space_id?: string
  timestamp?: string
  token?: string
}

interface Props {
  /** Parsed _storyblok_tk[...] query params */
  tk: EditorTokenParams
  /**
   * Full Storyblok slug of the story to preview (e.g. "site/accessibility-lab").
   * Comes from the URL path: /editor/site/accessibility-lab → "site/accessibility-lab".
   * Defaults to "site/home" when not provided.
   */
  slug?: string
}

/**
 * Server Component — security gate for the Storyblok Visual Editor.
 *
 * Verifies the Storyblok-signed token before rendering ANY draft content.
 * On failure: forbidden() → 403 (EditorForbidden page, no content leak).
 * On success: fetches the requested draft story and passes it to EditorClient.
 *
 * Must remain a Server Component — previewToken NEVER touches the browser.
 */
export async function EditorGuard({ tk, slug }: Props) {
  // Opt into request-time rendering. Called here (inside <Suspense> in the
  // page) rather than at page level, so it satisfies cacheComponents' requirement
  // that uncached data access occurs within a Suspense boundary.
  await connection()

  const previewToken = process.env.STORYBLOK_PREVIEW_ACCESS_TOKEN

  const valid =
    !!previewToken &&
    verifyStoryblokToken({
      spaceId: tk.space_id ?? '',
      timestamp: tk.timestamp ?? '',
      token: tk.token ?? '',
      previewToken,
    })

  // Default-deny — any failure returns 403 before any draft fetch
  if (!valid) {
    forbidden()
  }

  // ── Token verified ─────────────────────────────────────────────────────────

  // slug is the full Storyblok slug passed from the URL path.
  // e.g. /editor/site/accessibility-lab → slug = "site/accessibility-lab"
  // Do NOT prepend "site/" — it is already the complete slug.
  const storySlug = slug ?? 'site/home'

  const story =
    (await fetchStory(storySlug, { version: 'draft' })) ??
    // If the requested slug doesn't exist, fall back to accessibility-lab
    (await fetchStory('site/accessibility-lab', { version: 'draft' }))

  return <EditorClient initialStory={story} />
}
