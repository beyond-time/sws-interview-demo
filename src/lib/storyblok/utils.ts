/** Storyblok multilink field shape */
export type SbLink = {
  id?: string
  url?: string
  linktype?: 'url' | 'story' | 'email' | 'asset'
  fieldtype?: string
  cached_url?: string
  story?: { full_slug: string }
}

/**
 * Resolves a Storyblok multilink field to a usable href string.
 * Story links get a leading "/" so they work as Next.js Link hrefs.
 */
export function resolveLink(link?: SbLink | null): string {
  if (!link) return '#'
  if (link.linktype === 'email') return `mailto:${link.url ?? ''}`
  if (link.linktype === 'story') {
    const slug = link.story?.full_slug ?? link.cached_url ?? ''
    // Strip leading site/ prefix (our routing convention)
    return '/' + slug.replace(/^site\//, '')
  }
  return link.url ?? link.cached_url ?? '#'
}

/** True when a Storyblok link field has a real destination */
export function hasLink(link?: SbLink | null): boolean {
  if (!link) return false
  if (link.linktype === 'story') return !!(link.story?.full_slug ?? link.cached_url)
  return !!(link.url ?? link.cached_url)
}
