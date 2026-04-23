import type { MetadataRoute } from 'next'

const BASE = 'https://samridhlimbu.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: BASE,             lastModified: now, changeFrequency: 'weekly',  priority: 1 },
    { url: `${BASE}/about`,  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/projects`, lastModified: now, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${BASE}/resume`, lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/writing`, lastModified: now, changeFrequency: 'weekly', priority: 0.8 },
  ]

  const projectSlugs = [
    'kairos', 'hoddle', 'tapcraft', 'king-glazing',
    'nmmun', 'krishnaveni', 'farmers-intuition',
    'govchat', 'notes-app', 'load-balancer',
  ]

  const projectRoutes: MetadataRoute.Sitemap = projectSlugs.map(slug => ({
    url: `${BASE}/projects/${slug}`,
    lastModified: now,
    changeFrequency: 'monthly',
    priority: 0.7,
  }))

  return [...staticRoutes, ...projectRoutes]
}
