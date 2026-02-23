import Link from 'next/link'

const navLinks = [
  { href: '/gql-demo', label: 'GraphQL Demo' },
  { href: '/editor', label: 'Editor Preview' },
] as const

/**
 * Site-wide header with logo, primary navigation, and source link.
 *
 * Accessibility:
 * - nav landmark with aria-label distinguishes it from any other navs
 * - Logo link includes aria-label with site name context
 * - External link announces "(opens in new tab)" to screen readers
 */
export function Header() {
  return (
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-4 py-4 sm:px-6">
        {/* Logo / wordmark */}
        <Link
          href="/"
          className="flex items-center gap-2 text-base font-bold text-cardinal sm:text-lg"
          aria-label="SWS Demo — go to home page"
        >
          {/* Cardinal accent bar — decorative */}
          <span
            className="inline-block h-6 w-1.5 rounded-sm bg-cardinal"
            aria-hidden="true"
          />
          SWS Demo
        </Link>

        {/* Primary navigation */}
        <nav aria-label="Main navigation">
          <ul className="flex items-center gap-4 text-sm font-medium text-stone sm:gap-6">
            <li>
              <Link
                href="/"
                className="rounded text-zinc-600 transition-colors hover:text-cardinal focus-visible:outline-2 focus-visible:outline-cardinal"
              >
                Home
              </Link>
            </li>
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded text-zinc-600 transition-colors hover:text-cardinal focus-visible:outline-2 focus-visible:outline-cardinal"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Source link */}
        <a
          href="https://github.com/beyond-time/sws-interview-demo"
          target="_blank"
          rel="noopener noreferrer"
          className="hidden rounded bg-cardinal px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-cardinal-dark focus-visible:outline-2 focus-visible:outline-cardinal sm:inline-flex"
        >
          Source
          <span className="sr-only"> (opens in new tab)</span>
        </a>
      </div>
    </header>
  )
}
