type A11yCheckItemBlok = {
  _uid: string
  component: 'a11y_check_item'
  criterion: string
  why_it_matters?: string
  implementation_note?: string
  status?: 'pass' | 'partial' | 'demo' | 'todo'
}

export type SbA11yChecklistBlok = {
  _uid: string
  component: 'accessibility_checklist'
  title?: string
  items?: A11yCheckItemBlok[]
}

const statusConfig = {
  pass: { label: 'Pass', cls: 'bg-green-100 text-green-800' },
  partial: { label: 'Partial', cls: 'bg-amber-100 text-amber-800' },
  demo: { label: 'Demo', cls: 'bg-blue-100 text-blue-800' },
  todo: { label: 'Todo', cls: 'bg-zinc-100 text-zinc-600' },
} as const

function A11yCheckItem({ blok }: { blok: A11yCheckItemBlok }) {
  const status = blok.status ?? 'todo'
  const { label, cls } = statusConfig[status]

  return (
    <li className="border-b border-stone-100 py-5 last:border-0">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-zinc-900">{blok.criterion}</h3>
        <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>
          {label}
        </span>
      </div>
      {blok.why_it_matters && (
        <p className="mt-2 text-sm text-zinc-600">
          <span className="font-medium text-zinc-700">Why: </span>
          {blok.why_it_matters}
        </p>
      )}
      {blok.implementation_note && (
        <p className="mt-1 text-sm text-zinc-500">
          <span className="font-medium">Note: </span>
          {blok.implementation_note}
        </p>
      )}
    </li>
  )
}

export function SbA11yChecklist({ blok }: { blok: SbA11yChecklistBlok }) {
  const items = blok.items ?? []

  return (
    <section className="bg-white py-12" aria-labelledby={`a11y-${blok._uid}`}>
      <div className="mx-auto max-w-4xl px-4 sm:px-6">
        {blok.title && (
          <h2
            id={`a11y-${blok._uid}`}
            className="mb-6 text-2xl font-bold tracking-tight text-zinc-900"
          >
            {blok.title}
          </h2>
        )}
        {items.length > 0 ? (
          <ul
            className="divide-y divide-stone-100 rounded-lg border border-stone-200 bg-white px-6"
            role="list"
          >
            {items.map((item) => (
              <A11yCheckItem key={item._uid} blok={item} />
            ))}
          </ul>
        ) : (
          <p className="text-sm text-zinc-500">No checklist items yet.</p>
        )}
      </div>
    </section>
  )
}
