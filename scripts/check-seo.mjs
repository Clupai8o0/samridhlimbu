// SEO gate. Runs before every build (npm "prebuild"), so Vercel refuses to
// deploy a page that search engines can't read well. Run it alone with
// `npm run check:seo`. The rules are listed in AGENTS.md under "SEO".
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
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

// The `{ ... }` object starting at the first `{` at or after `from`.
function objectAt(source, from) {
  const start = source.indexOf('{', from)
  let depth = 0
  for (let i = start; i < source.length; i++) {
    if (source[i] === '{') {
      depth++
    } else if (source[i] === '}' && --depth === 0) {
      return source.slice(start, i + 1)
    }
  }
  return ''
}

// The keys of an object literal at its own level, ignoring nested objects and arrays.
function topKeys(object) {
  const keys = new Set()
  let depth = 0
  for (let i = 0; i < object.length; i++) {
    const c = object[i]
    if ('{[('.includes(c)) {
      depth++
    } else if ('}])'.includes(c)) {
      depth--
    } else if (depth === 1) {
      const m = object.slice(i).match(/^([A-Za-z]\w*)\s*(:|,|\n|\})/)
      if (m && /[{,\s]/.test(object[i - 1])) {
        keys.add(m[1])
        i += m[1].length - 1
      }
    }
  }
  return keys
}

// The page's metadata object: `export const metadata = {...}` or what generateMetadata returns.
function metadataObject(source) {
  const fixed = source.search(/export const metadata\b[^=]*=\s*\{/)
  if (fixed >= 0) {
    return objectAt(source, fixed)
  }
  const fn = source.search(/export async function generateMetadata\b/)
  const ret = fn >= 0 ? source.slice(fn).search(/return \{\s*\n/) : -1
  return ret >= 0 ? objectAt(source, fn + ret) : ''
}

// The value object of a top-level `key: {` in an object literal, or ''.
function child(object, key) {
  const indent = object.match(/^\{\n([ \t]+)/)?.[1] ?? '  '
  const m = object.match(new RegExp(`\\n${indent}${key}:\\s*\\{`))
  return m ? objectAt(object, m.index) : ''
}

const allSource = walk(SRC).map(f => [f, fs.readFileSync(f, 'utf8')])
const pages = allSource.filter(([f]) => path.basename(f) === 'page.tsx' && f.startsWith(APP + path.sep) && !f.includes(`${path.sep}api${path.sep}`))

for (const [file, src] of pages) {
  const route = routeOf(file)
  const dynamic = route.includes('[')

  // 1. Metadata: title, description, canonical, Open Graph.
  const meta = metadataObject(src)
  if (!meta) {
    fail(file, 'no `export const metadata` or `generateMetadata`')
    continue
  }
  const keys = topKeys(meta)
  if (route !== '/' && !keys.has('title')) {
    fail(file, 'metadata has no `title`')
  }
  if (!keys.has('description')) {
    fail(file, 'metadata has no `description`')
  }
  const og = child(meta, 'openGraph')
  const ogKeys = topKeys(og)
  const missing = ['url', 'title', 'description', 'images'].filter(k => !ogKeys.has(k))
  if (!og) {
    fail(file, 'metadata has no `openGraph` (it replaces the layout one, so give it url, title, description, images)')
  } else if (missing.length > 0) {
    fail(file, `openGraph is missing ${missing.join(', ')} (it replaces the layout one, so nothing is inherited)`)
  }
  const twitter = child(meta, 'twitter')
  if (twitter && !topKeys(twitter).has('images')) {
    fail(file, 'twitter has no `images` (it replaces the layout one, so nothing is inherited)')
  }
  const canonicalBlock = child(meta, 'alternates') || (meta.match(/alternates:\s*\{[^}]*\}/)?.[0] ?? '')
  const canon = canonicalBlock.match(/canonical:\s*['`]([^'`]+)['`]/)
  if (!canon && !/canonical:\s*url\b/.test(canonicalBlock)) {
    fail(file, 'metadata has no `alternates.canonical`')
  } else if (canon && !dynamic) {
    const value = canon[1].replace(BASE, '') || '/'
    if (value !== route) {
      fail(file, `canonical is '${canon[1]}' but the page is served at '${route}'`)
    }
  }

  // 2. Every image path written in the page (OG images, screenshots) must exist in public/.
  for (const [, img] of src.matchAll(/['`"](\/[^'`"\s{}]+\.(?:webp|png|jpe?g|gif|svg|avif))['`"]/g)) {
    if (!fs.existsSync(path.join(PUBLIC, img))) {
      fail(file, `image ${img} is not in public/`)
    }
  }

  // 3. Structured data through <PageShell jsonLd={...}>.
  if (!/<PageShell\s+jsonLd=\{(?!\s*null\s*\})/.test(src)) {
    fail(file, 'use <PageShell jsonLd={pageJsonLd(metadata)}> (from @/lib/seo) so the page has structured data')
  }

  // 4. Exactly one <h1>, counted in the page and the .tsx components it imports.
  const h1s = [file, ...localImports(file, src)].filter(f => f.endsWith('.tsx'))
    .reduce((n, f) => n + (fs.readFileSync(f, 'utf8').match(/<h1\b/g) ?? []).length, 0)
  if (h1s !== 1) {
    fail(file, `${h1s} <h1> tags in the page and its components; a page needs exactly one (search engines read it as the heading)`)
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
