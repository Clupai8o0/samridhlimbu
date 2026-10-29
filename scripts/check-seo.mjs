// SEO gate. Runs before every build (npm "prebuild"), so Vercel refuses to
// deploy a page that search engines can't read well. Run it alone with
// `npm run check:seo`. The rules are listed in AGENTS.md under "SEO".
import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), '..')
const APP = path.join(ROOT, 'src', 'app')
const SRC = path.join(ROOT, 'src')
const PUBLIC = path.join(ROOT, 'public')
const BASE = 'https://samridhlimbu.com'

const errors = []
const fail = (file, msg) => errors.push(`${path.relative(ROOT, file)}: ${msg}`)

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name)
    if (e.isDirectory()) {
      walk(p, out)
    } else if (/\.(tsx?|mjs)$/.test(e.name)) {
      out.push(p)
    }
  }
  return out
}

// The route a page.tsx serves, e.g. src/app/projects/kairos/page.tsx -> /projects/kairos.
function routeOf(file) {
  const rel = path.relative(APP, path.dirname(file)).split(path.sep).filter(s => s && !/^\(.*\)$/.test(s))
  return '/' + rel.join('/')
}

// Each JSX tag starting with `<name`, up to its closing `>` outside braces.
function tags(source, name) {
  const found = []
  const re = new RegExp(`<${name}\\b`, 'g')
  let m
  while ((m = re.exec(source))) {
    let depth = 0
    let i = m.index + 1
    for (; i < source.length; i++) {
      const c = source[i]
      if (c === '{') {
        depth++
      } else if (c === '}') {
        depth--
      } else if (c === '>' && depth === 0) {
        break
      }
    }
    found.push(source.slice(m.index, i + 1))
  }
  return found
}

// Resolve '@/x' and relative imports to files, one level deep.
function localImports(file, source) {
  const out = []
  for (const [, spec] of source.matchAll(/from '((?:@\/|\.)[^']+)'/g)) {
    const base = spec.startsWith('@/') ? path.join(SRC, spec.slice(2)) : path.resolve(path.dirname(file), spec)
    for (const ext of ['.tsx', '.ts', '/index.tsx', '/index.ts']) {
      if (fs.existsSync(base + ext)) {
        out.push(base + ext)
        break
      }
    }
  }
  return out
}

const allSource = walk(SRC).map(f => [f, fs.readFileSync(f, 'utf8')])
const pages = allSource.filter(([f]) => path.basename(f) === 'page.tsx' && f.startsWith(APP + path.sep) && !f.includes(`${path.sep}api${path.sep}`))

for (const [file, src] of pages) {
  const route = routeOf(file)
  const dynamic = route.includes('[')

  // 1. Metadata: title, description, canonical, Open Graph.
  if (!/export const metadata\b|export async function generateMetadata\b/.test(src)) {
    fail(file, 'no `export const metadata` or `generateMetadata`')
    continue
  }
  if (route !== '/' && !/^\s*title:/m.test(src)) {
    fail(file, 'metadata has no `title`')
  }
  if (!/^\s*description:/m.test(src)) {
    fail(file, 'metadata has no `description`')
  }
  if (!/openGraph:\s*\{/.test(src)) {
    fail(file, 'metadata has no `openGraph` (it replaces the layout one, so give it url, title, description, images)')
  }
  const canon = src.match(/canonical:\s*['`]([^'`]+)['`]/)
  if (!canon && !/canonical:\s*url\b/.test(src)) {
    fail(file, 'metadata has no `alternates.canonical`')
  } else if (canon && !dynamic) {
    const value = canon[1].replace(BASE, '') || '/'
    if (value !== route) {
      fail(file, `canonical is '${canon[1]}' but the page is served at '${route}'`)
    }
  }

  // 2. Open Graph images must exist in public/.
  for (const [, img] of src.matchAll(/images:\s*\[\s*(?:\{\s*url:\s*)?'([^']+)'/g)) {
    if (img.startsWith('/') && !fs.existsSync(path.join(PUBLIC, img))) {
      fail(file, `Open Graph image ${img} is not in public/`)
    }
  }

  // 3. Structured data through <PageShell jsonLd={...}>.
  if (!/<PageShell jsonLd=\{(?!null\})/.test(src)) {
    fail(file, 'use <PageShell jsonLd={pageJsonLd(metadata)}> (from @/lib/seo) so the page has structured data')
  }

  // 4. One <h1>, in the page or a component it imports.
  const h1Files = [file, ...localImports(file, src)].filter(f => /<h1\b/.test(fs.readFileSync(f, 'utf8')))
  if (h1Files.length === 0) {
    fail(file, 'no <h1> on the page (search engines use it as the page heading)')
  }

  // 5. Case studies must be linked from somewhere else, or crawlers can't find them.
  const slug = route.match(/^\/projects\/([^/[]+)$/)?.[1]
  if (slug) {
    const linked = allSource.some(([f, s]) => f !== file
      && (s.includes(`'/projects/${slug}'`) || s.includes(`"/projects/${slug}"`) || new RegExp(`slug:\\s*'${slug}'`).test(s)))
    if (!linked) {
      fail(file, `nothing links to /projects/${slug}; add it to PROJECTS or an ARCHIVE row (slug) in src/lib/data.ts`)
    }
  }
}

// 6. Every image has alt text, anywhere in src.
for (const [file, src] of allSource) {
  for (const tag of [...tags(src, 'img'), ...tags(src, 'Image')]) {
    if (!/\balt=|\{\.\.\./.test(tag)) {
      fail(file, `image without alt text: ${tag.slice(0, 80).replace(/\s+/g, ' ')}`)
    }
  }
}

if (errors.length > 0) {
  console.error(`SEO check failed (${errors.length}). Fix these, or read "SEO" in AGENTS.md:\n`)
  for (const e of errors) {
    console.error(`  - ${e}`)
  }
  process.exit(1)
}
console.log(`SEO check passed: ${pages.length} pages.`)
