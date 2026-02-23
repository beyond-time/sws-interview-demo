import { createHash, timingSafeEqual } from 'crypto'

interface VerifyArgs {
  spaceId: string
  timestamp: string
  token: string
  previewToken: string
}

/**
 * Verifies a Storyblok Visual Editor request token.
 *
 * Algorithm (from Storyblok docs):
 *   expected = SHA1(spaceId + ":" + previewToken + ":" + timestamp)
 *   valid    = timingSafeEqual(expected, token) AND timestamp is fresh
 *
 * Security properties:
 * - timingSafeEqual prevents timing-based token enumeration attacks.
 * - Timestamp freshness (≤ 3600 s) prevents replay attacks.
 * - Default-deny: any missing/malformed input returns false.
 * - Must be called server-side only (previewToken never reaches the browser).
 */
export function verifyStoryblokToken({
  spaceId,
  timestamp,
  token,
  previewToken,
}: VerifyArgs): boolean {
  // Default-deny: reject if any input is missing
  if (!spaceId || !timestamp || !token || !previewToken) return false

  // Timestamp freshness — reject tokens older than 1 hour
  const ts = parseInt(timestamp, 10)
  if (!Number.isFinite(ts) || ts <= 0) return false
  const ageSeconds = Math.floor(Date.now() / 1000) - ts
  if (ageSeconds < 0 || ageSeconds > 3600) return false

  // Compute expected SHA-1 hash (always 40 hex chars)
  const expected = createHash('sha1')
    .update(`${spaceId}:${previewToken}:${timestamp}`)
    .digest('hex')

  // Timing-safe comparison — compare as UTF-8 encoded hex strings
  const expectedBuf = Buffer.from(expected)
  const tokenBuf = Buffer.from(token)

  // If lengths differ the comparison is impossible; return false (no timing leak)
  if (expectedBuf.length !== tokenBuf.length) return false

  try {
    return timingSafeEqual(expectedBuf, tokenBuf)
  } catch {
    return false
  }
}
