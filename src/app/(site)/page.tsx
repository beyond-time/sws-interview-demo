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
      'Modular page composition via a Storyblok component registry. Blok types map 1-to-1 to typed React components. Content fetched at build time via generateStaticParams.',
    tags: ['REST API', 'Draft / Published', 'Component registry'],
  },
  {
    icon: '🔒',
    title: 'Secure Editor Preview',
    description:
      'Storyblok Visual Editor requests are verified server-side using SHA-1 + timestamp freshness check before any draft content is rendered. Default-deny on any failure.',
    tags: ['SHA-1 verification', 'Server Component', 'Replay protection'],
  },
  {
    icon: '⬡',
    title: 'GraphQL + Code Generation',
    description:
      'Typed GraphQL operations via graphql-request and GraphQL Code Generator. A typed SDK ensures queries are correct at compile time, not runtime.',
    tags: ['graphql-request', 'TypeScript SDK', 'Storyblok GQL v2'],
  },
  {
    icon: '⚡',
    title: 'Caching & On-Demand Revalidation',
    description:
      'SSG for CMS pages (atomic deploy via Storyblok webhook). The /gql-demo route uses "use cache" + cacheLife, with /api/revalidate endpoints making staleness observable.',
    tags: ['use cache', 'revalidateTag', 'revalidatePath'],
  },
  {
    icon: '♿',
    title: 'Accessibility First (WCAG AA)',
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
    description: 'Static demo landing page with full layout.',
  },
  {
    href: '/gql-demo',
    label: 'GraphQL Demo',
    status: 'planned' as const,
    description: 'Typed GraphQL query with observable cache timestamps.',
  },
  {
    href: '/editor',
    label: 'Editor Preview',
    status: 'planned' as const,
    description: 'SHA-1 guarded route serving Storyblok draft content.',
  },
  {
    href: '/accessibility-lab',
    label: 'Accessibility Lab',
    status: 'planned' as const,
    description: 'WCAG AA checklist rendered from Storyblok content.',
  },
  {
    href: '/data-integration-lab',
    label: 'Data Integration Lab',
    status: 'planned' as const,
    description: 'GraphQL relations demo with typed author + article queries.',
  },
  {
    href: '/cache-revalidation-lab',
    label: 'Cache & Revalidation Lab',
    status: 'planned' as const,
    description: 'SSG vs ISR vs on-demand revalidation — side by side.',
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

      {/* ── Demo Labs ────────────────────────────────────────────────────── */}
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
            Demo labs
          </h2>
          <p className="mb-12 text-zinc-600">
            Each lab route demonstrates a specific integration. Routes marked{' '}
            <strong>Planned</strong> are scaffolded and will become active once
            the Storyblok space is configured.
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
                    <StatusBadge status={lab.status} />
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
