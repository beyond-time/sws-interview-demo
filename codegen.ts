import type { CodegenConfig } from '@graphql-codegen/cli'
import 'dotenv/config'

/**
 * GraphQL Code Generator configuration.
 *
 * Introspects Storyblok's GraphQL Content Delivery API and generates:
 *   - TypeScript types for schema types
 *   - Types for each named operation in src/lib/gql/queries/
 *   - A type-safe SDK via typescript-graphql-request
 *
 * Run:  npm run codegen
 * Requires STORYBLOK_GRAPHQL_ENDPOINT + STORYBLOK_GRAPHQL_TOKEN (Enterprise plan)
 */
const config: CodegenConfig = {
  schema: {
    [process.env.STORYBLOK_GRAPHQL_ENDPOINT ?? 'https://gapi.storyblok.com/v1/api']: {
      headers: {
        Token: process.env.STORYBLOK_GRAPHQL_TOKEN ?? process.env.STORYBLOK_PUBLIC_ACCESS_TOKEN ?? '',
      },
    },
  },
  documents: ['src/lib/gql/queries/**/*.graphql'],
  generates: {
    'src/lib/gql/generated.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-graphql-request',
      ],
      config: {
        rawRequest: false,
        inlineFragmentTypes: 'combine',
        skipTypename: true,
        exportFragmentSpreadSubTypes: true,
        dedupeFragments: true,
        onlyOperationTypes: false,
      },
    },
  },
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
}

export default config
