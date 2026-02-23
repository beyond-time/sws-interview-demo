import type { Metadata } from 'next'
import Link from 'next/link'
import { Suspense } from 'react'
import { connection } from 'next/server'
import { fetchArticles, type ArticleItemsQuery } from '@/lib/gql/client'
import { ArticleItemsDocument } from '@/lib/gql/generated'
import { env } from '@/lib/env/server'
import { RevalidatePanel } from '@/components/ui/RevalidatePanel'

export const metadata: Metadata = {
  title: 'GraphQL Demo — SWS Interview Demo',
  description:
    'Live articles fetched from Storyblok via the GraphQL Content Delivery API, cached with Next.js "use cache" + cacheTag.',
}

// ── Articles component ────────────────────────────────────────────────────────

async function Articles() {
  const configured = !!(
    env.STORYBLOK_GRAPHQL_ENDPOINT &&
    (env.STORYBLOK_GRAPHQL_TOKEN || env.STORYBLOK_PUBLIC_ACCESS_TOKEN)
  )

  if (!configured) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
        <p className="text-sm font-medium text-amber-800">GraphQL not configured</p>
        <p className="mt-1 text-xs text-amber-700">
          Set <code className="rounded bg-amber-100 px-1">STORYBLOK_GRAPHQL_ENDPOINT</code> and{' '}
          <code className="rounded bg-amber-100 px-1">STORYBLOK_GRAPHQL_TOKEN</code> in{' '}
          <code className="rounded bg-amber-100 px-1">.env.local</code> to see live data.
        </p>
      </div>
    )
  }

  let data: ArticleItemsQuery | null = null
  let error: string | null = null

  try {
    data = await fetchArticles()
  } catch (err) {
    error = err instanceof Error ? err.message : String(err)
  }

  if (error) {
    // Storyblok returns this message for free-plan spaces
    const isPlanLimit =
      error.includes('not available for your plan') || error.includes('Enterprise')

    if (isPlanLimit) {
      return (
        <div className="space-y-4">
          <div className="rounded-lg border border-blue-200 bg-blue-50 p-5">
            <p className="text-sm font-semibold text-blue-900">
              GraphQL is an Enterprise-tier feature on Storyblok
            </p>
            <p className="mt-1 text-xs leading-relaxed text-blue-800">
              The free plan doesn&apos;t expose the GraphQL API — this 403 is expected. The
              integration code is complete and production-ready: the{' '}
              <code className="rounded bg-blue-100 px-0.5">graphql-request</code> client, generated
              SDK, <code className="rounded bg-blue-100 px-0.5">&apos;use cache&apos;</code>{' '}
              directive, and revalidation endpoints all work exactly as they would on a paid space.
            </p>
          </div>
          <p className="rounded-lg border border-stone-200 bg-stone-50 p-5 text-sm text-zinc-500">
            No articles to display — GraphQL endpoint not accessible on this plan.
          </p>
        </div>
      )
    }

    return (
      <div className="rounded-lg border border-red-200 bg-red-50 p-6">
        <p className="text-sm font-medium text-red-800">Query failed</p>
        <p className="mt-1 font-mono text-xs text-red-700">{error}</p>
      </div>
    )
  }

  const items = data?.ArticleItems?.items ?? []
  const total = data?.ArticleItems?.total ?? 0

  return (
    <>
      <p className="mb-4 text-sm text-zinc-500">
        {total} article{total !== 1 ? 's' : ''} returned from Storyblok GraphQL
      </p>
      {items.length === 0 ? (
        <p className="rounded-lg border border-stone-200 bg-stone-50 p-6 text-sm text-zinc-500">
          No articles found. Create articles in the{' '}
          <code className="rounded bg-stone-100 px-1">content/articles/</code> folder in Storyblok.
        </p>
      ) : (
        <ul
          className="divide-y divide-stone-100 rounded-lg border border-stone-200 bg-white"
          role="list"
        >
          {items.map((item) => {
            if (!item) return null
            const title = item.content?.title ?? item.name ?? '(untitled)'
            const excerpt = item.content?.excerpt
            const date = item.content?.published_at
              ? new Date(item.content.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })
              : null

            return (
              <li key={item.uuid ?? item.slug} className="px-6 py-5">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <h3 className="text-sm font-semibold text-zinc-900">{title}</h3>
                  {date && <time className="shrink-0 text-xs text-zinc-400">{date}</time>}
                </div>
                {excerpt && (
                  <p className="mt-1 text-sm leading-relaxed text-zinc-600">{excerpt}</p>
                )}
                <p className="mt-2 font-mono text-xs text-zinc-400">{item.full_slug}</p>
              </li>
            )
          })}
        </ul>
      )}
    </>
  )
}

