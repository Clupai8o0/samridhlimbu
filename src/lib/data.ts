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
    status: 'Live · tempo.clupai.com · pushed build of 7 Aug; planning screens local only',
    pitch: 'A workout app that Claude can read and log to. A FastAPI service runs the REST API and an MCP server behind its own OAuth sign-in, and the Next.js web app sits on top, so the chat and the browser show the same training history. Every capability is written once in a shared Python service layer; the REST routes and the 40 MCP tools are thin wrappers over it, and tests fail if either side drifts. Live at tempo.clupai.com since August 2026, with 353 API tests passing. Planning a workout ahead works through the API and Claude; its web screens are half built and not live yet.',
    pitchShort: 'A workout app Claude can read and log to. A FastAPI service runs REST and an OAuth MCP server behind the web app. 353 API tests.',
    stack: {
      Frontend: ['Next.js 16', 'React 19', 'TypeScript', 'CSS Modules', 'PWA'],
      Backend: ['FastAPI (Python 3.13)', 'SQLAlchemy 2.0', 'Alembic', 'MCP Python SDK', 'Authlib', 'Google sign-in'],
      Infra: ['Neon Postgres', 'Vercel', 'Vercel Blob', 'Turborepo'],
    },
    metrics: [
      { k: 'API tests passing', v: '353' },
      { k: 'MCP tools', v: '40' },
      { k: 'REST endpoints', v: '46' },
    ],
    cover: '/projects/tempo/dashboard.webp',
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
    pitch: 'One set of rules, hooks and skills shared by six coding agents: Claude Code, Codex, OpenCode, DeepSeek, Kimi and Grok Build. Hooks claim each file a session edits so two sessions in one worktree do not edit the same file, queue shared deploys and keep guardrails learned from failures. Running subagents at low effort instead of extra-high cut the cost per task 2.7x ($0.33 vs $0.90) with no meaningful loss in score.',
    pitchShort: 'One rules, hooks and skills layer for six coding agents. Low-effort subagents cut cost per task 2.7x with no meaningful loss in score.',
    stack: {
      Frontend: ['Claude Code', 'Codex', 'OpenCode', 'DeepSeek', 'Kimi', 'Grok Build'],
      Backend: ['Python', 'Shell'],
      Infra: ['macOS launchd', 'sandbox-exec'],
    },
    metrics: [
      { k: 'coding agents, one layer', v: '6' },
      { k: 'cheaper per task, low vs extra-high effort', v: '2.7×' },
      { k: 'licence', v: 'MIT' },
    ],
    cover: '/projects/cstack/cover.webp',
    featured: true,
    github: 'https://github.com/Clupai8o0/cstack',
  },
  {
    slug: 'king-glazing',
    name: 'King Double Glazing',
    tag: 'Price-first quote tool · Melbourne glazier',
    year: '2026',
    status: 'Live · kingdoubleglazing.com.au',
    cover: '/projects/kdg/hero.webp',
    github: 'https://github.com/clupai8o0/kingdoubleglazing',
    pitch: 'Freelance, as technical lead. The website of a Melbourne glazier that fits double-glazed glass into existing frames, built from an empty repository on Next.js 16. Its quote tool shows one price from your window sizes before it asks who you are; the server checks the price again, and the business confirms each quote before the customer is emailed it. The business edits its pages and prices in TinaCMS. Lighthouse on the live site, 27 Oct 2026: 99 desktop, 95 phone, SEO 100.',
    pitchShort: 'Quote tool that shows a real price before asking who you are. Lighthouse 99 desktop, 95 phone.',
    stack: { Frontend: ['Next.js 16', 'React 19', 'Tailwind CSS 4', 'TinaCMS'], Backend: ['zod', 'Neon Postgres', 'Drizzle', 'Resend + React Email'], Infra: ['Vercel', 'pnpm'] },
    metrics: [
      { k: 'desktop performance', v: '99' },
      { k: 'phone performance', v: '95' },
      { k: 'SEO', v: '100' },
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
    year: '2025–2026',
    status: 'Live · krishnavenischool.co.in',
    cover: '/projects/krishnaveni/homepage.webp',
    pitch: 'Freelance website for Krishnaveni School in Hyderabad. The 2025 build had an English, Hindi and Telugu version of every page, edited in a Sanity v3 Studio. The April 2026 rebuild kept English, moved page copy into a generated data file, and left staff a two-type Sanity Studio for posts and facilities.',
    pitchShort: 'School website. Built in three languages on Sanity in 2025, rebuilt in English in 2026.',
    stack: {
      Frontend: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind v4', 'GSAP', 'Motion', 'Radix UI'],
      Backend: ['Sanity v5'],
      Infra: ['Vercel', 'Sanity CDN'],
    },
    metrics: [
      { k: 'languages in 2025', v: '3' },
      { k: 'section types today', v: '13' },
      { k: 'commits', v: '87' },
    ],
    featured: true,
  },
  {
    slug: 'nmmun',
    name: 'NMMUN',
    tag: 'School conference website · handed over',
    year: '2024',
    status: 'Archived · the Nov 2024 build is still live',
    cover: '/projects/nmmun/home-countdown.webp',
    pitch: 'Website for the Model United Nations conference at New Millennium School, Bahrain. Built in 2024 so the next year\'s student IT team could run it by editing content (councils, chairs, dates, itinerary, banner text) without touching the components. They ran the 15-16 November 2024 conference on it, with more than 500 participants by the school\'s count, and 4 of their 105 commits touched a component or hook. The site switches itself between before, during and after the event from two dates. Registration and documents link out to Google Forms and Drive.',
    pitchShort: 'School MUN conference site the next student team ran almost entirely by editing content.',
    stack: {
      Frontend: ['Next.js 14', 'React 18', 'TypeScript', 'Tailwind CSS', 'shadcn/ui', 'Framer Motion', 'Embla Carousel'],
      Infra: ['Vercel'],
    },
    metrics: [
      { k: 'pages', v: '8' },
      { k: 'councils', v: '14' },
      { k: 'next-team commits', v: '105' },
    ],
    featured: true,
  },
  {
    slug: 'tapcraft',
    name: 'TapCraft Studio',
    tag: 'Headless Shopify · 3D-printed NFC keychains',
    year: '2026',
    status: 'Ended · Feb–Oct 2026 · the March build is still live at tapcraft.shop',
    pitch: 'Co-founder. I built the store for our 3D-printed NFC keychains: Next.js 16 on the Shopify Storefront API, with a Shopify cart and checkout and UpPromote affiliate links carried through to checkout. A React Three Fiber configurator from the Claude Code scaffold I started with changes shape, material and colour in place; it was kept behind a redirect and never opened to buyers. A B2B rebuild followed from April to July and was never shipped.',
    pitchShort: 'Headless Shopify store in Next.js 16, with a 3D configurator kept behind a redirect.',
    stack: {
      Frontend: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind v4', 'React Three Fiber', 'drei', 'GSAP'],
      Backend: ['Shopify Storefront API (GraphQL)', 'Shopify Cart API', 'Brevo', 'UpPromote'],
      Infra: ['Vercel'],
    },
    metrics: [
      { k: 'store pages buyers can reach', v: '7' },
      { k: 'B2B rebuild page routes', v: '21' },
      { k: 'lines in the Blender script', v: '510' },
    ],
    cover: '/projects/tapcraft/desktop.webp',
    featured: true,
  },
  {
    slug: 'lock-in',
    name: 'Lock-In',
    tag: 'Embedded focus tracker · Arduino + Raspberry Pi',
    year: '2026',
    status: 'SIT210 project, May 2026 · open source, no hosted demo',
    pitch: 'A desk-side focus tracker for SIT210 Embedded Systems, because focus apps run on the laptop you\'re trying not to get distracted by. An Arduino Uno reads presence, distance, temperature and light once a second. On a Raspberry Pi, 8 asyncio tasks share one five-state machine (AWAY, IDLE, FOCUS, DEGRADING, BREAK), with a Gemini check of a webcam still every 75 s as one input among the sensors. MQTT and Server-Sent Events push state to a Flask dashboard: the median time from a click to the screen updating fell from 2.75 s with file polling to 0.31 s (40 clicks each, on localhost). 51 tests across 4 suites; systemd units with a watchdog start it on boot.',
    pitchShort: 'Arduino + Raspberry Pi focus tracker. Five-state FSM, Gemini vision, MQTT. 51 tests.',
    stack: {
      Frontend: ['Flask + Jinja dashboard', 'Server-Sent Events'],
      Backend: ['Python asyncio', 'Gemini API', 'SQLite', 'mosquitto MQTT', 'Arduino C++'],
      Infra: ['Raspberry Pi', 'systemd (Type=notify, watchdog)'],
    },
    metrics: [
      { k: 'tests (4 suites)', v: '51' },
      { k: 'median click to screen', v: '0.31 s' },
      { k: 'FSM states', v: '5' },
    ],
    cover: '/projects/lock-in/focus.webp',
    featured: false,
    github: 'https://github.com/clupai8o0/lock-in-complete',
  },
]

