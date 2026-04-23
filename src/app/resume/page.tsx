import { PageShell } from '@/components/page-shell'
import { DownloadPdfButton } from '@/components/download-pdf-button'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'

const SECTIONS = [
  {
    label: 'Experience',
    rows: [
      {
        head: 'CTO · Hoddle Melbourne',
        meta: 'Mar 2026–present',
        body: 'Sole developer. Shipped auth, 5-step onboarding wizard, weighted matching algorithm (country +30 / field +15 / expertise +10) with nightly recompute, and token-based mentor invite system with 14-day expiry and full audit trail.',
      },
      {
        head: 'President · DSEC · Deakin Software Engineering Club',
        meta: 'Jun 2025–present',
        body: '190+ member club. Built tiered sponsorship prospectus ($150 Bronze → $1,000+ Platinum); initiated outreach to VicRoads, Zuum, AustralianSuper. Delivered "My First Australian Offer" workshop (30–80 attendees). Co-ran ACUCyS × DSEC Hackathon.',
      },
      {
        head: 'Technical Lead & SEO Consultant · King Double Glazing (Freelance)',
        meta: 'Mar 2026–present',
        body: 'Evaluated and rejected WordPress before building Next.js 15 + Tailwind v4 + Neon + Drizzle + Resend from scratch. Instant Estimate Tool surfaces price before requesting contact. Full SEO strategy: five keyword verticals, suburb page template, LLM/GEO schema optimisation.',
      },
      {
        head: 'Co-founder · TapCraft Studio',
        meta: 'Feb 2026–present',
        body: 'Built full headless Shopify + Next.js 16 frontend. 3D product viewer with real-time colour variant switching (no GLB swaps). Solved headless affiliate tracking via Web Pixel + cart context events. Led B2C → B2B site migration.',
      },
      {
        head: 'Residential Leader · DeakinRes',
        meta: 'Oct 2025–present',
        body: 'Residential support and community facilitation for international and domestic student accommodation.',
      },
      {
        head: 'Sessional IT Support · Deakin Law School',
        meta: 'Mar 2026–present',
        body: 'Technical support for Law School academics; scope expanded to lecture material preparation.',
      },
    ],
  },
  {
    label: 'Education',
    rows: [
      {
        head: 'Deakin University · B. Computer Science (IoT Major)',
        meta: 'Jun 2024–Jun 2027 (expected) · WAM ~87',
        body: "Vice-Chancellor's International Scholarship (100% tuition). Relevant: SIT221 Data Structures & Algorithms · SIT331 Secure Backend · SIT215 Computational Intelligence · SIT210 Embedded Systems.",
      },
    ],
  },
  {
    label: 'Selected projects',
    rows: [
      {
        head: 'Kairos · AI-native scheduling app',
        meta: 'Next.js 16 · Drizzle · PostgreSQL · Vercel AI SDK',
        body: 'Rewrote a 1,051-line Python/FastAPI prototype into a Next.js monorepo. Pure-function scheduler pipeline across 7 modules; plugin system with Zod-validated I/O; theme + plugin marketplaces. ~$1/mo infra cost.',
      },
      {
        head: 'Hoddle Melbourne · mentorship platform',
        meta: 'Next.js 15 · Supabase · RLS · Tailwind v4',
        body: 'Weighted matching algorithm, token-based invite system, 5-step onboarding. 5 mentors onboarded. Full CLAUDE.md + architecture docs for agent-driven dev workflow.',
      },
      {
        head: 'TapCraft Studio · headless commerce',
        meta: 'Next.js 16 · React Three Fiber · Shopify GraphQL',
        body: 'Real-time 3D colour variant switching. Headless affiliate tracking (UpPromote + Web Pixel). Led B2C → B2B migration — catalogue restructure, redirect mapping, 3D customiser repositioned as bulk-quote tool.',
      },
      {
        head: 'NMMUN · conference website + operations toolkit',
        meta: 'Next.js · TypeScript · Tailwind CSS · Vercel',
        body: 'Production-ready conference website used live by 500+ participants at a Model United Nations event. Built for reliability and fast iteration under real event deadlines.',
      },
      {
        head: 'Krishnaveni · headless CMS (freelance)',
        meta: 'Sanity Studio · TypeScript · Vercel',
        body: 'Headless CMS for a real client — enables non-technical staff to independently update pages, announcements, and media without developer involvement.',
      },
      {
        head: 'notes-app · CI/CD showcase',
        meta: 'Next.js · MongoDB · Docker · Jenkins · AWS · Prometheus · Grafana',
        body: 'Production-grade full-stack app with complete CI/CD pipeline, containerisation, cloud deployment on AWS, and monitoring via Prometheus + Grafana.',
      },
      {
        head: 'load-balancer · systems engineering',
        meta: 'Go · Prometheus',
        body: 'Adaptive concurrent HTTP load balancer in Go — fault tolerance, feedback control, and observability under real-world traffic patterns.',
      },
      {
        head: 'Farmers Intuition · Hack48 (Mar 2026)',
        meta: 'FastAPI · Google Gemini · ElevenLabs',
        body: 'AI precision irrigation advisory platform built in 48 hours. Two-layer ML engine + voice assistant ("Sage") for natural-language farm advisory.',
      },
      {
        head: 'GovChat · RAG platform (2025)',
        meta: 'Python · RAG',
        body: 'Retrieval-Augmented Generation platform for natural-language querying of government information.',
      },
    ],
  },
  {
    label: 'Skills',
    rows: [
      {
        head: 'Languages',
        meta: '',
        body: 'TypeScript · Python · JavaScript · SQL · C#',
      },
      {
        head: 'Frameworks & libraries',
        meta: '',
        body: 'Next.js · React · FastAPI · Tailwind CSS · Drizzle ORM · React Three Fiber · TanStack Query · SQLAlchemy',
      },
      {
        head: 'Databases & infra',
        meta: '',
        body: 'PostgreSQL · Supabase · Neon · Vercel · Cloudflare · Docker · n8n',
      },
      {
        head: 'APIs & integrations',
        meta: '',
        body: 'Shopify Storefront API (GraphQL) · Google Calendar API · Vercel AI SDK · Supabase Auth/RLS · Resend · ElevenLabs',
      },
    ],
  },
]

