type StatItemBlok = {
  _uid: string
  component: 'stat_item'
  label: string
  value: string
  help_text?: string
}

export type SbStatsGridBlok = {
  _uid: string
  component: 'stats_grid'
  items?: StatItemBlok[]
}

function StatItem({ blok }: { blok: StatItemBlok }) {
  return (
    <li className="rounded-lg border border-stone-200 bg-white px-6 py-5">
      <p className="text-3xl font-bold text-cardinal">{blok.value}</p>
      <p className="mt-1 text-sm font-semibold text-zinc-900">{blok.label}</p>
      {blok.help_text && (
        <p className="mt-1 text-xs text-zinc-500">{blok.help_text}</p>
      )}
    </li>
  )
}

export function SbStatsGrid({ blok }: { blok: SbStatsGridBlok }) {
  const items = blok.items ?? []
  if (!items.length) return null

  return (
    <section className="bg-fog py-12">
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <ul
          className="grid grid-cols-2 gap-4 sm:grid-cols-4"
          role="list"
        >
          {items.map((item) => (
            <StatItem key={item._uid} blok={item} />
          ))}
        </ul>
      </div>
    </section>
  )
}
