/**
 * SkipLink — keyboard accessibility helper.
 *
 * Renders a visually hidden link that becomes visible on focus, allowing
 * keyboard users to skip past the navigation directly to the main content.
 * The target element must have id="main-content" and tabIndex={-1}.
 *
 * WCAG 2.1 SC 2.4.1 — Bypass Blocks (Level A)
 */
export function SkipLink() {
  return (
    <a
      href="#main-content"
      className={[
        // Hidden until focused
        'sr-only focus:not-sr-only',
        // When visible: cardinal bar at top of page
        'focus:fixed focus:left-4 focus:top-4 focus:z-50',
        'focus:rounded focus:bg-cardinal focus:px-4 focus:py-2',
        'focus:text-sm focus:font-semibold focus:text-white',
        'focus:shadow-lg focus:outline-none',
      ].join(' ')}
    >
      Skip to main content
    </a>
  )
}
