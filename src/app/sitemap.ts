import type { MetadataRoute } from 'next'
import { POSTS } from '@/lib/writing'

// Must match metadataBase in src/app/layout.tsx.
const BASE = 'https://samridhlimbu.com'

// Fixed so the sitemap only changes when the content does. Bump it on a real update.
const LAST_MODIFIED = new Date('2026-10-28')

// One entry per src/app/projects/<slug>/page.tsx.
const PROJECT_SLUGS = [
  'hoddle', 'kairos', 'aria', 'r1gpt', 'dsec', 'ontrack', 'tempo', 'morgue', 'cstack',
  'king-glazing', 'allarkive', 'acknowledgement-force', 'krishnaveni', 'nmmun', 'tapcraft',
  'lock-in', 'govchat', 'farmers-intuition', 'notes-app', 'load-balancer', 'bed-monitor', 'fleet-platform',
  'voice-controller', 'robot-api', 'dispatch', 'art-gallery', 'seatly',
]

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 1 },
    { url: `${BASE}/projects`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/about`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/writing`, lastModified: LAST_MODIFIED, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE}/resume`, lastModified: LAST_MODIFIED, changeFrequency: 'monthly', priority: 0.7 },
  ]

  const projectRoutes: MetadataRoute.Sitemap = PROJECT_SLUGS.map(slug => ({
    url: `${BASE}/projects/${slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  const writingRoutes: MetadataRoute.Sitemap = POSTS.map(post => ({
    url: `${BASE}/writing/${post.slug}`,
    lastModified: LAST_MODIFIED,
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [...staticRoutes, ...projectRoutes, ...writingRoutes]
}
