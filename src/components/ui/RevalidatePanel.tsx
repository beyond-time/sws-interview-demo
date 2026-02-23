'use client'

import { useState } from 'react'
import { RefreshCw } from 'lucide-react'

// ── Known targets ─────────────────────────────────────────────────────────────

const TAG_OPTIONS = [
  { value: 'gql-articles', label: 'gql-articles — GraphQL article list' },
  { value: 'storyblok', label: 'storyblok — all Storyblok pages' },
  { value: 'story:site/gql-demo', label: 'story:site/gql-demo — this page story' },
]

const PATH_OPTIONS = [
  { value: '/gql-demo', label: '/gql-demo — GraphQL demo' },
  { value: '/', label: '/ — home page' },
  { value: '/accessibility-lab', label: '/accessibility-lab' },
  { value: '/data-integration-lab', label: '/data-integration-lab' },
  { value: '/revalidation-lab', label: '/revalidation-lab' },
]

const DEFAULT_SECRET_HINT = 'R3V4L1D473_53CR37'

// ── Types ─────────────────────────────────────────────────────────────────────

type Mode = 'tag' | 'path'

interface ApiResult {
  ok: boolean
  status: number
  body: Record<string, unknown>
}

// ── Component ─────────────────────────────────────────────────────────────────

export function RevalidatePanel() {
  const [mode, setMode] = useState<Mode>('tag')
  const [secret, setSecret] = useState('')
  const [tag, setTag] = useState(TAG_OPTIONS[0].value)
  const [path, setPath] = useState(PATH_OPTIONS[0].value)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<ApiResult | null>(null)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setResult(null)

    const effectiveSecret = secret || DEFAULT_SECRET_HINT

    try {
      let url: string
      if (mode === 'tag') {
        url = `/api/revalidate?secret=${encodeURIComponent(effectiveSecret)}&tag=${encodeURIComponent(tag)}`
      } else {
        url = `/api/revalidate/page?secret=${encodeURIComponent(effectiveSecret)}&path=${encodeURIComponent(path)}`
      }

      const res = await fetch(url)
      const body = (await res.json()) as Record<string, unknown>
      setResult({ ok: res.ok, status: res.status, body })
    } catch (err) {
      setResult({
        ok: false,
        status: 0,
        body: { error: err instanceof Error ? err.message : String(err) },
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="rounded-lg border border-stone-200 bg-white p-5">
      <h3 className="mb-1 text-sm font-semibold text-zinc-900">On-demand revalidation</h3>
      <p className="mb-4 text-xs text-zinc-500">
        Bust the Next.js cache without redeploying. After a successful hit, reload the page — the
        &quot;rendered at&quot; timestamp will change.
      </p>

      <form onSubmit={handleSubmit} className="space-y-3">
        {/* Mode toggle */}
        <div className="flex rounded-md border border-stone-200 text-xs font-medium overflow-hidden">
          {(['tag', 'path'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => { setMode(m); setResult(null) }}
              className={`flex-1 py-1.5 transition-colors ${
                mode === m
                  ? 'bg-digital-blue text-white'
                  : 'bg-white text-zinc-600 hover:bg-stone-50'
              }`}
            >
              By {m}
            </button>
          ))}
        </div>

        {/* Tag or path selector */}
        {mode === 'tag' ? (
          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="w-full rounded border border-stone-200 bg-white px-3 py-1.5 text-xs text-zinc-800 focus:outline-2 focus:outline-cardinal"
          >
            {TAG_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        ) : (
          <select
            value={path}
            onChange={(e) => setPath(e.target.value)}
            className="w-full rounded border border-stone-200 bg-white px-3 py-1.5 text-xs text-zinc-800 focus:outline-2 focus:outline-cardinal"
          >
            {PATH_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        )}

        {/* Secret input */}
        <div>
          <input
            type="text"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder={`secret (default: ${DEFAULT_SECRET_HINT})`}
            className="w-full rounded border border-stone-200 bg-white px-3 py-1.5 font-mono text-xs text-zinc-800 placeholder-zinc-400 focus:outline-2 focus:outline-cardinal"
          />
          <p className="mt-1 text-[10px] text-zinc-400">
            Leave blank to use the default demo secret. Enter anything else to test the 401 response.
          </p>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded bg-cardinal px-4 py-2 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-cardinal"
        >
          <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
          {loading ? 'Revalidating…' : 'Revalidate now'}
        </button>
      </form>

      {/* Result */}
      {result && (
        <div
          className={`mt-4 rounded border px-4 py-3 ${
            result.ok
              ? 'border-green-200 bg-green-50'
              : 'border-red-200 bg-red-50'
          }`}
        >
          <p className={`mb-1.5 text-xs font-semibold ${result.ok ? 'text-green-800' : 'text-red-800'}`}>
            {result.ok ? `✓ ${result.status} OK` : `✗ ${result.status || 'Network error'}`}
          </p>
          <pre className="overflow-x-auto text-[11px] leading-relaxed text-zinc-700">
            {JSON.stringify(result.body, null, 2)}
          </pre>
        </div>
      )}

      {/* Hint: generated URL */}
      <details className="mt-3">
        <summary className="cursor-pointer text-[10px] text-zinc-400 hover:text-zinc-600">
          Show request URL
        </summary>
        <code className="mt-1 block break-all text-[10px] text-zinc-500">
          {mode === 'tag'
            ? `/api/revalidate?secret=***&tag=${tag}`
            : `/api/revalidate/page?secret=***&path=${path}`}
        </code>
      </details>
    </div>
  )
}
