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
  cover?: string
  updating?: boolean
  github?: string
}

export interface ArchiveItem {
  year: string
  name: string
  tech: string
  link: string
  slug?: string
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
    tag: 'AI-native scheduling app',
    year: '2025',
    status: 'Live · v1.0.0 pending · kairos.clupai.com',
    pitch: 'Rewrote a 1,051-line Python/FastAPI prototype into a clean Next.js monorepo. Pure-function scheduler pipeline (7 modules, 14-day lookahead, dependency resolution, task splitting); plugin host with PluginContext abstraction—core has zero LLM imports, all provider calls route through lib/llm/; HTTP plugin runtime with HMAC signing, circuit breaker, and rollback; theme marketplace enforced by a custom ESLint no-raw-colors rule. Five phases shipped solo: scheduling → recurrence → scratchpad plugin host → theme + plugin marketplaces → collections with kanban phases and bulk-schedule.',
    pitchShort: 'AI scheduling. Plugin host. Theme marketplace. 5 phases shipped solo.',
    stack: {
      Frontend: ['Next.js 15', 'TypeScript', 'TanStack Query 5', 'Tailwind v4'],
      Backend: ['Drizzle ORM', 'Neon Postgres', 'Vercel AI SDK', 'Better Auth', 'Google Calendar API'],
      Infra: ['Vercel', 'Vercel Cron'],
    },
    metrics: [
      { k: 'phases shipped', v: '5' },
      { k: 'plugins at launch', v: '10' },
      { k: 'schedule latency', v: '1–3 s' },
    ],
    cover: '/projects/kairos/tasks.webp',
    featured: true,
    updating: true,
  },
  {
    slug: 'hoddle',
    name: 'Hoddle Melbourne',
    tag: 'International student mentorship platform',
    year: '2026',
    status: 'Live · hoddle.org',
    cover: '/projects/hoddle/dashboard.png',
    pitch: 'CTO and sole developer. Built the full platform for a Study Melbourne 4Impact startup (placed 2nd): magic-link auth, 5-step student onboarding wizard, weighted matching algorithm (country_origin +30 / field_overlap +15 / expertise +10) with nightly cron recompute. Tiptap content library, category forums with two-level nesting and anonymous posting, live Q&A sessions with capacity limits, direct messaging with rate limiting, Supabase Realtime notifications. Token-gated mentor invite system with 14-day expiry and full audit trail. 26K+ lines across 51 routes, 23 tables, 17 migrations.',
    pitchShort: 'Full-stack EdTech platform. Weighted matching. Community + content + live sessions. 4Impact 2nd.',
    stack: {
      Frontend: ['Next.js 16', 'TypeScript', 'Tailwind v4'],
      Backend: ['Supabase', 'PostgreSQL', 'RLS'],
      Infra: ['Vercel'],
    },
    metrics: [
      { k: 'verified mentors', v: '10+' },
      { k: 'early-access students', v: '100+' },
      { k: 'linkedin impressions', v: '14,040' },
    ],
    featured: true,
  },
  {
    slug: 'tapcraft',
    name: 'TapCraft Studio',
    tag: 'Headless Shopify · 3D-printed NFC keychains',
    year: '2026',
    status: 'Shipping',
    pitch: 'Co-founder. Built the full headless Shopify + Next.js 16 frontend from scratch. 3D product viewer with real-time colour variant switching via Three.js material updates (no GLB swaps). Led full B2C → B2B migration including catalogue restructure and affiliate tracking via UpPromote.',
    pitchShort: 'Headless Shopify + React Three Fiber. Real-time 3D colour variants.',
    stack: {
      Frontend: ['Next.js 16', 'React Three Fiber', 'Tailwind v4'],
      Backend: ['Shopify Storefront API (GraphQL)'],
      Infra: ['Vercel', 'Cloudflare R2'],
    },
    featured: true,
    updating: true,
  },
  {
    slug: 'king-glazing',
    name: 'King Double Glazing',
    tag: 'Rebrand · conversion funnel · Melbourne',
    year: '2026',
    status: 'Live · kingdoubleglazing.com.au',
    cover: '/projects/kdg/homepage.webp',
    github: 'https://github.com/clupai8o0/kingdoubleglazing',
    pitch: 'Freelance. Full rebrand and rebuild from The Glass Discounters (57 Lighthouse mobile, 13.1s LCP) to King Double Glazing. Next.js 16 + Tailwind v4 + TinaCMS + Neon + Drizzle + Resend. Instant Estimate Tool surfaces price before lead capture — the core conversion differentiator. Desktop performance 99 · SEO 100 · Best Practices 100. Full ecosystem handed to client.',
    pitchShort: 'Rebrand + rebuild. Instant Estimate Tool. Performance 99 · SEO 100.',
    stack: { Frontend: ['Next.js 16', 'Tailwind v4', 'TinaCMS'], Backend: ['Neon', 'Drizzle', 'Resend'], Infra: ['Vercel'] },
    metrics: [
      { k: 'desktop performance', v: '99' },
      { k: 'SEO score', v: '100' },
      { k: 'desktop LCP', v: '1.0s' },
    ],
    featured: true,
  },
  {
    slug: 'nmmun',
    name: 'NMMUN',
    tag: 'Conference website · operations toolkit',
    year: '2024',
    status: 'Live · nmmun.vercel.app',
    pitch: 'Production-ready conference website and operations toolkit used live by 500+ participants during a Model United Nations event. Built for reliability and fast iteration under real event deadlines.',
    pitchShort: 'Conference platform used live by 500+ participants at a MUN event.',
    stack: {
      Frontend: ['Next.js', 'TypeScript', 'Tailwind CSS'],
      Infra: ['Vercel'],
    },
    featured: true,
    updating: true,
  },
  {
    slug: 'krishnaveni',
    name: 'Krishnaveni',
    tag: 'School website · freelance client',
    year: '2026',
    status: 'Live · krishnavenischool.co.in',
    cover: '/projects/krishnaveni/homepage.webp',
    pitch: 'Freelance. End-to-end school marketing website for Krishnaveni School, India. Monorepo: Next.js 15 + Sanity v5. 10 public pages driven by a polymorphic section architecture — 13 section types rendered by SectionRenderer with zero routing changes per page. Content baked into the bundle via a custom pipeline (fetch-sanity.mjs → generate-data.mjs → lib/data/index.ts) so the site runs without a live CMS connection at runtime. GSAP scroll animations, bento grid gallery, video testimonial lightbox, keyboard-navigable media lightbox. Delivered with a full handover doc.',
    pitchShort: 'Full school website + Sanity v5 CMS. Section-driven architecture. Delivered with handover doc.',
    stack: {
      Frontend: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind v4', 'GSAP', 'Radix UI'],
      Backend: ['Sanity v5'],
      Infra: ['Vercel', 'Sanity CDN'],
    },
    metrics: [
      { k: 'SEO score', v: '92' },
      { k: 'Best Practices', v: '100' },
      { k: 'CLS', v: '0' },
    ],
    featured: true,
  },
]

