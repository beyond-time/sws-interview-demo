/**
 * Rendered when forbidden() is called from this route segment.
 * Shown to anyone hitting /editor with an invalid or missing Storyblok token.
 *
 * Intentionally sparse — don't reveal why exactly the request was rejected.
 */
export default function EditorForbidden() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 text-white">
      <div className="text-center">
        <p className="mb-2 text-6xl font-bold text-cardinal">403</p>
        <h1 className="mb-4 text-2xl font-semibold">Access Denied</h1>
        <p className="max-w-sm text-sm text-zinc-400">
          This route is reserved for the Storyblok Visual Editor. Open it from
          your Storyblok space — direct access is not permitted.
        </p>
        <p className="mt-6 text-xs text-zinc-600">
          Invalid, expired, or missing editor token.
        </p>
        <a
          href="https://app.storyblok.com/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-6 inline-block text-sm text-cardinal hover:underline focus-visible:outline-2 focus-visible:outline-cardinal"
        >
          Open Storyblok ↗
          <span className="sr-only"> (opens in new tab)</span>
        </a>
      </div>
    </main>
  )
}
