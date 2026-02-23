import { GraphQLClient } from 'graphql-request'
import { cacheTag, cacheLife } from 'next/cache'
import { env } from '@/lib/env/server'
import { getSdk, type ArticleItemsQuery } from './generated'

/**
 * Build a graphql-request GraphQLClient authenticated with the Storyblok
 * public token (passed as both a query-param and a header for CDN compat).
 *
 * The client is created per-call so the token is always read from the current
 * env — safe to call inside cached functions.
 */
function createSdk() {
  const token = env.STORYBLOK_GRAPHQL_TOKEN || env.STORYBLOK_PUBLIC_ACCESS_TOKEN
  const endpoint = env.STORYBLOK_GRAPHQL_ENDPOINT

  if (!endpoint || !token) {
    throw new Error(
      'STORYBLOK_GRAPHQL_ENDPOINT and STORYBLOK_GRAPHQL_TOKEN ' +
        '(or STORYBLOK_PUBLIC_ACCESS_TOKEN) must be set',
    )
  }

  // Pass token as ?token= so it survives CDN setups that strip custom headers
  const url = new URL(endpoint)
  url.searchParams.set('token', token)

  const client = new GraphQLClient(url.toString(), {
    headers: { Token: token },
  })

  return getSdk(client)
}

/**
 * Fetch the 10 most recent articles from Storyblok's GraphQL API.
 *
 * 'use cache' makes Next.js cache this function's return value server-side
 * (persists across requests, survives deploys on Vercel).
 *
 * cacheTag() makes the entry invalidatable on demand:
 *   POST /api/revalidate?secret=…&tag=gql-articles
 *
 * cacheLife('hours') → stale after ~1 hour, revalidates every ~1 hour,
 * expires after 1 week.
 *
 * Observe the effect: after calling the revalidation endpoint, reload
 * /gql-demo — the "rendered at" timestamp will change.
 */
export async function fetchArticles(): Promise<ArticleItemsQuery> {
  'use cache'
  cacheTag('gql-articles', 'storyblok')
  cacheLife('hours')

  return createSdk().ArticleItems()
}

export type { ArticleItemsQuery }
