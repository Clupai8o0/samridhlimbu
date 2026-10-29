import type { Metadata } from 'next'
import type { Post } from '@/lib/writing'

// Must match metadataBase in src/app/layout.tsx.
export const BASE_URL = 'https://samridhlimbu.com'

const PERSON_ID = `${BASE_URL}/#person`
const WEBSITE_ID = `${BASE_URL}/#website`

// Profiles that are Sam's, so search engines tie them to one person.
const SAME_AS = [
  'https://github.com/clupai8o0',
  'https://linkedin.com/in/samridh-limbu',
  'https://x.com/clupai8o0',
  'https://instagram.com/clupaii',
]

type JsonLd = Record<string, unknown>

export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) {
    return path
  }
  return `${BASE_URL}${path === '/' ? '' : path}`
}

// Site-wide: who the site is about, and the site itself. Rendered in the root layout.
// The contract client is deliberately absent here (NDA).
export function siteJsonLd(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': PERSON_ID,
        name: 'Samridh Limbu',
        url: BASE_URL,
        image: absoluteUrl('/sam.jpeg'),
        email: 'samridh@samridhlimbu.com',
        jobTitle: 'Software Engineer',
        description: 'Software engineer in Melbourne. Final-year computer science at Deakin University, CTO at Hoddle Melbourne and president of DSEC.',
        address: { '@type': 'PostalAddress', addressLocality: 'Melbourne', addressRegion: 'VIC', addressCountry: 'AU' },
        worksFor: { '@type': 'Organization', name: 'Hoddle Melbourne', url: 'https://hoddle.org' },
        memberOf: { '@type': 'Organization', name: 'DSEC (Deakin Software Engineering Club)' },
        alumniOf: { '@type': 'CollegeOrUniversity', name: 'Deakin University', url: 'https://www.deakin.edu.au' },
        award: 'GovHack 2025 winner',
        knowsAbout: ['Software engineering', 'TypeScript', 'React', 'Next.js', 'FastAPI', 'PostgreSQL'],
        sameAs: SAME_AS,
      },
      {
        '@type': 'WebSite',
        '@id': WEBSITE_ID,
        url: BASE_URL,
        name: 'Samridh Limbu',
        inLanguage: 'en-AU',
        publisher: { '@id': PERSON_ID },
      },
    ],
  }
}

const CRUMB_NAMES: Record<string, string> = {
  projects: 'Projects',
  writing: 'Writing',
  about: 'About',
  resume: 'Resume',
}

function breadcrumbs(path: string, pageName: string): JsonLd {
  const parts = path.split('/').filter(Boolean)
  const items = [{ name: 'Home', url: BASE_URL }]
  parts.forEach((part, i) => {
    const isLast = i === parts.length - 1
    items.push({
      name: isLast ? pageName : (CRUMB_NAMES[part] ?? part),
      url: absoluteUrl('/' + parts.slice(0, i + 1).join('/')),
    })
  })
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({ '@type': 'ListItem', position: i + 1, name: item.name, item: item.url })),
  }
}

function text(value: unknown) {
  return typeof value === 'string' ? value : undefined
}

// The page's own title, minus the " · Samridh Limbu" the template adds.
function pageTitle(metadata: Metadata) {
  const t = metadata.title
  if (typeof t === 'string') {
    return t
  }
  if (t && typeof t === 'object' && 'absolute' in t) {
    return t.absolute
  }
  return text(metadata.openGraph?.title) ?? 'Samridh Limbu'
}

function firstImage(metadata: Metadata) {
  const images = metadata.openGraph?.images
  const first = Array.isArray(images) ? images[0] : images
  if (!first) {
    return undefined
  }
  if (typeof first === 'string') {
    return absoluteUrl(first)
  }
  if (first instanceof URL) {
    return first.toString()
  }
  return absoluteUrl(String(first.url))
}

// Built from the page's own `metadata`, so a page only has to pass that in.
// Case studies become CreativeWork; other pages are plain WebPages.
export function pageJsonLd(metadata: Metadata): JsonLd {
  const canonical = metadata.alternates?.canonical
  const raw = canonical instanceof URL ? canonical.pathname : typeof canonical === 'string' ? canonical : '/'
  const path = raw.replace(BASE_URL, '') || '/'
  const url = absoluteUrl(path)
  const name = pageTitle(metadata)
  const description = text(metadata.description)
  const image = firstImage(metadata)
  const isCaseStudy = /^\/projects\/[^/]+$/.test(path)

  const page: JsonLd = {
    '@type': path === '/about' ? 'ProfilePage' : 'WebPage',
    '@id': `${url}#webpage`,
    url,
    name,
    description,
    isPartOf: { '@id': WEBSITE_ID },
    inLanguage: 'en-AU',
    ...(path === '/about' || path === '/' ? { mainEntity: { '@id': PERSON_ID } } : {}),
  }

  const graph: JsonLd[] = [page]
  if (path !== '/') {
    graph.push(breadcrumbs(path, name))
  }
  if (isCaseStudy) {
    page.mainEntity = { '@id': `${url}#work` }
    graph.push({
      '@type': 'CreativeWork',
      '@id': `${url}#work`,
      name: name.split(' · ')[0],
      headline: name,
      description,
      url,
      image,
      author: { '@id': PERSON_ID },
      creator: { '@id': PERSON_ID },
    })
  } else if (image) {
    page.primaryImageOfPage = image
  }

  return { '@context': 'https://schema.org', '@graph': graph }
}

export function postJsonLd(post: Post): JsonLd {
  const url = absoluteUrl(`/writing/${post.slug}`)
  const image = post.content?.find(b => b.type === 'image')
  // Co-written posts list every author; Sam's entry points at the site Person.
  const author = post.authors && post.authors.length > 0
    ? post.authors.map(a => a.name === 'Samridh Limbu' ? { '@id': PERSON_ID } : { '@type': 'Person', name: a.name })
    : { '@id': PERSON_ID }
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        '@id': `${url}#article`,
        headline: post.title,
        description: post.excerpt,
        url,
        mainEntityOfPage: url,
        datePublished: post.date,
        dateModified: post.updated ?? post.date,
        keywords: post.tags.join(', '),
        image: image?.type === 'image' ? absoluteUrl(image.src) : absoluteUrl('/og.png'),
        author,
        publisher: { '@id': PERSON_ID },
        isPartOf: { '@id': WEBSITE_ID },
        inLanguage: 'en-AU',
      },
      breadcrumbs(`/writing/${post.slug}`, post.title),
    ],
  }
}