export const ARCHIVE: ArchiveItem[] = [
  { year: '2026', name: 'Farmers Intuition · Hack48', tech: 'FastAPI · Gemini · ElevenLabs', link: 'github', slug: 'farmers-intuition' },
  { year: '2025', name: 'GovChat · RAG platform', tech: 'Python · RAG', link: 'github', slug: 'govchat' },
  { year: '2025', name: 'notes-app · CI/CD showcase', tech: 'Next.js · Express · MongoDB · Docker · Jenkins · AWS · Prometheus', link: 'github', slug: 'notes-app' },
  { year: '2025', name: 'load-balancer', tech: 'Go · Prometheus', link: 'github', slug: 'load-balancer' },
  { year: '2025', name: 'DSEC · event platform', tech: 'Next.js · Supabase', link: 'github' },
]

export const EXPERIENCE: ExperienceItem[] = [
  { when: '2026–', role: 'CTO', org: 'Hoddle Melbourne', detail: 'Sole developer. Full-stack platform: auth, onboarding wizards, weighted matching algorithm, content library, forums, live Q&As, DMs, Realtime notifications. 26K+ lines, 51 routes, 23 tables. Placed 2nd at Study Melbourne Leadership 4Impact.' },
  { when: '2025–', role: 'President', org: 'DSEC · Deakin Software Engineering Club', detail: '190+ members. Tiered sponsorship prospectus ($150–$1,000+). "My First Australian Offer" workshop.' },
  { when: '2026', role: 'Technical Lead', org: 'King Double Glazing (Freelance)', detail: 'Full rebrand + rebuild from The Glass Discounters. Next.js 16, TinaCMS, Neon, Resend. Instant Estimate Tool. Desktop Performance 99 · SEO 100.' },
  { when: '2026–', role: 'Co-founder', org: 'TapCraft Studio', detail: 'Headless Shopify + React Three Fiber. NFC products. Led B2C → B2B migration.' },
  { when: '2025–', role: 'Residential Leader', org: 'DeakinRes', detail: 'Community support for international and domestic student accommodation.' },
  { when: '2026–', role: 'Sessional IT Support', org: 'Deakin Law School', detail: 'Technical support for academics; scope expanded to lecture material preparation.' },
]