export default function ResumePage() {
  return (
    <PageShell>
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '36px 28px' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', paddingBottom: 16, borderBottom: '1px solid var(--accent)', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontFamily: DISPLAY, fontWeight: 700, fontSize: 22, margin: '0 0 4px', letterSpacing: -0.02, color: 'var(--fg)' }}>Samridh Limbu</h1>
            <div style={{ fontFamily: SANS, fontSize: 12.5, color: 'var(--muted)' }}>Software Engineer · Melbourne</div>
            <div style={{ fontFamily: MONO, fontSize: 10, color: 'var(--muted-2)', marginTop: 4 }}>samridh@samridhlimbu.com · samridhlimbu.com</div>
          </div>
          <DownloadPdfButton />
        </div>

        {/* Summary */}
        <p style={{ fontFamily: SANS, fontSize: 13, color: 'var(--fg-dim)', lineHeight: 1.65, marginBottom: 24 }}>
          Penultimate-year CS (IoT) at Deakin (graduating Jun 2027). Building production-grade full-stack applications across scheduling, edtech, and e-commerce as both sole developer and technical co-founder. Strong in Next.js/TypeScript/Postgres. Available for SWE internships Nov 2026–Feb 2027 and grad roles from mid-2027.
        </p>

        {/* Sections */}
        {SECTIONS.map(sec => (
          <div key={sec.label} style={{ marginBottom: 24 }}>
            <div className="section-label" style={{ fontFamily: MONO }}>{sec.label}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {sec.rows.map((r, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 12 }}>
                    <div style={{ fontFamily: DISPLAY, fontWeight: 600, fontSize: 12.5, color: 'var(--fg)' }}>{r.head}</div>
                    <div style={{ fontFamily: MONO, fontSize: 9.5, color: 'var(--muted-2)', whiteSpace: 'nowrap' }}>{r.meta}</div>
                  </div>
                  <div style={{ fontFamily: SANS, fontSize: 11.5, color: 'var(--muted)', marginTop: 4, lineHeight: 1.55 }}>{r.body}</div>
                </div>
              ))}
            </div>
          </div>
        ))}

        {/* Footer hint — hidden in PDF */}
        <div className="no-print" style={{ marginTop: 20, fontSize: 10, color: 'var(--muted-2)', fontFamily: MONO }}>
          <span style={{ color: 'var(--accent)' }}>❯</span> end of file · press <kbd>q</kbd> to quit
        </div>

      </div>
    </PageShell>
  )
}
