type FallbackBlok = {
  component: string
  _uid: string
  [key: string]: unknown
}

/**
 * Renders a visible warning in development when a blok type isn't in the
 * component registry. Silent in production so unknown bloks don't break the page.
 *
 * When you see this: add the component to src/lib/storyblok/componentMap.ts.
 */
export function SbFallback({ blok }: { blok: FallbackBlok }) {
  if (process.env.NODE_ENV !== 'development') return null

  return (
    <div
      role="status"
      className="mx-4 my-2 rounded border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900"
    >
      <strong>Unregistered blok:</strong>{' '}
      <code className="rounded bg-amber-100 px-1 font-mono">{blok.component}</code>
      <span className="ml-2 text-amber-700">— add it to componentMap.ts</span>
    </div>
  )
}
