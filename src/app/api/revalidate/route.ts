import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env/server'

/**
 * POST /api/revalidate?secret=<REVALIDATE_SECRET>&tag=<cacheTag>
 *
 * Purges all cached responses carrying the given cache tag.
 * Called by Storyblok webhooks or manual triggers.
 *
 * Returns 401 on bad/missing secret, 400 on missing tag, 200 on success.
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  const tag = req.nextUrl.searchParams.get('tag')

  if (!env.REVALIDATE_SECRET || secret !== env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  if (!tag) {
    return NextResponse.json({ error: 'Missing required query param: tag' }, { status: 400 })
  }

  revalidateTag(tag, 'max')

  return NextResponse.json({
    revalidated: true,
    tag,
    revalidatedAt: new Date().toISOString(),
  })
}

/**
 * GET version so it can be triggered from a browser tab during demos.
 */
export async function GET(req: NextRequest) {
  return POST(req)
}
