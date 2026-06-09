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
    slug: 'acknowledgement-force',
    name: 'Acknowledgement Force',
    tag: 'identity reinforcement tool · macOS',
    year: '2026',
    status: 'Live · v0.3.0 · force.clupai.com',
    pitch: 'A macOS app that blocks your screen until you read your personal rules, tick a box, and name your one highest-leverage action for the day. Built because most goal failures are identity failures — not laziness. The rule you set last week vanishes in moments of stress. Acknowledgement Force makes forgetting structurally impossible. v0.1 was Tauri + web. v0.2 is a full rewrite in native Swift 6 + SwiftUI: smaller, faster, proper macOS feel. Auto-launches via a user LaunchAgent at configurable cadences (every login, hourly, daily, weekly). Cloud sync now live — sign in to edit your contract, quotes, daily goals, and reflection from the web editor at force.clupai.com; changes land on your Mac on launch. Supabase-backed with RLS, light/dark mode in the web UI. Run fully local with no account, or bring your own Supabase project. No telemetry.',
    pitchShort: 'Blocks your Mac until you read your rules and commit to today. Native Swift 6 + web sync. Open source.',
    stack: {
      Frontend: ['Swift 6', 'SwiftUI', 'Next.js (web editor)'],
      Backend: ['Supabase (optional sync)'],
      Infra: ['macOS LaunchAgent', 'ad-hoc signed .app', 'Vercel'],
    },
    metrics: [
      { k: 'binary size', v: '~3 MB' },
      { k: 'sync', v: 'opt-in' },
      { k: 'platform', v: 'macOS 14+' },
    ],
    cover: '/projects/acknowledgement-force/preview.webp',
    featured: true,
    github: 'https://github.com/clupai8o0/force',
  },
  {
    slug: 'aria',
    name: 'ARIA',
    tag: 'Hierarchical multi-agent home-energy brain · NEM',
    year: '2026',
    status: 'Open source · archived · github.com/clupai8o0/aria',
    pitch: 'Autonomous Residential Intelligence Agent. "Millions of home batteries. One coordinated brain." A hierarchical multi-agent system that runs a home\'s energy autonomously: one orchestrator coordinates five specialists — forecasting, battery scheduling, load shifting, grid-anomaly monitoring, and neighbourhood peer-to-peer trading — each running a ReAct (reason-and-act) loop that explains every decision in plain English. Backtested on the real 13 Feb 2024 AEMO VIC1 price-cap day: a single home charged overnight and discharged into a $16.60/kWh spike to net ~$120 credit (~$61 ahead of an unmanaged solar-only home), and a 12-home neighbourhood traded spare energy directly — cutting peak draw 100% and beating solo operation 94% of the time. The whole engine runs client-side in a Sandbox: drag any slider — solar size, battery, HVAC thermal mass, charge-at-midnight — and all six agents plus the swarm recompute end-to-end with no network. Built as one unified TypeScript app (Next.js + IBM Carbon) over modular microservices: simplicity and robustness over moving parts.',
    pitchShort: 'Six-agent home-energy brain. ReAct reasoning, P2P swarm trading, fully client-side sandbox. ~$120 credit on a real price-spike day.',
    stack: {
      Frontend: ['Next.js', 'React', 'TypeScript', 'IBM Carbon'],
      Backend: ['Next.js API routes', 'Claude / OpenAI (ReAct)', 'Chronos-2 (optional forecasting)'],
      Infra: ['Vercel', 'AEMO prices', 'Google Solar API', 'BOM weather', 'seed-cache fallback'],
    },
    metrics: [
      { k: 'day credit', v: '+$120' },
      { k: 'vs no battery', v: '+$61' },
      { k: 'agents', v: '6' },
    ],
    cover: '/projects/aria/dashboard.webp',
    featured: true,
    github: 'https://github.com/Clupai8o0/aria',
  },
  {
    slug: 'r1gpt',
    name: 'R1GPT',
    tag: 'NEM connection-approval audit engine',
    year: '2026',
    status: 'Open source · github.com/Aarav261/R1gpt',
    pitch: 'Built with Aarav. An AI audit engine for R1 connection-approval submissions in Australia\'s National Electricity Market. You upload a submission package — GPS baseline, FAT report, OEM metadata, optional PSCAD/EMT studies — and get back a structured, clause-by-clause audit against AEMO\'s Power System Model Guidelines v3.0 and NER S5.2. The score is a deterministic readiness index: readiness = clamp(0..95, 95 − Σ severity weights), capped at 95 to reserve headroom for chartered-engineer review — no sigmoid, no fabricated confidence intervals. Six deterministic assessors do the work (impedance/firmware delta · clause evidence matrix · mandatory-artefact checks · firmware DMAT comparison · NSP staleness · EMT/RMS model adequacy), each finding traced back to a specific PSMG section and source document. Outputs severity-ranked findings, predicted AEMO/NSP RFIs, an RFI-cycle risk band, and rectification plans with effort estimates. Stress-tested across 24/24 deterministic cases; ships with two synthetic demo packages — a 400 MW failing solar farm and a 200 MW passing BESS.',
    pitchShort: 'Deterministic clause-by-clause audit of NEM grid-connection packages. Six assessors, traceable findings, 0–95 readiness index. 24/24 cases pass.',
    stack: {
      Frontend: ['Next.js 14 (App Router)', 'TypeScript (strict)', 'Tailwind CSS', 'IBM Plex Mono'],
      Backend: ['OpenAI gpt-4o', 'Zod', 'pdf-parse', 'nanoid'],
      Infra: ['Vercel', 'no database'],
    },
    metrics: [
      { k: 'assessors', v: '6' },
      { k: 'readiness scale', v: '0–95' },
      { k: 'cases passing', v: '24/24' },
    ],
    cover: '/projects/r1gpt/overview.webp',
    featured: true,
    github: 'https://github.com/Aarav261/R1gpt',
  },
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
    slug: 'allarkive',
    name: 'AllArkive',
    tag: 'Self-hosted offline knowledge ark · local LLM + RAG',
    year: '2026',
    status: 'Open source · v0.2 · github.com/clupai8o0/allarkive',
    pitch: 'Co-founder (with Sham). Self-hostable offline research assistant: Wikipedia, repair manuals, medical wiki, Stack Exchange — all offline, all searchable with a local LLM that cites sources you can click. Presented at BSides Melbourne 2026. Architectural refusal: the FastAPI RAG layer short-circuits the LLM call entirely if retrieval returns nothing — the model cannot hallucinate because it is never invoked. v0.2 rewrote the indexer for batched async embeddings (10–30× faster), int8 vector quantisation (768 B vs 3,072 B per chunk), and offset-only chunk storage (index at 25% of ZIM size vs ~100% in v0.1).',
    pitchShort: 'Offline LLM + RAG. API-layer hallucination refusal. BSides Melbourne 2026.',
    stack: {
      Frontend: ['nginx landing page', 'Open WebUI'],
      Backend: ['FastAPI', 'Ollama', 'sqlite-vec', 'Kiwix', 'nomic-embed-text'],
      Infra: ['Docker Compose', 'Raspberry Pi compatible'],
    },
    metrics: [
      { k: 'hallucination guard', v: 'API layer' },
      { k: 'indexing (laptop)', v: '10–25 min' },
      { k: 'default bundle', v: '~24 GB' },
    ],
    cover: '/projects/allarkive/preview.png',
    featured: true,
    github: 'https://github.com/clupai8o0/allarkive',
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
    cover: '/projects/nmmun/homepage.webp',
    pitch: 'Production-ready conference website and operations toolkit used live by 500+ participants during a Model United Nations event. Built for reliability and fast iteration under real event deadlines.',
    pitchShort: 'Conference platform used live by 500+ participants at a MUN event.',
    stack: {
      Frontend: ['Next.js 14', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Framer Motion', 'Embla Carousel'],
      Infra: ['Vercel'],
    },
    featured: true,
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
  {
    slug: 'lock-in',
    name: 'Lock-In',
    tag: 'Embedded focus tracker · Arduino + Raspberry Pi',
    year: '2026',
    status: 'Open source · SIT210 project · github.com/clupai8o0/lock-in-complete',
    pitch: 'A desk-side focus tracker built over a weekend for SIT210 Embedded Systems. The core insight: every existing focus tool runs on the laptop you\'re trying not to get distracted by. An Arduino Uno watches the desk (PIR, HC-SR04, DHT22, LDR, button); a Raspberry Pi 5 runs a five-state FSM in pure Python (AWAY, IDLE, FOCUS, DEGRADING, BREAK) across 8 asyncio tasks; a Gemini API call every 75 s classifies what the camera sees. MQTT (mosquitto) is the IPC layer between the orchestrator and Flask dashboard; the dashboard pushes state to the browser via Server-Sent Events. All subsystems degrade independently: a dropped camera pauses vision, a disconnected Arduino reconnects every 5 s, a downed MQTT broker falls back to on-disk snapshot files. 51 tests across 4 suites (FSM, vision parser, serial reader, MQTT integration), systemd Type=notify watchdog, boot-on-power.',
    pitchShort: 'Physical focus tracker. Arduino + Pi FSM + Gemini vision + MQTT. 51 tests. Boot-on-power.',
    stack: {
      Frontend: ['Flask + Jinja (dashboard)', 'Server-Sent Events'],
      Backend: ['Python asyncio', 'Gemini API', 'SQLite', 'mosquitto MQTT', 'Arduino C++'],
      Infra: ['Raspberry Pi OS', 'systemd (Type=notify, watchdog)'],
    },
    metrics: [
      { k: 'FSM states', v: '5' },
      { k: 'tests (4 suites)', v: '51' },
      { k: 'parts cost', v: 'AU$70' },
    ],
    cover: '/projects/lock-in/dashboard.webp',
    featured: false,
    github: 'https://github.com/clupai8o0/lock-in-complete',
  },
]

