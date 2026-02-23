import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Home',
  description:
    'Full-stack interview demo for Stanford Web Services — Next.js App Router, Storyblok, GraphQL, Tailwind, Vercel.',
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const features = [
  {
    icon: '⬡',
    title: 'Storyblok CMS Integration',
    description:
      'Modular page composition using a Storyblok component registry. Blok types map to typed React components, with content fetched at build time via generateStaticParams.',
    tags: ['REST API', 'Draft / Published', 'Component registry'],
  },
  {
    icon: '🔒',
    title: 'Secure Editor Preview',
    description:
      'Storyblok Visual Editor requests are verified on the server (SHA-1 + timestamp freshness check) before draft content is rendered. If verification fails, draft content is not returned.',
    tags: ['SHA-1 verification', 'Server Component', 'Replay protection'],
  },
  {
    icon: '⬡',
    title: 'GraphQL + Code Generation',
    description:
      'Typed GraphQL operations using graphql-request and an SDK generated with GraphQL Code Generator. Types flow from the schema into the app, which helps catch many issues at compile time.',
    tags: ['graphql-request', 'TypeScript SDK', 'Storyblok GQL v2'],
  },
  {
    icon: '⚡',
    title: 'Caching & On-Demand Revalidation',
    description:
      'CMS pages are statically generated via generateStaticParams. The /gql-demo route uses use cache + cacheTag, with /api/revalidate and a Storyblok webhook endpoint to refresh cached data on demand.',
    tags: ['use cache', 'revalidateTag', 'revalidatePath'],
  },
  {
    icon: '♿',
    title: 'Accessibility Patterns (WCAG AA)',
    description:
      'Skip link, visible focus rings, one h1 per page, semantic landmarks, alt text policy, and keyboard navigation verified end-to-end. Decanter color tokens pass contrast checks.',
    tags: ['WCAG 2.0 AA', 'Keyboard nav', 'Semantic HTML'],
  },
  {
    icon: '🎨',
    title: 'Stanford Design System',
    description:
      'Tailwind CSS v4 with Stanford Decanter brand tokens defined via @theme. Cardinal red, digital blue, and stone palette. One documented extension following Decanter conventions.',
    tags: ['Tailwind v4', 'Decanter tokens', 'Brand palette'],
  },
] as const

const labs = [
  {
    href: '/',
    label: 'Home',
    status: 'live' as const,
    interactive: false,
    description: 'This page introduces the demo and explains what each section covers.',
  },
  {
    href: '/gql-demo',
    label: 'GraphQL Demo',
    status: 'live' as const,
    interactive: true,
    description:
      'The only interactive page. Run a live query against Storyblok’s GraphQL API, view cached timestamps, and trigger on-demand cache revalidation.',
  },
  {
    href: '/editor',
    label: 'Editor Preview',
    status: 'live' as const,
    interactive: false,
    description:
      'Explains how Storyblok Visual Editor requests are verified — SHA-1 signature + timestamp freshness — before any draft content is rendered.',
  },
  {
    href: '/accessibility-lab',
    label: 'Accessibility Lab',
    status: 'live' as const,
    interactive: false,
    description:
      'Covers WCAG 2.0 AA patterns applied in this project: skip link, visible focus rings, one h1 per page, semantic landmarks, and alt text policy.',
  },
  {
    href: '/data-integration-lab',
    label: 'Data Integration Lab',
    status: 'live' as const,
    interactive: false,
    description:
      'Shows how typed GraphQL relations connect content types (author ↔ article). Includes the query you would run and links to the live demo.',
  },
  {
    href: '/cache-revalidation-lab',
    label: 'Cache & Revalidation Lab',
    status: 'live' as const,
    interactive: false,
    description:
      'Explains SSG, tag-based, and path-based on-demand revalidation side by side. Links to the live revalidation panel to try it in practice.',
  },
] as const

const stackItems = [
  { name: 'Next.js 16', role: 'App Router, SSG, API routes' },
  { name: 'React 19', role: 'Server + Client Components' },
  { name: 'TypeScript', role: 'End-to-end type safety' },
  { name: 'Storyblok', role: 'Headless CMS' },
  { name: 'GraphQL', role: 'Typed content queries' },
  { name: 'Tailwind CSS v4', role: 'Utility-first styling' },
  { name: 'Zod', role: 'Runtime schema validation' },
  { name: 'Vercel', role: 'Deployment + Data Cache' },
] as const

// ─── Status badge helper ───────────────────────────────────────────────────────

