export type SbCodeCalloutBlok = {
  _uid: string
  component: 'code_callout'
  title?: string
  code_snippet?: string
  language?: string
  explanation?: string
  is_copyable?: boolean
}

export function SbCodeCallout({ blok }: { blok: SbCodeCalloutBlok }) {
  return (
    <section className="bg-white py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {blok.title && (
          <h2 className="mb-4 text-xl font-bold text-zinc-900">{blok.title}</h2>
        )}

        {blok.code_snippet && (
          <div className="overflow-hidden rounded-lg border border-stone-200">
            {/* Language badge */}
            <div className="flex items-center justify-between border-b border-stone-200 bg-zinc-50 px-4 py-2">
              <span className="text-xs font-medium text-stone">
                {blok.language ?? 'code'}
              </span>
            </div>
            {/* Code block */}
            <pre className="overflow-x-auto bg-zinc-950 p-5 text-sm leading-relaxed text-zinc-100">
              <code>{blok.code_snippet}</code>
            </pre>
          </div>
        )}

        {blok.explanation && (
          <p className="mt-4 text-sm leading-relaxed text-zinc-600">
            {blok.explanation}
          </p>
        )}
      </div>
    </section>
  )
}
