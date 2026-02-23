import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    template: '%s | SWS Demo',
    default: 'SWS Demo',
  },
  description:
    'Interview demo — Next.js App Router + Storyblok + GraphQL + Tailwind + Vercel',
}

/**
 * Root layout.
 *
 * Intentionally minimal: sets the html/body scaffold and imports global CSS.
 * Route-group-specific chrome (Header, Footer, SkipLink) lives in
 * app/(site)/layout.tsx so the editor route group can use a different shell.
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
