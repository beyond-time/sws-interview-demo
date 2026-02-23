import { revalidateTag } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'
import { env } from '@/lib/env/server'

/**
 * POST /api/webhook/storyblok
 *
 * Receives Storyblok publish/unpublish/delete webhooks and busts the
 * 'storyblok' cache tag, which invalidates every page and GQL response
 * that was tagged with it.
 *
 * Security: Storyblok signs the request body with HMAC-SHA1 using the
 * webhook secret defined in Settings → Webhooks. We verify the signature
 * before revalidating anything.
 *
 * Configure in Storyblok:
 *   URL:    https://<your-domain>/api/webhook/storyblok
 *   Secret: value of STORYBLOK_WEBHOOK_SECRET in your env
 *   Events: story_published, story_unpublished, story_deleted, story_moved
 *
 * See docs/STORYBLOK_WEBHOOK_SETUP.md for the full setup guide.
 */
export async function POST(req: NextRequest) {
  if (!env.STORYBLOK_WEBHOOK_SECRET) {
    // Fail closed — never revalidate without a configured secret
    return NextResponse.json(
      { error: 'Webhook secret not configured on this deployment' },
      { status: 500 },
    )
  }

  const signature = req.headers.get('webhook-signature')
  if (!signature) {
    return NextResponse.json({ error: 'Missing webhook-signature header' }, { status: 401 })
  }

  // Read raw body — must happen before any other body parsing
  const rawBody = await req.text()

  const expected = createHmac('sha1', env.STORYBLOK_WEBHOOK_SECRET)
    .update(rawBody)
    .digest('hex')

  let sigBuf: Buffer, expBuf: Buffer
  try {
    sigBuf = Buffer.from(signature, 'hex')
    expBuf = Buffer.from(expected, 'hex')
  } catch {
    return NextResponse.json({ error: 'Invalid signature format' }, { status: 401 })
  }

  if (sigBuf.length !== expBuf.length || !timingSafeEqual(sigBuf, expBuf)) {
    return NextResponse.json({ error: 'Signature mismatch' }, { status: 401 })
  }

  // Bust all cache entries tagged 'storyblok' — covers every CMS page and
  // every GQL response (which is also tagged 'storyblok' via cacheTag()).
  revalidateTag('storyblok', 'max')

  return NextResponse.json({
    revalidated: true,
    tag: 'storyblok',
    revalidatedAt: new Date().toISOString(),
  })
}
