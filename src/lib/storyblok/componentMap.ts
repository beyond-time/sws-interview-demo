import type { ComponentType } from 'react'
import { SbHero } from '@/components/storyblok/SbHero'
import { SbFeatureGrid } from '@/components/storyblok/SbFeatureGrid'
import { SbRichText } from '@/components/storyblok/SbRichText'
import { SbCtaBanner } from '@/components/storyblok/SbCtaBanner'
import { SbStatsGrid } from '@/components/storyblok/SbStatsGrid'
import { SbCodeCallout } from '@/components/storyblok/SbCodeCallout'
import { SbRevalidationPanel } from '@/components/storyblok/SbRevalidationPanel'
import { SbA11yChecklist } from '@/components/storyblok/SbA11yChecklist'
import { SbGqlQueryDemo } from '@/components/storyblok/SbGqlQueryDemo'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type BlokComponent = ComponentType<{ blok: any }>

/**
 * Maps Storyblok component names to React components.
 * The key must exactly match the "component" field value in Storyblok.
 * Unknown blok types fall back to SbFallback.
 */
export const componentMap: Record<string, BlokComponent> = {
  hero: SbHero,
  feature_grid: SbFeatureGrid,
  rich_text_section: SbRichText,
  cta_banner: SbCtaBanner,
  stats_grid: SbStatsGrid,
  code_callout: SbCodeCallout,
  revalidation_demo_panel: SbRevalidationPanel,
  accessibility_checklist: SbA11yChecklist,
  gql_query_demo: SbGqlQueryDemo,
}
