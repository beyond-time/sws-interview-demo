import { z } from 'zod'

/**
 * Server-side environment variable schema.
 *
 * All Storyblok and secret fields are optional during local development
 * so the site still starts without credentials. Required fields are
 * enforced at runtime in the functions that actually use them.
 */
const serverEnvSchema = z.object({
  // App
  NEXT_PUBLIC_SITE_URL: z.string().url().default('http://localhost:3000'),

  // Storyblok delivery
  STORYBLOK_REGION: z.enum(['eu', 'us', 'ca', 'ap', 'cn']).default('eu'),
  STORYBLOK_PUBLIC_ACCESS_TOKEN: z.string().optional(),
  STORYBLOK_PREVIEW_ACCESS_TOKEN: z.string().optional(),

  // Storyblok GraphQL
  STORYBLOK_GRAPHQL_ENDPOINT: z.string().url().optional(),
  STORYBLOK_GRAPHQL_TOKEN: z.string().optional(),

  // Revalidation / webhook secrets
  REVALIDATE_SECRET: z.string().optional(),
  DRAFT_MODE_SECRET: z.string().optional(),
  STORYBLOK_WEBHOOK_SECRET: z.string().optional(),

  // Debug
  NEXT_PRIVATE_DEBUG_CACHE: z.enum(['0', '1']).default('0'),
})

export type ServerEnv = z.infer<typeof serverEnvSchema>

/**
 * Parsed and validated server environment.
 * Throws at module evaluation time if required constraints are violated.
 */
export const env = serverEnvSchema.parse({
  ...process.env,
  // next coerces NEXT_PUBLIC_* at build time; include explicitly
  NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL,
})
