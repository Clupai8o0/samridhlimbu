export interface Project {
  slug: string
  name: string
  tag: string
  year: string
  status: string
  pitch: string
  pitchShort: string
  stack: { Frontend: string[]; Backend?: string[]; Infra?: string[] }
  metrics?: { k: string; v: string }[]
  featured: boolean
}

export interface ArchiveItem {
  year: string
  name: string
  tech: string
  link: string
}

export interface ExperienceItem {
  when: string
  role: string
  org: string
  detail: string
}

export const PROJECTS: Project[] = [
  {
    slug: 'kairos',
    name: 'Kairos',
    tag: 'AI-native scheduling API',
    year: '2026',
    status: 'In rewrite → Next.js 16',
    pitch: 'Scheduling that reads intent. Python/FastAPI backend, state-machine core, rewriting the frontend from scratch.',
    pitchShort: 'AI-native scheduling. State machine over cron.',
    stack: {
      Frontend: ['Next.js 16', 'React', 'TypeScript'],
      Backend: ['Python', 'FastAPI', 'Postgres'],
      Infra: ['Fly.io', 'Redis', 'GH Actions'],
    },
    metrics: [
      { k: 'p95 latency', v: '38ms' },
      { k: 'scheduled ops', v: '12.4k/day' },
      { k: 'test coverage', v: '84%' },
      { k: 'uptime (90d)', v: '99.96%' },
    ],
    featured: true,
  },
  {
    slug: 'tapcraft',
    name: 'TapCraft Studio',
    tag: '3D-printed NFC keychains',
    year: '2025',
    status: 'Shipping',
    pitch: 'Co-founder. Headless Shopify storefront with React Three Fiber, physical products with embedded NFC.',
    pitchShort: 'Headless Shopify + RTF. Products you can hold.',
    stack: {
      Frontend: ['React Three Fiber', 'Remix', 'TS'],
      Backend: ['Shopify Storefront API'],
      Infra: ['Vercel', 'Cloudflare R2'],
    },
    metrics: [
      { k: 'sessions/mo', v: '8.2k' },
      { k: 'CVR', v: '3.1%' },
      { k: 'LCP', v: '1.1s' },
    ],
    featured: true,
  },
  {
    slug: 'hoddle',
    name: 'Hoddle Melbourne',
    tag: 'Mentorship platform',
    year: '2025',
    status: 'Live',
    pitch: 'CTO. Next.js + Supabase mentorship platform matching founders with operators across Melbourne.',
    pitchShort: 'Mentorship matching. Next.js + Supabase.',
    stack: {
      Frontend: ['Next.js 14', 'TS'],
      Backend: ['Supabase', 'Postgres'],
      Infra: ['Vercel'],
    },
    featured: true,
  },
  {
    slug: 'king-glazing',
    name: 'King Double Glazing',
    tag: 'Freelance lead · window installer site',
    year: '2025',
    status: 'Shipped',
    pitch: 'Freelance. Next.js marketing site with lead capture for a Melbourne window installer.',
    pitchShort: 'Lead-gen site for a Melbourne window installer.',
    stack: { Frontend: ['Next.js 15'], Backend: ['Neon', 'Drizzle'], Infra: ['Vercel'] },
    featured: false,
  },
]

export const ARCHIVE: ArchiveItem[] = [
  { year: '2025', name: 'DSEC · event platform', tech: 'Next.js · Supabase', link: 'github' },
  { year: '2024', name: 'Signal · CLI timer', tech: 'Rust', link: 'github' },
  { year: '2024', name: 'Mealmap · macro tracker', tech: 'SwiftUI', link: 'github' },
  { year: '2024', name: 'parseLog', tech: 'Go', link: 'github' },
  { year: '2023', name: 'CiteThat · ref generator', tech: 'Python · Flask', link: 'archived' },
  { year: '2023', name: 'Deakin Law School intranet', tech: 'internal · NDA', link: 'private' },
]

export const EXPERIENCE: ExperienceItem[] = [
  { when: '2025–', role: 'President', org: 'DSEC · Deakin Software Engineering Club', detail: '190+ members. Events, partnerships, sponsorships.' },
  { when: '2024–', role: 'Technical Systems Assistant', org: 'Deakin Law School', detail: 'Systems, diagnostics, AV, faculty support.' },
  { when: '2025–', role: 'Co-founder', org: 'TapCraft Studio', detail: 'Headless Shopify + React Three Fiber. Physical products with NFC.' },
  { when: '2024–', role: 'Freelance lead', org: 'Independent', detail: 'Next.js + Postgres builds for Melbourne operators.' },
]
