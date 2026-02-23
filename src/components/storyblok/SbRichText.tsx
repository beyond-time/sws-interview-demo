'use client'

import { renderRichText } from '@storyblok/react'

export type SbRichTextBlok = {
  _uid: string
  component: 'rich_text_section'
  title?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  body?: any
  max_width?: 'narrow' | 'normal' | 'wide'
}

const maxWidthClass = {
  narrow: 'max-w-xl',
  normal: 'max-w-2xl',
  wide: 'max-w-4xl',
}

export function SbRichText({ blok }: { blok: SbRichTextBlok }) {
  const width = maxWidthClass[blok.max_width ?? 'normal']
  const html = blok.body ? renderRichText(blok.body) : ''

  return (
    <section className="bg-white py-12" aria-labelledby={blok.title ? `rt-${blok._uid}` : undefined}>
      <div className={`mx-auto px-4 sm:px-6 ${width}`}>
        {blok.title && (
          <h2
            id={`rt-${blok._uid}`}
            className="mb-6 text-2xl font-bold tracking-tight text-zinc-900"
          >
            {blok.title}
          </h2>
        )}
        {html && (
          <div
            className="prose prose-zinc max-w-none prose-headings:font-bold prose-a:text-cardinal prose-a:underline prose-a:underline-offset-2 hover:prose-a:text-cardinal-dark"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        )}
      </div>
    </section>
  )
}
