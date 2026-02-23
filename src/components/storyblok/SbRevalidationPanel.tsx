export type SbRevalidationPanelBlok = {
  _uid: string
  component: 'revalidation_demo_panel'
  title?: string
  explanation?: string
  demo_story_slug?: string
  refresh_mode?: 'SSG' | 'ISR' | 'on-demand'
  revalidate_tag?: string
  expected_result_text?: string
}

const modeBadge: Record<string, string> = {
  SSG: 'bg-blue-100 text-blue-800',
  ISR: 'bg-purple-100 text-purple-800',
  'on-demand': 'bg-green-100 text-green-800',
}

export function SbRevalidationPanel({ blok }: { blok: SbRevalidationPanelBlok }) {
  const mode = blok.refresh_mode ?? 'SSG'
  const badgeCls = modeBadge[mode] ?? 'bg-zinc-100 text-zinc-800'

  return (
    <section className="border-b border-stone-200 bg-white py-10">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-lg border border-stone-200 p-6">
          {/* Header */}
          <div className="mb-4 flex flex-wrap items-start gap-3">
            {blok.title && (
              <h2 className="text-lg font-bold text-zinc-900">{blok.title}</h2>
            )}
            <span
              className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${badgeCls}`}
            >
              {mode}
            </span>
          </div>

          {blok.explanation && (
            <p className="mb-4 text-sm leading-relaxed text-zinc-600">
              {blok.explanation}
            </p>
          )}

          {/* Meta row */}
          <dl className="mb-4 grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
            {blok.demo_story_slug && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-stone">
                  Story slug
                </dt>
                <dd>
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-700">
                    {blok.demo_story_slug}
                  </code>
                </dd>
              </div>
            )}
            {blok.revalidate_tag && (
              <div>
                <dt className="text-xs font-semibold uppercase tracking-wider text-stone">
                  Cache tag
                </dt>
                <dd>
                  <code className="rounded bg-zinc-100 px-1.5 py-0.5 text-xs text-zinc-700">
                    {blok.revalidate_tag}
                  </code>
                </dd>
              </div>
            )}
          </dl>

          {blok.expected_result_text && (
            <div className="rounded border-l-4 border-cardinal bg-fog px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone">
                Expected result
              </p>
              <p className="mt-1 text-sm text-zinc-700">{blok.expected_result_text}</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
