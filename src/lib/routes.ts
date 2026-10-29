import fs from 'node:fs'
import path from 'node:path'

// Reads src/app from disk, so only call it from statically built routes
// (sitemap.ts, the projects index): a server function at runtime can't see it.
const APP_DIR = path.join(process.cwd(), 'src', 'app')

// Every static page.tsx under src/app, e.g. '/', '/about', '/projects/kairos'.
// Dynamic segments ([slug]), private folders and API routes are skipped; route groups add no path.
export function staticRoutes(dir = APP_DIR, route = ''): string[] {
  const routes: string[] = []
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile() && entry.name === 'page.tsx') {
      routes.push(route || '/')
    }
    if (!entry.isDirectory() || /^[[_]/.test(entry.name) || entry.name === 'api') {
      continue
    }
    const segment = /^\(.*\)$/.test(entry.name) ? '' : `/${entry.name}`
    routes.push(...staticRoutes(path.join(dir, entry.name), route + segment))
  }
  return routes.sort()
}

// Slugs that have a case study page at src/app/projects/<slug>/page.tsx.
export function caseStudySlugs(): Set<string> {
  return new Set(staticRoutes().flatMap(r => r.match(/^\/projects\/([^/]+)$/)?.[1] ?? []))
}
