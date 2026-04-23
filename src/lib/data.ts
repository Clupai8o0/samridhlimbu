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
    status: 'Live · Next.js monorepo',
    pitch: 'Rewrote a 1,051-line Python/FastAPI prototype into a clean Next.js monorepo. Pure-function scheduler pipeline across 7 modules; plugin system with Zod-validated I/O contract; theme + plugin marketplaces shipped in Phase 4.',
    pitchShort: 'AI-native scheduling. Pure-function pipeline, plugin marketplace.',
    stack: {
      Frontend: ['Next.js 16', 'TypeScript', 'TanStack Query 5'],
      Backend: ['Drizzle ORM', 'PostgreSQL', 'Vercel AI SDK'],
      Infra: ['Vercel', 'Better Auth'],
    },
    metrics: [
      { k: 'scheduler modules', v: '7' },
      { k: 'phases shipped', v: '4' },
      { k: 'infra cost', v: '~$1/mo' },
    ],
    featured: true,
  },
  {
    slug: 'hoddle',
    name: 'Hoddle Melbourne',
    tag: 'International student mentorship platform',
    year: '2026',
    status: 'Live · hoddle.org',
    pitch: 'CTO, sole developer. Built auth, 5-step onboarding wizard, and a weighted matching algorithm (country_match +30 / field_match +15 / expertise_match +10) with nightly recompute. Mentor invite system uses a token table with email validation, 14-day expiry, and full audit trail.',
    pitchShort: 'Mentorship matching. Weighted algorithm. Next.js 15 + Supabase.',
    stack: {
      Frontend: ['Next.js 15', 'TypeScript', 'Tailwind v4'],
      Backend: ['Supabase', 'PostgreSQL', 'RLS'],
      Infra: ['Vercel'],
    },
    metrics: [
      { k: 'mentors onboarded', v: '5' },
      { k: 'match signals', v: '3' },
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
  },
  {
    slug: 'king-glazing',
    name: 'King Double Glazing',
    tag: 'Freelance technical lead · Melbourne',
    year: '2026',
    status: 'Live',
    pitch: 'Freelance. Evaluated and rejected WordPress before building Next.js 15 + Tailwind v4 + Neon + Drizzle + Resend from scratch. Instant Estimate Tool surfaces price before requesting contact details. Full SEO strategy across five verticals with suburb page template and LLM/GEO optimisation.',
    pitchShort: 'Next.js 15 rebuild + Instant Estimate Tool + SEO strategy.',
    stack: { Frontend: ['Next.js 15', 'Tailwind v4'], Backend: ['Neon', 'Drizzle', 'Resend'], Infra: ['Vercel', 'Cloudflare'] },
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
  },
  {
    slug: 'krishnaveni',
    name: 'Krishnaveni',
    tag: 'Headless CMS · freelance client',
    year: '2025',
    status: 'Live',
    pitch: 'Freelance. Headless CMS built with Sanity Studio for a real client — enables non-technical staff to independently update pages, announcements, and media without developer involvement. Schema-first content modelling.',
    pitchShort: 'Sanity CMS for a real client. Non-technical staff self-serve content.',
    stack: {
      Frontend: ['Sanity Studio', 'TypeScript'],
      Infra: ['Vercel', 'Sanity CDN'],
    },
    featured: true,
  },
]

export const ARCHIVE: ArchiveItem[] = [
  { year: '2026', name: 'Farmers Intuition · Hack48', tech: 'FastAPI · Gemini · ElevenLabs', link: 'github', slug: 'farmers-intuition' },
  { year: '2025', name: 'GovChat · RAG platform', tech: 'Python · RAG', link: 'github', slug: 'govchat' },
  { year: '2025', name: 'notes-app · CI/CD showcase', tech: 'Next.js · MongoDB · Docker · Jenkins · AWS · Prometheus', link: 'github', slug: 'notes-app' },
  { year: '2025', name: 'load-balancer', tech: 'Go · Prometheus', link: 'github', slug: 'load-balancer' },
  { year: '2025', name: 'DSEC · event platform', tech: 'Next.js · Supabase', link: 'github' },
]

export const EXPERIENCE: ExperienceItem[] = [
  { when: '2026–', role: 'CTO', org: 'Hoddle Melbourne', detail: 'Sole developer. Weighted mentorship matching, token invite system, 5 mentors onboarded.' },
  { when: '2025–', role: 'President', org: 'DSEC · Deakin Software Engineering Club', detail: '190+ members. Tiered sponsorship prospectus ($150–$1,000+). "My First Australian Offer" workshop.' },
  { when: '2026–', role: 'Technical Lead & SEO Consultant', org: 'King Double Glazing (Freelance)', detail: 'Next.js 15 rebuild. Instant Estimate Tool. SEO strategy across five verticals.' },
  { when: '2026–', role: 'Co-founder', org: 'TapCraft Studio', detail: 'Headless Shopify + React Three Fiber. NFC products. Led B2C → B2B migration.' },
  { when: '2025–', role: 'Residential Leader', org: 'DeakinRes', detail: 'Community support for international and domestic student accommodation.' },
  { when: '2026–', role: 'Sessional IT Support', org: 'Deakin Law School', detail: 'Technical support for academics; scope expanded to lecture material preparation.' },
]
