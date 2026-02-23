import { SkipLink } from '@/components/ui/SkipLink'
import { Header } from '@/components/ui/Header'
import { Footer } from '@/components/ui/Footer'

/**
 * Public site layout.
 *
 * Wraps all (site) routes with SkipLink + Header + main landmark + Footer.
 * The <main> element has id="main-content" so the SkipLink target resolves,
 * and tabIndex={-1} so it can receive programmatic focus.
 */
export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <SkipLink />
      <Header />
      <main id="main-content" tabIndex={-1} className="flex-1 outline-none">
        {children}
      </main>
      <Footer />
    </div>
  )
}
