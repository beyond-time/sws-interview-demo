export type SbGqlQueryDemoBlok = {
  _uid: string
  component: 'gql_query_demo'
  query_name?: string
  query_preview?: string
  expected_output_description?: string
}

export function SbGqlQueryDemo({ blok }: { blok: SbGqlQueryDemoBlok }) {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        <div className="rounded-lg border border-stone-200">
          {/* Header */}
          <div className="flex items-center gap-3 border-b border-stone-200 bg-zinc-50 px-5 py-3">
            <span className="rounded bg-digital-blue px-2 py-0.5 text-xs font-semibold text-white">
              GraphQL
            </span>
            {blok.query_name && (
              <h2 className="text-sm font-semibold text-zinc-800">{blok.query_name}</h2>
            )}
          </div>

          {/* Query preview */}
          {blok.query_preview && (
            <pre className="overflow-x-auto bg-zinc-950 p-5 text-sm leading-relaxed text-zinc-100">
              <code>{blok.query_preview}</code>
            </pre>
          )}

          {/* Expected output */}
          {blok.expected_output_description && (
            <div className="border-t border-stone-200 px-5 py-4">
              <p className="text-xs font-semibold uppercase tracking-wider text-stone">
                Expected output
              </p>
              <p className="mt-1 text-sm text-zinc-600">
                {blok.expected_output_description}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