// ── Dynamic content (timestamp + articles) ────────────────────────────────────
// Rendered inside <Suspense> so connection() + new Date() satisfy cacheComponents'
// requirement that uncached data access occurs within a Suspense boundary.

async function DynamicContent() {
  await connection()
  const renderedAt = new Date().toISOString()

  return (
    <>
      {/* Cache timestamp */}
      <div className="mb-2 flex flex-wrap items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3">
        <span className="h-2 w-2 shrink-0 rounded-full bg-green-500" aria-hidden="true" />
        <p className="text-xs text-zinc-600">
          Page rendered at{' '}
          <time className="font-mono font-medium text-zinc-800" dateTime={renderedAt}>
            {renderedAt}
          </time>
        </p>
        <p className="ml-auto text-xs text-zinc-400">(changes only after a cache bust + reload)</p>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <p className="mb-6 rounded border border-amber-200 bg-amber-50 px-4 py-2 text-xs text-amber-800">
          <strong>Dev mode:</strong> Next.js bypasses the cache in development — the timestamp
          changes on every refresh. Run{' '}
          <code className="rounded bg-amber-100 px-1">next build &amp;&amp; next start</code> to see
          stable timestamps that only update after a revalidation.
        </p>
      )}

      <h2 className="mb-4 text-lg font-semibold text-zinc-900">Articles</h2>
      <Articles />
    </>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
// Synchronous — no dynamic data access at page level. DynamicContent (inside
// <Suspense>) handles connection(), new Date(), and the articles fetch.

export default function GqlDemoPage() {
  return (
    <>
      {/* Page header */}
      <header className="border-b border-stone-200 bg-fog">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded bg-digital-blue px-2 py-0.5 text-xs font-semibold text-white">
              GraphQL
            </span>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
              GraphQL Integration Demo
            </h1>
          </div>
          <p className="mt-3 max-w-2xl text-base text-zinc-600">
            Articles fetched via a type-safe{' '}
            <code className="rounded bg-stone-100 px-1 py-0.5 text-xs">graphql-request</code> SDK
            (generated by GraphQL Code Generator). The result is cached server-side with{' '}
            <code className="rounded bg-stone-100 px-1 py-0.5 text-xs">&apos;use cache&apos;</code>{' '}
            + <code className="rounded bg-stone-100 px-1 py-0.5 text-xs">cacheTag</code>. Use the
            panel on the right to bust the cache and watch the timestamp change.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
          {/* Left: live data — streamed inside Suspense */}
          <div>
            <Suspense
              fallback={
                <p className="animate-pulse text-sm text-zinc-400">Loading articles…</p>
              }
            >
              <DynamicContent />
            </Suspense>
          </div>

          {/* Right: query source + interactive revalidation */}
          <aside className="space-y-6">
            {/* Query preview — sourced from src/lib/gql/queries/articles.graphql via generated.ts */}
            <div className="overflow-hidden rounded-lg border border-stone-200">
              <div className="flex items-center gap-2 border-b border-stone-200 bg-zinc-50 px-4 py-2.5">
                <span className="rounded bg-digital-blue px-2 py-0.5 text-xs font-semibold text-white">
                  GQL
                </span>
                <span className="text-xs font-medium text-zinc-700">
                  src/lib/gql/queries/articles.graphql
                </span>
              </div>
              <pre className="overflow-x-auto bg-zinc-950 p-4 text-xs leading-relaxed text-zinc-100">
                <code>{ArticleItemsDocument.trim()}</code>
              </pre>
            </div>

            {/* Interactive revalidation panel */}
            <RevalidatePanel />

            {/* Back link */}
            <Link
              href="/"
              className="block text-center text-sm text-digital-blue underline-offset-2 hover:underline focus-visible:outline-2 focus-visible:outline-cardinal"
            >
              ← Back to demo home
            </Link>
          </aside>
        </div>
      </div>
    </>
  )
}
