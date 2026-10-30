import type { MetadataRoute } from 'next'
import { POSTS } from '@/lib/writing'
import { BASE_URL } from '@/lib/seo'
import { staticRoutes } from '@/lib/routes'

// Built once at build time: src/app is read from disk, which a server function can't see.
export const dynamic = 'force-static'

// Fixed so the sitemap only changes when the content does. Bump it on a real update.
const LAST_MODIFIED = new Date('2026-10-30')

// Every page.tsx is listed on its own (see staticRoutes), so a new page needs no edit here.
function settings(route: string): Pick<MetadataRoute.Sitemap[number], 'changeFrequency' | 'priority'> {
  if (route === '/') {
    return { changeFrequency: 'weekly', priority: 1 }
  }
  if (route === '/projects') {
    return { changeFrequency: 'weekly', priority: 0.9 }
  }
  if (route === '/writing') {
    return { changeFrequency: 'weekly', priority: 0.8 }
  }
  if (route === '/about') {
    return { changeFrequency: 'monthly', priority: 0.8 }
  }
  return { changeFrequency: 'monthly', priority: 0.7 }
}

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = staticRoutes().map(route => ({
    url: route === '/' ? BASE_URL : `${BASE_URL}${route}`,
    lastModified: LAST_MODIFIED,
    ...settings(route),
  }))

  const writingRoutes: MetadataRoute.Sitemap = POSTS.map(post => ({
    url: `${BASE_URL}/writing/${post.slug}`,
    lastModified: new Date(post.updated ?? post.date),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [...pages, ...writingRoutes]
}
