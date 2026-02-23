import Link from 'next/link'

const footerLinks = [
  { href: '/', label: 'Home' },
  { href: '/gql-demo', label: 'GraphQL Demo' },
  { href: '/editor', label: 'Editor Preview' },
  {
    href: 'https://github.com/beyond-time/sws-interview-demo',
    label: 'Source',
    external: true,
  },
] as const

/**
 * Site-wide footer with navigation links and project context.
 *
 * Accessibility:
 * - contentinfo landmark (implicit from <footer>)
 * - nav inside footer has its own aria-label
 * - External links announce "opens in new tab"
 */
export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-stone py-10 text-white">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
          {/* Brand */}
          <div>
            <p className="text-sm font-bold tracking-wide">SWS Demo</p>
            <p className="mt-1 max-w-xs text-xs text-white/70">
              Interview demo — Stanford Web Services stack. Not an official
              Stanford project.
            </p>
          </div>

          {/* Footer nav */}
          <nav aria-label="Footer navigation">
            <ul className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-white/80">
              {footerLinks.map((link) => (
                <li key={link.href}>
                  {'external' in link && link.external ? (
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white"
                    >
                      {link.label}
                      <span className="sr-only"> (opens in new tab)</span>
                    </a>
                  ) : (
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-white"
                    >
                      {link.label}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <p className="mt-6 text-xs text-white/50">
          Built with Next.js {process.env.npm_package_dependencies_next ?? ''} ·
          Storyblok · GraphQL · Tailwind CSS · Vercel
        </p>
      </div>
    </footer>
  )
}
