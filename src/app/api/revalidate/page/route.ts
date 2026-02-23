import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'
import { env } from '@/lib/env/server'

/**
 * POST /api/revalidate/page?secret=<REVALIDATE_SECRET>&path=<urlPath>
 *
 * Revalidates a specific Next.js page path (e.g. /accessibility-lab).
 * Useful for targeted cache busting without purging a whole tag.
 *
 * Returns 401 on bad/missing secret, 400 on invalid path, 200 on success.
 */
export async function POST(req: NextRequest) {
  const secret = req.nextUrl.searchParams.get('secret')
  const path = req.nextUrl.searchParams.get('path')

  if (!env.REVALIDATE_SECRET || secret !== env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: 'Invalid secret' }, { status: 401 })
  }

  if (!path || !path.startsWith('/')) {
    return NextResponse.json(
      { error: "Missing or invalid 'path' — must start with /" },
      { status: 400 },
    )
  }

  revalidatePath(path)

  return NextResponse.json({
    revalidated: true,
    path,
    revalidatedAt: new Date().toISOString(),
  })
}

/**
 * GET version so it can be triggered from a browser tab during demos.
 */
export async function GET(req: NextRequest) {
  return POST(req)
}