export const ARCHIVE: ArchiveItem[] = [
  { year: '2026', name: 'Airtable clone · 100k-row grid', tech: 'Next.js · tRPC · Prisma · PostgreSQL · TanStack Virtual', link: 'private', slug: 'airtable' },
  { year: '2026', name: 'Farmers Intuition · Hack48', tech: 'FastAPI · Gemini · ElevenLabs', link: 'github', slug: 'farmers-intuition' },
  { year: '2026', name: 'Lock-In · embedded focus tracker', tech: 'Arduino C++ · Python asyncio · Gemini API · Flask', link: 'github', slug: 'lock-in' },
  { year: '2026', name: 'Seatly · restaurant bookings', tech: 'Next.js 16 · FastAPI · PostgreSQL · Drizzle · Turborepo', link: 'private', slug: 'seatly' },
  { year: '2026', name: 'Recall · local-first screen memory', tech: 'Swift · OCR · Ollama · Whisper.cpp', link: 'github' },
  { year: '2026', name: 'Art Gallery · SIT331', tech: 'Express · MongoDB · Next.js · NextAuth · Jest', link: 'uni', slug: 'art-gallery' },
  { year: '2026', name: 'Robot controller API · SIT331', tech: 'C# · ASP.NET Core · PostgreSQL · Npgsql', link: 'uni', slug: 'robot-api' },
  { year: '2026', name: 'Voice light controller · SIT210', tech: 'Python · Raspberry Pi · BLE · Arduino · Gemini · ElevenLabs', link: 'uni', slug: 'voice-controller' },
  { year: '2026', name: 'Fleet platform · SIT314', tech: 'Node.js · MQTT · Node-RED · Postgres · AWS Fargate · SQS', link: 'uni', slug: 'fleet-platform' },
  { year: '2026', name: 'Bed monitor · SIT329', tech: 'C · FreeRTOS · SAMD21 registers · Python · SQLite', link: 'uni', slug: 'bed-monitor' },
  { year: '2025', name: 'GovChat · GovHack 2025 winner', tech: 'FastAPI · ChromaDB · Next.js', link: 'github', slug: 'govchat' },
  { year: '2025', name: 'notes-app · CI/CD showcase', tech: 'Next.js · Express · MongoDB · Docker · Jenkins · AWS · Prometheus · Grafana', link: 'github', slug: 'notes-app' },
  { year: '2025', name: 'load-balancer', tech: 'Go · Prometheus', link: 'github', slug: 'load-balancer' },
  { year: '2025', name: 'Mindful break recommender · SIT225', tech: 'Arduino · MQTT · Raspberry Pi · Python · Streamlit', link: 'github' },
  { year: '2024', name: 'Loco · offline course player', tech: 'Next.js · TypeScript · shadcn/ui', link: 'private' },
  { year: '2023', name: 'Thurman Events · events site', tech: 'Next.js · Tailwind · Framer Motion · Nodemailer', link: 'github' },
  { year: '2023', name: 'RIV · random image viewer', tech: 'Electron · JavaScript · Tailwind', link: 'github' },
  { year: '2022', name: 'Digi Convertor', tech: 'React · Vite · Recoil · Flask', link: 'github' },
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
    detail: 'Built the website and a price-first quote tool on Next.js 16, with prices the business edits itself. Lighthouse: 99 desktop, 95 phone.',
    href: '/projects/king-glazing',
  },
  {
    when: 'Feb–Oct 2026',
    role: 'Co-founder',
    org: 'TapCraft Studio',
    detail: 'Built the headless Shopify + Next.js 16 store and its affiliate tracking. Started a B2B rebuild that did not ship.',
    href: '/projects/tapcraft',
  },
  {
    when: 'Oct 2025–present',
    role: 'Residential Leader',
    org: 'DeakinRes',
    detail: 'Support residents and build community among international and domestic students in Deakin accommodation.',
  },
]