function StatusBadge({ status }: { status: 'live' | 'planned' | 'guarded' }) {
  const styles = {
    live: 'bg-green-100 text-green-800',
    planned: 'bg-amber-100 text-amber-800',
    guarded: 'bg-blue-100 text-blue-800',
  } as const

  const labels = {
    live: 'Live',
    planned: 'Planned',
    guarded: 'Guarded',
  } as const

  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}
    >
      {labels[status]}
    </span>
  )
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="bg-cardinal text-white" aria-labelledby="hero-heading">
        <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6 sm:py-28">
          <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-cardinal-light">
            Stanford Web Services · Interview Demo
          </p>
          <h1
            id="hero-heading"
            className="max-w-3xl text-4xl font-bold leading-tight tracking-tight sm:text-5xl"
          >
            A small Next.js App Router demo — built to show, not tell
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            This demo site explores headless CMS integration, editor preview, GraphQL, caching/revalidation behavior, and accessibility patterns in a practical way.
            It was created with approaches inspired by patterns seen in public SU-SWS repositories.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <a
              href="#demo-labs"
              className="rounded bg-white px-5 py-2.5 text-sm font-semibold text-cardinal transition-colors hover:bg-stone-100 focus-visible:outline-2 focus-visible:outline-white"
            >
              Explore the labs
            </a>
            <a
              href="https://github.com/beyond-time/sws-interview-demo"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded border border-white/40 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:border-white/80 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-white"
            >
              View source
              <span className="sr-only"> (opens in new tab)</span>
            </a>
          </div>
        </div>
      </section>

      {/* ── What this demonstrates ───────────────────────────────────────── */}
      <section
        className="bg-white py-20"
        aria-labelledby="features-heading"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2
            id="features-heading"
            className="mb-3 text-3xl font-bold tracking-tight text-zinc-900"
          >
            What this demonstrates
          </h2>
          <p className="mb-12 max-w-2xl text-zinc-600">
            A set of focused examples showing how the main pieces work together: CMS content modeling, rendering, data fetching, caching, and accessible UI.
          </p>

          <ul
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            {features.map((feature) => (
              <li
                key={feature.title}
                className="rounded-lg border border-stone-200 bg-white p-6 transition-shadow hover:shadow-md"
              >
                <p
                  className="mb-3 text-2xl"
                  aria-hidden="true"
                >
                  {feature.icon}
                </p>
                <h3 className="mb-2 text-base font-semibold text-zinc-900">
                  {feature.title}
                </h3>
                <p className="mb-4 text-sm leading-relaxed text-zinc-600">
                  {feature.description}
                </p>
                <ul className="flex flex-wrap gap-2" role="list">
                  {feature.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full bg-fog px-2.5 py-1 text-xs font-medium text-stone"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Pages ────────────────────────────────────────────────────────── */}
      <section
        id="demo-labs"
        className="bg-fog py-20"
        aria-labelledby="labs-heading"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2
            id="labs-heading"
            className="mb-3 text-3xl font-bold tracking-tight text-zinc-900"
          >
            Inside the demo
          </h2>
          <p className="mb-12 text-zinc-600">
            Each page covers a specific area of the stack. Most pages explain and showcase an
            implementation — the GraphQL Demo is the only one with live interactive functionality.
          </p>

          <ul
            className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3"
            role="list"
          >
            {labs.map((lab) => (
              <li key={lab.href}>
                <Link
                  href={lab.href}
                  className="flex h-full flex-col rounded-lg border border-stone-200 bg-white p-5 transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-cardinal"
                  aria-label={`${lab.label} — ${lab.description}`}
                >
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <span className="font-medium text-zinc-900">
                      {lab.label}
                    </span>
                    <div className="flex shrink-0 items-center gap-1.5">
                      {lab.interactive && (
                        <span className="rounded-full bg-digital-blue/10 px-2 py-0.5 text-xs font-semibold text-digital-blue">
                          Interactive
                        </span>
                      )}
                      <StatusBadge status={lab.status} />
                    </div>
                  </div>
                  <p className="text-sm leading-relaxed text-zinc-600">
                    {lab.description}
                  </p>
                  <code className="mt-3 text-xs text-stone">{lab.href}</code>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Stack ────────────────────────────────────────────────────────── */}
      <section
        className="border-t border-stone-200 bg-white py-16"
        aria-labelledby="stack-heading"
      >
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2
            id="stack-heading"
            className="mb-8 text-xl font-semibold text-zinc-900"
          >
            Stack
          </h2>
          <ul
            className="grid grid-cols-2 gap-x-8 gap-y-3 sm:grid-cols-4"
            role="list"
          >
            {stackItems.map((item) => (
              <li key={item.name} className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-900">
                  {item.name}
                </span>
                <span className="text-xs text-zinc-500">{item.role}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  )
}
