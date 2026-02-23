import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /**
   * Enables the 'use cache' directive, cacheTag(), and cacheLife().
   * Used in src/lib/storyblok/client.ts and src/lib/gql/client.ts to cache
   * server-side responses with on-demand invalidation via revalidateTag().
   */
  cacheComponents: true,

  experimental: {
    /**
     * Enables forbidden() and unauthorized() navigation APIs.
     * Used by EditorGuard to return HTTP 403 when the Storyblok token
     * fails verification.
     */
    authInterrupts: true,
  },
}

export default nextConfig
