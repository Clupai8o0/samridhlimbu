export type ContentBlock =
  | { type: 'paragraph'; html: string; dropCap?: boolean }
  | { type: 'blockquote'; html: string }
  | { type: 'heading'; text: string; level: 2 | 3 }

export type Post = {
  slug: string
  title: string
  date: string
  readMin: number
  tags: string[]
  excerpt: string
  featured?: boolean
  content?: ContentBlock[]
}

export const POSTS: Post[] = [
  {
    slug: 'state-machine-over-cron',
    title: 'State machines over cron',
    date: '2026-03-14',
    readMin: 9,
    tags: ['engineering', 'kairos', 'backends'],
    excerpt: 'How an explicit FSM made a flaky scheduler legible — and findable when it broke.',
    featured: true,
    content: [
      {
        type: 'paragraph',
        dropCap: true,
        html: `The first version of Kairos was a loop and a prayer. Every minute a worker woke up, read the "scheduled" table, picked the jobs whose <code>run_at</code> had passed, and tried to dispatch them. If anything in that dispatch threw — a network blip, a contract change, a Redis hiccup — the row stayed <code>status='scheduled'</code> and got retried next tick. For a long time that worked.`,
      },
      {
        type: 'paragraph',
        html: `Then I wrote a second feature. Then a third. And the loop started to lie.`,
      },
      {
        type: 'blockquote',
        html: `A scheduler that "mostly runs" but silently drops events is worse than one that halts loudly. Silent failure is a liability; loud failure is just a bug.`,
      },
      {
        type: 'paragraph',
        html: `The problem wasn't the cron. It was the absence of a contract between "I scheduled this" and "this ran." Once I added a second dispatch path — a webhook retry, a manual trigger from the UI — the implicit contract broke. Two code paths, one shared status column, no coordination.`,
      },
      {
        type: 'heading',
        level: 2,
        text: 'What a state machine bought',
      },
      {
        type: 'paragraph',
        html: `Replacing the loop with an explicit FSM forced me to enumerate every transition: <code>SCHEDULED → RUNNING → DONE</code>, <code>RUNNING → FAILED</code>, <code>FAILED → SCHEDULED</code> (with backoff), <code>SCHEDULED → EXPIRED</code> (if TTL exceeded). Suddenly the "silently dropped job" had a name. It was an unhandled transition from <code>SCHEDULED</code> when the TTL window closed without a runner picking it up.`,
      },
      {
        type: 'paragraph',
        html: `The FSM didn't fix the bug immediately. But it made the bug <em>findable</em>. When I added the off-by-one check to the retry window, the failing test pointed at a specific transition rather than a generic "job didn't run" failure. That's the real value: not correctness, but legibility.`,
      },
      {
        type: 'heading',
        level: 2,
        text: 'The implementation',
      },
      {
        type: 'paragraph',
        html: `The FSM lives in a single Python class. States are a <code>StrEnum</code>. Transitions are validated in a <code>can_transition()</code> method before any database write. The HTTP layer never touches <code>status</code> directly — it calls <code>job.transition(target_state)</code> and catches <code>InvalidTransition</code>.`,
      },
      {
        type: 'paragraph',
        html: `Postgres advisory locks handle the concurrent runner problem. Before picking up a job, a runner acquires an advisory lock keyed to the job ID. If another runner holds it, the query returns nothing. No double-dispatch, no Redis, no distributed lock service — just a feature Postgres has had since 2003.`,
      },
      {
        type: 'heading',
        level: 2,
        text: "What I'd do differently",
      },
      {
        type: 'paragraph',
        html: `Write the FSM before the HTTP layer. I let endpoint shapes drive the state design early on, which meant the FSM had to accommodate decisions already baked into the API. The rewrite inverts this — the state machine is the specification, and the HTTP layer just exposes it.`,
      },
    ],
  },
  {
    slug: 'off-by-one-in-production',
    title: 'An off-by-one in production, and what it cost',
    date: '2026-02-02',
    readMin: 11,
    tags: ['debugging', 'postmortem'],
    excerpt: 'One in 120 jobs silently expired. A forensic walkthrough of the bug that made me rewrite my test pyramid.',
    featured: true,
    content: [
      {
        type: 'paragraph',
        dropCap: true,
        html: `For three weeks, one in roughly 120 scheduled jobs expired quietly. No error. No alert. The job would enter the retry window, get checked, and somehow never qualify for re-dispatch. The FSM moved it to <code>EXPIRED</code> on schedule. The logs were clean.`,
      },
      {
        type: 'paragraph',
        html: `I only caught it because a user noticed a missing webhook delivery and filed a bug. At that point the job had already been marked expired. The window to re-run it had closed.`,
      },
      {
        type: 'blockquote',
        html: `Silent failure is a liability; loud failure is just a bug. The FSM made this findable — without it, the symptom would have read as random noise.`,
      },
      {
        type: 'heading',
        level: 2,
        text: 'The root cause',
      },
      {
        type: 'paragraph',
        html: `The retry window check used a <code>j &lt; high - 1</code> guard instead of <code>j &lt; high</code>. One slot at the edge of the window was always skipped. For jobs with exactly one retry slot, this meant zero retries ever succeeded — the only valid slot was the one being excluded.`,
      },
      {
        type: 'paragraph',
        html: `The condition survived code review because the variable names were short, the logic was dense, and the test suite only covered the happy path and a clear-failure case. Nobody tested the boundary.`,
      },
      {
        type: 'heading',
        level: 2,
        text: 'The fix',
      },
      {
        type: 'paragraph',
        html: `One character. <code>j &lt; high - 1</code> → <code>j &lt; high</code>. The fix took thirty seconds. The investigation took four hours. The test I wrote afterward — boundary cases at <code>high - 2</code>, <code>high - 1</code>, and <code>high</code> — took twenty minutes.`,
      },
      {
        type: 'heading',
        level: 2,
        text: 'What I changed afterward',
      },
      {
        type: 'paragraph',
        html: `I rewrote my test pyramid. Before this bug, my tests were mostly happy-path integration tests with a handful of unit tests for obviously complex logic. After it, I added a rule: every function that deals with numeric boundaries gets explicit tests at <code>n-1</code>, <code>n</code>, and <code>n+1</code>. Every transition function gets tests for invalid inputs.`,
      },
      {
        type: 'paragraph',
        html: `The coverage number went from 71% to 84%. More importantly, the <em>kind</em> of coverage changed. I stopped measuring coverage as "lines hit" and started measuring it as "boundaries tested."`,
      },
    ],
  },
  {
    slug: 'postgres-advisory-locks',
    title: 'Advisory locks and why I ditched Redis for Postgres',
    date: '2026-01-18',
    readMin: 7,
    tags: ['postgres', 'backends', 'architecture'],
    excerpt: 'Single source of truth beats distributed queue performance at my scale.',
  },
  {
    slug: 'fastapi-pydantic-contracts',
    title: 'FastAPI contracts I wish I had from day one',
    date: '2025-12-10',
    readMin: 6,
    tags: ['python', 'fastapi', 'engineering'],
    excerpt: 'How Pydantic models became the single source of truth for my API contracts.',
  },
  {
    slug: 'rewriting-in-nextjs-16',
    title: 'Why I rewrote the frontend in Next.js 16',
    date: '2025-11-22',
    readMin: 8,
    tags: ['frontend', 'engineering', 'kairos'],
    excerpt: 'The bugs were in the UI contract, not the scheduling logic. Rewriting both would have been a different project.',
  },
  {
    slug: 'freelance-pricing-lessons',
    title: 'Three pricing lessons from my first year freelancing',
    date: '2025-10-05',
    readMin: 5,
    tags: ['freelance', 'business'],
    excerpt: "What I got wrong about scoping, retainers, and saying no.",
  },
  {
    slug: 'leading-without-authority',
    title: 'Leading without authority in a student team',
    date: '2025-09-14',
    readMin: 4,
    tags: ['leadership', 'community'],
    excerpt: 'Technical credibility opens doors but it does not keep them open.',
  },
  {
    slug: 'on-shipping-rough-edges',
    title: 'On shipping with rough edges',
    date: '2025-08-30',
    readMin: 3,
    tags: ['essay', 'rtf'],
    excerpt: 'Polished software that ships late is usually worse than rough software that ships on time.',
  },
]

export const ALL_TAGS = [
  'engineering', 'kairos', 'backends', 'debugging', 'postmortem',
  'architecture', 'postgres', 'leadership', 'community', 'python',
  'fastapi', 'freelance', 'business', 'frontend', 'rtf', 'essay',
]
