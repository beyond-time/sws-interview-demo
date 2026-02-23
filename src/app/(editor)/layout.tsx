/**
 * Editor route group layout.
 *
 * Intentionally bare — no Header, Footer, or SkipLink.
 * The editor route is loaded inside a Storyblok Visual Editor iframe;
 * full site chrome would break the preview layout.
 */
export default function EditorGroupLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
