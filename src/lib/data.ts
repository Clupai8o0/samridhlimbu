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
  /** 1, 2, 3 = shown on the home page in that order. */
  homeOrder?: number
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
  /** Related case study path, or an external URL. */
  href?: string
}

export const PROJECTS: Project[] = [
  {
    slug: 'hoddle',
    name: 'Hoddle Melbourne',
    tag: 'International student mentorship platform',
    year: '2026',
    status: 'Live · April build · rebuild ready',
    cover: '/projects/hoddle/home.webp',
    pitch: 'CTO and sole developer of a mentorship platform for first-year international students in Melbourne, built for a Study Melbourne 4Impact startup that placed 2nd. Students are matched with verified mentors on where they come from, what they study and what they need help with, then read the library, ask in the forums (anonymously if they like), join live Q&As and message mentors. Access rules, rate limits and private meeting links are enforced in Postgres. hoddle.org runs the April 2026 build; the October 2026 rebuild redoes every page and adds 27 database migrations, and is not deployed yet.',
    pitchShort: 'Mentorship platform for international students, built solo. Mentor matching, forums, live Q&As. 4Impact 2nd.',
    stack: {
      Frontend: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind v4', 'React Hook Form', 'Zod'],
      Backend: ['Supabase', 'PostgreSQL', 'RLS', 'Realtime', 'Storage', 'Nodemailer'],
      Infra: ['Vercel', 'Vercel Cron'],
    },
    metrics: [
      { k: 'lines of typescript', v: '37K+' },
      { k: 'postgres tables', v: '25' },
      { k: 'sql test checks', v: '124' },
    ],
    featured: true,
    homeOrder: 1,
  },
  {
    slug: 'kairos',
    name: 'Kairos',
    tag: 'Personal planner that learns how long tasks take',
    year: '2026',
    status: 'Prototype · Oct 2026 rebuild · not deployed yet',
    pitch: 'A personal planner that books tasks, goal sessions and habits into the next 14 days around fixed calendar events. When a block of half an hour or more ends, it asks how it went, and after a few check-ins it proposes planning a kind of task longer or shorter; nothing changes until I accept. Rule-based code does the planning; the AI suggests durations, drafts goals, and in chat can add tasks or make same-day moves. Every model call goes through one module. The October 2026 rebuild runs locally; kairos.clupai.com still serves the April–May 2026 build.',
    pitchShort: 'A 14-day planner with check-ins that learn how long tasks really take. Bigger changes wait for my OK.',
    stack: {
      Frontend: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind v4', 'FullCalendar'],
      Backend: ['Drizzle ORM', 'PostgreSQL', 'Better Auth', 'Vercel AI SDK', 'OpenRouter', 'Google Calendar API'],
      Infra: ['PGlite locally', 'Vercel + Neon planned'],
    },
    metrics: [
      { k: 'planning window', v: '14 days' },
      { k: 'test cases', v: '306' },
      { k: 'API route files', v: '45' },
    ],
    cover: '/projects/kairos/today.webp',
    featured: true,
    homeOrder: 2,
  },
  {
    slug: 'aria',
    name: 'ARIA',
    tag: 'Home battery and street energy simulator · hackathon',
    year: '2026',
    status: 'Hackathon prototype · Jun 2026 · not deployed',
    pitch: 'Built in a team of six at Watt The Hack 2026. Six rule-based agents run one home\'s battery against AEMO\'s real Victorian prices for 13 Feb 2024, the day the market hit its price cap, and twelve homes trade spare power with each other in a double auction. The simulated home ends the day $120 in credit, $61 ahead of the same roof with no battery, and the street saves $90 against every home acting alone.',
    pitchShort: 'Rule-based agents run a home battery and a street of 12 homes on a real AEMO price-cap day. +$120 for one home, $90 for the street.',
    stack: {
      Frontend: ['Next.js 15', 'React 19', 'TypeScript', 'IBM Carbon-style CSS'],
      Backend: ['Next.js API routes', 'double-auction market', 'thermal model', 'optional Anthropic/OpenAI wording'],
      Infra: ['recorded AEMO VIC1 day', 'Vitest'],
    },
    metrics: [
      { k: 'one home, cap day', v: '+$120' },
      { k: 'street vs solo', v: '$90' },
      { k: 'unit tests', v: '32' },
    ],
    cover: '/projects/aria/sandbox.webp',
    featured: true,
    homeOrder: 3,
    github: 'https://github.com/Clupai8o0/aria',
  },
  {
    slug: 'r1gpt',
    name: 'R1GPT',
    tag: 'Grid-connection submission checker · hackathon team build',
    year: '2026',
    status: 'Hackathon team build · Jun 2026 · not deployed',
    pitch: 'Checks the paperwork a new solar farm or battery sends AEMO before it can connect to the grid. Six rule-based checks, each tied to a section of AEMO\'s model guidelines, list what is missing or wrong. The score is plain arithmetic: 95 minus the weight of each finding, never below 0, and capped at 95 because an engineer still has to sign off. GPT-4o only pulls values out of the PDFs. A teammate built the audit core; I built the dashboard, the pass and fail demos, the method write-up and its 27-check stress test, and later accounts and company workspaces on Postgres.',
    pitchShort: 'Checks grid-connection paperwork against AEMO\'s model guidelines. Six rule-based checks, a 0–95 score you can do by hand. I built the dashboard and workspaces.',
    stack: {
      Frontend: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS'],
      Backend: ['NextAuth v5', 'Drizzle', 'Neon Postgres', 'Vercel Blob', 'OpenAI GPT-4o', 'Zod'],
      Infra: ['Vercel'],
    },
    metrics: [
      { k: 'rule-based checks', v: '6' },
      { k: 'readiness scale', v: '0–95' },
      { k: 'stress checks passing', v: '27/27' },
    ],
    cover: '/projects/r1gpt/overview.webp',
    featured: true,
    github: 'https://github.com/Aarav261/R1gpt',
  },
  {
    slug: 'dsec',
    name: 'DSEC platform',
    tag: 'Club platform · Deakin Software Engineering Club',
    year: '2025–26',
    status: 'Live · dsec.club',
    pitch: 'President of the Deakin Software Engineering Club (190+ members) and lead developer of its platform: the public site, a committee hub and a member portal. The front ends run on Next.js 16 with Auth.js v5, Drizzle and Neon Postgres, over a FastAPI API with about 24 feature routers and an MCP server. A handover security audit produced 212 findings, which I triaged into 121 tickets.',
    pitchShort: 'Public site, committee hub and member portal for a 190+ member club. Next.js 16 on a FastAPI API with an MCP server.',
    stack: {
      Frontend: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind v4', 'Auth.js v5'],
      Backend: ['FastAPI', 'SQLAlchemy', 'Alembic', 'Drizzle ORM', 'Neon Postgres', 'MCP server'],
      Infra: ['Vercel'],
    },
    metrics: [
      { k: 'club members', v: '190+' },
      { k: 'API routers', v: '~24' },
      { k: 'audit findings triaged', v: '212' },
    ],
    cover: '/projects/dsec/desktop.webp',
    featured: true,
    github: 'https://github.com/dsec-hub/dsec',
  },
  {
    slug: 'ontrack',
    name: 'OnTrack',
    tag: 'Theme system, redesign and notifications for Deakin\'s OnTrack · capstone',
    year: '2026',
    status: 'Capstone · Jul–Oct 2026 · in the team fork, upstream PRs open',
    pitch: 'My Deakin capstone (SIT374, Thoth Tech). OnTrack is the open-source system Deakin units use to track student tasks and feedback. I built its light, dark and system theme system: a written contract, colour tokens now used in 166 files, the theme applied before first paint and saved on the account, and a test that holds every status and chart colour to WCAG contrast in both themes. I relanded the redesign of the student and staff pages after it closed unmerged, through 144 conflicting files. I was one of three leads and led the notifications stream (21 of 42 students): in-app bell, notifications page, email and web push for about 15 events. I also fixed security and correctness bugs from a product audit, merged 103 pull requests across the team\'s repos, made the most web commits in the cohort (464), and cut the trimester into 24 upstream pull requests. Those are open and not yet reviewed, so production OnTrack does not run any of it.',
    pitchShort: 'Built the light and dark theme system and redesign of Deakin\'s OnTrack, led its notifications stream, fixed audit bugs. 103 merged PRs; 24 upstream PRs open.',
    stack: {
      Frontend: ['Angular 22', 'Angular Material', 'Tailwind CSS 4', 'Angular service worker', 'Vitest'],
      Backend: ['Rails 8', 'Grape', 'Sidekiq + sidekiq-cron', 'Redis', 'web-push (VAPID)', 'Minitest'],
      Infra: ['Docker Compose', 'Mailpit', 'GitHub Actions'],
    },
    metrics: [
      { k: 'merged pull requests', v: '103' },
      { k: 'web commits, most in the cohort', v: '464' },
      { k: 'upstream PRs opened', v: '24' },
    ],
    cover: '/projects/ontrack/cover.webp',
    featured: true,
    github: 'https://github.com/thoth-tech/doubtfire-web/pulls?q=is%3Apr+author%3AClupai8o0',
  },
  {
    slug: 'tempo',
    name: 'Tempo',
    tag: 'Workout app with an MCP server',
    year: '2026',
    status: 'Live · tempo.clupai.com',
    pitch: 'A workout app where Claude or ChatGPT can read and log your training over an OAuth connection. One FastAPI service (Python 3.13) powers the REST API, an OAuth-protected MCP server and the Next.js client. Every capability lives once in a shared service layer, and the REST routers and MCP tools are thin adapters over the same functions. Live since Aug 2026, with 70 passing API tests at the phase checkpoint.',
    pitchShort: 'Claude or ChatGPT can read and log your workouts. One FastAPI service behind REST, an OAuth MCP server and the web app. 70 API tests.',
    stack: {
      Frontend: ['Next.js 16', 'React 19', 'TypeScript'],
      Backend: ['FastAPI (Python 3.13)', 'SQLAlchemy', 'Neon Postgres', 'Google OAuth', 'MCP server'],
      Infra: ['Vercel', 'Turborepo'],
    },
    metrics: [
      { k: 'API tests passing', v: '70' },
      { k: 'interfaces', v: 'REST + MCP' },
      { k: 'live since', v: 'Aug 2026' },
    ],
    cover: '/projects/tempo/desktop.webp',
    featured: true,
    github: 'https://github.com/Clupai8o0/tempo',
  },
  {
    slug: 'morgue',
    name: 'morgue',
    tag: 'Vault of UI animations for coding agents · founder',
    year: '2026',
    status: 'In development · waitlist open · morgue.clupai.com',
    pitch: 'Founder, Aug 2026 to now. A SaaS in development with its waitlist open: it records repeatable video previews of UI animations, tags them with a fixed vocabulary, keeps the code and exports bundles that coding agents (Claude Code, Cursor, Codex) can build from. The design follows measured browser limits: of 40 WebGL contexts created, 16 survive, so the grid plays video and only one item runs live. Multi-user accounts are deployed ahead of launch.',
    pitchShort: 'Records repeatable video previews of UI animations, keeps the code and exports bundles coding agents can build from. Waitlist open.',
    stack: {
      Frontend: ['Next.js 16', 'React 19', 'TypeScript'],
      Backend: ['Node', 'Playwright', 'ffmpeg', 'Auth.js', 'Drizzle', 'Neon Postgres'],
      Infra: ['Cloudflare R2', 'Vercel'],
    },
    metrics: [
      { k: 'WebGL contexts that survive of 40', v: '16' },
      { k: 'frames identical across two runs', v: '1113/1113' },
      { k: 'started', v: 'Aug 2026' },
    ],
    cover: '/projects/morgue/desktop.webp',
    featured: true,
  },
  {
    slug: 'cstack',
    name: 'cstack',
    tag: 'Shared rules, hooks and skills for coding agents',
    year: '2026',
    status: 'Open source · MIT',
    pitch: 'One set of rules, hooks and skills shared by six coding agents: Claude Code, Codex, OpenCode, DeepSeek, Kimi and Grok Build. Hooks claim each file a session edits so two parallel sessions do not edit one file, queue shared deploys and keep guardrails learned from failures. Model routing is set by benchmark: running subagents at low effort cut the cost per task 2.7x ($0.33 vs $0.90) at the same score.',
    pitchShort: 'One rules, hooks and skills layer for six coding agents. Benchmarked model routing cut cost per task 2.7x at the same score.',
    stack: {
      Frontend: ['Claude Code', 'Codex', 'OpenCode', 'DeepSeek', 'Kimi', 'Grok Build'],
      Backend: ['Python', 'Shell'],
      Infra: ['macOS launchd', 'sandbox-exec'],
    },
    metrics: [
      { k: 'coding agents, one layer', v: '6' },
      { k: 'cheaper per task, same score', v: '2.7×' },
      { k: 'licence', v: 'MIT' },
    ],
    cover: '/projects/cstack/cover.webp',
    featured: true,
    github: 'https://github.com/Clupai8o0/cstack',
  },
  {
    slug: 'king-glazing',
    name: 'King Double Glazing',
    tag: 'Rebrand · conversion funnel · Melbourne',
    year: '2026',
    status: 'Live · kingdoubleglazing.com.au',
    cover: '/projects/kdg/homepage.webp',
    github: 'https://github.com/clupai8o0/kingdoubleglazing',
    pitch: 'Freelance. Full rebrand and rebuild from The Glass Discounters (57 Lighthouse mobile, 13.1s LCP) to King Double Glazing. Next.js 16 + Tailwind v4 + TinaCMS + Neon + Drizzle + Resend. Instant Estimate Tool surfaces price before lead capture, which is the core conversion differentiator. Desktop performance 99 · SEO 100 · Best Practices 100. Full ecosystem handed to client.',
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
    slug: 'allarkive',
    name: 'AllArkive',
    tag: 'Offline research assistant · local model + Kiwix',
    year: '2026',
    status: 'Open source · BSides Melbourne, May 2026',
    pitch: 'Built with Sham for our BSides Melbourne talk in May 2026. A research assistant that runs on your own computer with no internet. Kiwix serves offline copies of Wikipedia, repair guides and Stack Exchange; a local model answers from the five closest passages and is told to cite each one, and the citations become links to the offline article. One script sets up five containers, all bound to localhost. The search index is one SQLite file that stores where each passage sits in the archive, not the text itself.',
    pitchShort: 'Offline Wikipedia, repair guides and Stack Exchange, with a local model that answers from them and links its sources. Built with Sham for BSides Melbourne 2026.',
    stack: {
      Frontend: ['nginx landing page', 'Open WebUI'],
      Backend: ['FastAPI', 'Ollama (qwen2.5)', 'nomic-embed-text', 'sqlite-vec', 'Kiwix'],
      Infra: ['Docker Compose', 'macOS, Linux and Raspberry Pi'],
    },
    metrics: [
      { k: 'default bundle', v: '24 GB' },
      { k: 'containers, localhost only', v: '5' },
      { k: 'passages per answer', v: '5' },
    ],
    cover: '/projects/allarkive/answer.webp',
    featured: true,
    github: 'https://github.com/clupai8o0/allarkive',
  },
  {
    slug: 'acknowledgement-force',
    name: 'Acknowledgement Force',
    tag: 'identity reinforcement tool · macOS',
    year: '2026',
    status: 'Live · v0.3.0 · force.clupai.com',
    pitch: 'A macOS app that blocks your screen until you read your personal rules, tick a box, and name your one highest-leverage action for the day. Built because most goal failures are identity failures, not laziness. The rule you set last week vanishes in moments of stress. Acknowledgement Force makes forgetting structurally impossible. v0.1 was Tauri + web. v0.2 is a full rewrite in native Swift 6 + SwiftUI: smaller, faster, proper macOS feel. Auto-launches via a user LaunchAgent at configurable cadences (every login, hourly, daily, weekly). Cloud sync now live: sign in to edit your contract, quotes, daily goals, and reflection from the web editor at force.clupai.com; changes land on your Mac on launch. Supabase-backed with RLS, light/dark mode in the web UI. Run fully local with no account, or bring your own Supabase project. No telemetry.',
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
    slug: 'krishnaveni',
    name: 'Krishnaveni',
    tag: 'School website · freelance client',
    year: '2026',
    status: 'Live · krishnavenischool.co.in',
    cover: '/projects/krishnaveni/homepage.webp',
    pitch: 'Freelance. End-to-end school marketing website for Krishnaveni School, India. Monorepo: Next.js 15 + Sanity v5. 10 public pages driven by a polymorphic section architecture: 13 section types rendered by SectionRenderer with zero routing changes per page. Content baked into the bundle via a custom pipeline (fetch-sanity.mjs → generate-data.mjs → lib/data/index.ts) so the site runs without a live CMS connection at runtime. GSAP scroll animations, bento grid gallery, video testimonial lightbox, keyboard-navigable media lightbox. Delivered with a full handover doc.',
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
    slug: 'tapcraft',
    name: 'TapCraft Studio',
    tag: 'Headless Shopify · 3D-printed NFC keychains',
    year: '2026',
    status: 'Ended · Feb–Oct 2026',
    pitch: 'Co-founder. Built the full headless Shopify + Next.js 16 frontend from scratch. 3D product viewer with real-time colour variant switching via Three.js material updates (no GLB swaps). Led full B2C → B2B migration including catalogue restructure and affiliate tracking via UpPromote.',
    pitchShort: 'Headless Shopify + React Three Fiber. Real-time 3D colour variants.',
    stack: {
      Frontend: ['Next.js 16', 'React Three Fiber', 'Tailwind v4'],
      Backend: ['Shopify Storefront API (GraphQL)'],
      Infra: ['Vercel', 'Cloudflare R2'],
    },
    cover: '/projects/tapcraft/desktop.webp',
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
  { year: '2026', name: 'Lock-In · embedded focus tracker', tech: 'Arduino C++ · Python asyncio · Gemini API · Flask', link: 'github', slug: 'lock-in' },
  { year: '2025', name: 'GovChat · GovHack 2025 winner', tech: 'FastAPI · ChromaDB · Next.js', link: 'github', slug: 'govchat' },
  { year: '2025', name: 'notes-app · CI/CD showcase', tech: 'Next.js · MongoDB · Docker · Jenkins · AWS · Prometheus · Grafana', link: 'github', slug: 'notes-app' },
  { year: '2025', name: 'load-balancer', tech: 'Go · Prometheus', link: 'github', slug: 'load-balancer' },
]

export const EXPERIENCE: ExperienceItem[] = [
  {
    when: 'Jul 2026–present',
    role: 'Contract Software Engineer',
    org: 'US health-tech startup (under NDA)',
    detail: 'Cut search latency from seconds to under 200 ms with database indexing and response compression. Frontend integration, new data-source integrations and a production hardening pass. Dozens of production deploys.',
  },
  {
    when: 'Aug 2026–present',
    role: 'Founder',
    org: 'morgue',
    detail: 'Opened the waitlist for a SaaS that records repeatable video previews of UI animations, keeps the code and exports bundles for coding agents. Multi-user accounts are built and deployed ahead of launch.',
    href: '/projects/morgue',
  },
  {
    when: 'Mar 2026–present',
    role: 'CTO',
    org: 'Hoddle Melbourne',
    detail: 'Sole developer of hoddle.org, a mentorship platform for international students: 25K+ lines, 51 routes, 24 Postgres tables. Placed 2nd at Study Melbourne Leadership 4Impact.',
    href: '/projects/hoddle',
  },
  {
    when: 'Jun 2025–present',
    role: 'President',
    org: 'DSEC (Deakin Software Engineering Club)',
    detail: 'Run a 190+ member club across five committees. Lead development of its site, committee hub and member portal on a FastAPI backend.',
    href: '/projects/dsec',
  },
  {
    when: 'Aug–Sep 2026',
    role: 'Software Engineer',
    org: 'MyMor',
    detail: "Took a beta rebuild of a startup's university student app to a release candidate: new design system, clubs, events and deals. Built a Firebase emulator stack with a 442-case security-rules test matrix.",
  },
  {
    when: 'Aug 2026',
    role: 'Open Day Ambassador',
    org: 'Deakin University',
    detail: 'Represented Deakin to prospective students and families at Burwood Open Day.',
  },
  {
    when: 'Mar–Aug 2026',
    role: 'Technical Lead',
    org: 'King Double Glazing (freelance)',
    detail: 'Rebranded The Glass Discounters and rebuilt the site on Next.js 16. Desktop Lighthouse: Performance 99, SEO 100.',
    href: '/projects/king-glazing',
  },
  {
    when: 'Feb–Oct 2026',
    role: 'Co-founder',
    org: 'TapCraft Studio',
    detail: 'Built the headless Shopify + Next.js 16 storefront with a real-time 3D viewer. Led the B2C to B2B migration.',
    href: '/projects/tapcraft',
  },
  {
    when: 'Oct 2025–present',
    role: 'Residential Leader',
    org: 'DeakinRes',
    detail: 'Support residents and build community among international and domestic students in Deakin accommodation.',
  },
]
