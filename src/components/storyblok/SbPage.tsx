import { componentMap } from '@/lib/storyblok/componentMap'
import { SbFallback } from './SbFallback'

export type Blok = {
  component: string
  _uid: string
  [key: string]: unknown
}

/**
 * Renders an ordered array of Storyblok bloks using the component registry.
 *
 * For each blok:
 *  - If componentMap has an entry → renders that component
 *  - If not → renders SbFallback (dev: yellow warning, prod: nothing)
 */
export function SbPage({ bloks }: { bloks: Blok[] }) {
  if (!bloks?.length) {
    return (
      <div className="mx-auto max-w-6xl px-4 py-20 text-center">
        <p className="text-sm text-zinc-500">
          This page has no content blocks yet.
        </p>
      </div>
    )
  }

  return (
    <>
      {bloks.map((blok) => {
        const Component = componentMap[blok.component]
        if (!Component) {
          return <SbFallback key={blok._uid} blok={blok} />
        }
        return <Component key={blok._uid} blok={blok} />
      })}
    </>
  )
}
