import fs from 'node:fs'
import path from 'node:path'
import type { MetadataRoute } from 'next'
import { POSTS } from '@/lib/writing'
import { BASE_URL } from '@/lib/seo'

// Built once at build time: src/app is read from disk, which a server function can't see.
export const dynamic = 'force-static'

// Fixed so the sitemap only changes when the content does. Bump it on a real update.
const LAST_MODIFIED = new Date('2026-10-29')

const APP_DIR = path.join(process.cwd(), 'src', 'app')

// Every static page.tsx under src/app, found at build time, so a new page is
// listed without editing this file. Dynamic routes ([slug]) are added below.
function staticRoutes(dir = APP_DIR, route = ''): string[] {
  const routes: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name === 'page.tsx') {
      routes.push(route || '/')
    }
    // Skip dynamic segments, private folders and API routes. Route groups add no path.
    if (!entry.isDirectory() || /^[[_]/.test(entry.name) || entry.name === 'api') {
      continue
    }
    const segment = /^\(.*\)$/.test(entry.name) ? '' : `/${entry.name}`
    routes.push(...staticRoutes(path.join(dir, entry.name), route + segment))
  }
  return routes
}

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
  const pages: MetadataRoute.Sitemap = staticRoutes().sort().map(route => ({
    url: route === '/' ? BASE_URL : `${BASE_URL}${route}`,
    lastModified: LAST_MODIFIED,
    ...settings(route),
  }))

  const writingRoutes: MetadataRoute.Sitemap = POSTS.map(post => ({
    url: `${BASE_URL}/writing/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: 'yearly',
    priority: 0.6,
  }))

  return [...pages, ...writingRoutes]
}