export const ARCHIVE: ArchiveItem[] = [
  { year: '2026', name: 'Farmers Intuition · Hack48', tech: 'FastAPI · Gemini · ElevenLabs', link: 'github', slug: 'farmers-intuition' },
  { year: '2025', name: 'GovChat · RAG platform', tech: 'Python · RAG', link: 'github', slug: 'govchat' },
  { year: '2025', name: 'notes-app · CI/CD showcase', tech: 'Next.js · Express · MongoDB · Docker · Jenkins · AWS · Prometheus', link: 'github', slug: 'notes-app' },
  { year: '2025', name: 'load-balancer', tech: 'Go · Prometheus', link: 'github', slug: 'load-balancer' },
  { year: '2025', name: 'DSEC · event platform', tech: 'Next.js · Supabase', link: 'github' },
  { year: '2026', name: 'Lock-In · embedded focus tracker', tech: 'Arduino C++ · Python asyncio · Gemini API · Flask', link: 'github', slug: 'lock-in' },
]

export const EXPERIENCE: ExperienceItem[] = [
  { when: '2026–', role: 'CTO', org: 'Hoddle Melbourne', detail: 'Sole developer. Full-stack platform: auth, onboarding wizards, weighted matching algorithm, content library, forums, live Q&As, DMs, Realtime notifications. 26K+ lines, 51 routes, 23 tables. Placed 2nd at Study Melbourne Leadership 4Impact.' },
  { when: '2025–', role: 'President', org: 'DSEC · Deakin Software Engineering Club', detail: '190+ members. Tiered sponsorship prospectus ($150–$1,000+). "My First Australian Offer" workshop.' },
  { when: '2026', role: 'Technical Lead', org: 'King Double Glazing (Freelance)', detail: 'Full rebrand + rebuild from The Glass Discounters. Next.js 16, TinaCMS, Neon, Resend. Instant Estimate Tool. Desktop Performance 99 · SEO 100.' },
  { when: '2026–', role: 'Co-founder', org: 'TapCraft Studio', detail: 'Headless Shopify + React Three Fiber. NFC products. Led B2C → B2B migration.' },
  { when: '2025–', role: 'Residential Leader', org: 'DeakinRes', detail: 'Community support for international and domestic student accommodation.' },
  { when: '2026–', role: 'Sessional IT Support', org: 'Deakin Law School', detail: 'Technical support for academics; scope expanded to lecture material preparation.' },
]
