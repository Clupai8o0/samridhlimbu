<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# samridhlimbu — Next.js Project

## Stack

- **Framework:** Next.js 16 (App Router, `src/` directory)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Linting:** ESLint (next/core-web-vitals config)
- **Package manager:** npm

## Project conventions

- All pages go in `src/app/`
- Shared components go in `src/components/`
- Use server components by default; add `"use client"` only when required
- Import alias `@/*` maps to `src/`

## Design system — motion & micro-interactions

The site uses a small shared motion system. Three building blocks; use them on
every new page so the feel stays consistent.

### Components

- **`<PageShell>`** (`src/components/page-shell.tsx`) — wraps every page. It
  mounts `<PageAnimations />` inside `<main key={pathname}>`, so animations
  re-run on every navigation. Never render `<PageAnimations />` manually.
- **`<PageHeader>`** (`src/components/page-header.tsx`) — the top-of-page
  status line: `● <rotating verb>` on the left, `samridhlimbu.com<path>`
  on the right (pass `status` for a fixed label instead of the rotating verb; the home page does). Drop it in as the **first** child inside the page's outer
  content wrapper (right after `<PageShell>` opens). It's already a
  `data-stagger-item`, so it fades in as the first item of the entrance.
- **`<Typewriter>`** (`src/components/typewriter.tsx`) — generic typing-rotator.
  Used inside `<PageHeader>`. Reuse it directly only if you need a typing
  effect somewhere other than the page header.

### Animation attributes

Apply these data attributes to ordinary divs. `PageAnimations` reads them on
mount and sets up the motion.

- **`data-stagger`** — put it on the page's outer wrapper to declare a stagger
  root. (If omitted, the first 3 children of the first wrapper inside `<main>`
  auto-stagger as a fallback.)
- **`data-stagger-item`** — children of a `data-stagger` root that fade up in
  sequence on mount (≈70ms apart, ~540ms duration, `cubic-bezier(0.16, 1, 0.3, 1)`).
  Use it on the breadcrumb, banner, and first hero block.
- **`data-reveal`** — fades up as the element enters the viewport via
  `IntersectionObserver`. Use it on sections **below the fold** (bio blocks,
  metrics, contact form). Elements with the `.section-label` class are
  auto-revealed too — don't double-tag them. The element immediately
  following each `.section-label` is also auto-revealed; if that element
  has 3+ direct children (timeline events, decision rows, archive rows),
  its children stagger-reveal individually instead — so don't manually
  data-reveal the rows themselves.

### Page template (copy this on every new page)

```tsx
<PageShell>
  <div data-stagger style={{ maxWidth: 720, margin: '0 auto', padding: '40px 28px' }}>
    <PageHeader />

    {/* breadcrumb */}
    <div data-stagger-item style={{ ... }}>❯ cat ~/foo.md</div>

    {/* main header / banner */}
    <div data-stagger-item style={{ ... }}>...</div>

    {/* below-the-fold sections */}
    <div data-reveal>...</div>
    <div className="section-label">Auto-revealed</div>
    <div data-reveal>...</div>
  </div>
</PageShell>
```

### Rules

- Honor `prefers-reduced-motion: reduce` — `PageAnimations` already short-circuits
  when this is set. Don't add custom motion that ignores it.
- Don't add new entrance animations via Framer Motion / CSS keyframes on a
  per-page basis. Extend the data-attribute system instead.
- Don't use GSAP. The current pipeline is dep-free (plain CSS transitions
  driven by `IntersectionObserver`). `gsap` is still in `package.json` from an
  earlier experiment — safe to remove if nothing reintroduces it.

## Match funnel (6 Nov 2026, split 7 Nov)

A modal asks the first question ("who's asking?"), then sends the visitor to
`/match?as=<who>` for the other three and the results (`src/components/match/`:
`match-funnel.tsx` is the modal, `match-flow.tsx` the page; scoring in
`src/lib/match.ts`). It opens from the hero row, the /projects header, the ⌘K
palette, or any URL with `?match` (share `samridhlimbu.com/?match`). Visitors
with saved answers skip the modal and land on their results. Email is optional:
`sendMatch` in `src/app/actions.ts` mails the shortlist and sends Sam the answers.

- The role step is multi-select; scoring uses the best-matching role.
- Visitors who need something built (`who: client`) get a link to clupai's
  Build Risk Check, https://clupai.com/start (`build-check.tsx`, also in the
  ⌘K palette and the chat's rules). clupai is Sam's company: say "we" and
  "company", never "studio", and never quote prices.
- A small card in the bottom-left corner (`match-nudge.tsx`, mounted in the
  root layout) points visitors at the funnel, the chat and the Build Risk
  Check. It shows 5 s after load, never on /match, never to someone with saved
  answers, and stays away for 30 days once closed or used (`nudge:v1`).
  `?nudge` on any page but /match shows it anyway, after 1 s (to check it on a preview).
- Every tag in `TAGS` must be true of its case study. When a case study changes
  or a new one ships, update its tags there, or it never gets matched.

## Chat with my work (7 Nov 2026)

An AI chat that answers questions about Sam's work (`src/components/chat/`,
route `src/app/api/chat/route.ts`, logic in `src/lib/chat/`). Opens from the
hero ("or ask my work a question"), ⌘K, `?chat`, and sits under the /match results.

- It only knows the site: `scripts/build-chat-corpus.mjs` pulls the visible text
  of every case study, /about, /resume and `data.ts` into
  `src/lib/chat/corpus.generated.ts` before each build. Run `npm run chat:corpus`
  after changing a page and commit the result. Rules for the bot are in `prompt.ts`.
- Env vars (Vercel): `ANTHROPIC_API_KEY` (required; without it the chat says it
  is off), `CHAT_MONTHLY_CAP_USD` (default 10; 0 pauses it), `CHAT_MODEL`
  (default `claude-opus-5-5`; `claude-haiku-5-5` is ~40x cheaper; a model with
  no price in `budget.ts` keeps the chat off), and an Upstash Redis
  (`KV_REST_API_URL`/`KV_REST_API_TOKEN`, required on every deployment; without
  it the chat stays off there, and local dev uses in-memory counters).
- Captcha: Cloudflare Turnstile (`NEXT_PUBLIC_TURNSTILE_SITE_KEY`,
  `TURNSTILE_SECRET_KEY`; required on every deployment, previews included,
  along with Redis. Only plain local dev falls back to Cloudflare's always-pass
  test keys and in-memory counters). Invisible unless Cloudflare wants a
  click. A pass is a signed cookie for 2 hours and 40 messages
  (`CHAT_SIGNING_SECRET` optional, defaults to the Turnstile secret).
- Other guards (`src/lib/chat/guard.ts`): same-origin only, JSON under 24 KB,
  invisible characters stripped, obvious rule-changing attempts get a fixed
  reply without calling the model, answers capped at 700 tokens, 10 questions
  per conversation. The rules in `prompt.ts` forbid code, essays, speaking for
  Sam (rates, availability) and answers past ~150 words.
- Telegram alerts (`src/lib/chat/alerts.ts`, existing `TELEGRAM_*` vars), each
  once per window: 80% of the cap, cap used up, site daily limit, a visitor
  hitting the limit, 10+ attack attempts in a day. Previews prefix `[preview]`.
- The only outside link the bot may give is clupai's Build Risk Check; the
  panel renders it from an allowlist (`OUTSIDE_LINKS` in `chat-panel.tsx`).
- When the cap is used up the panel swaps the input for an animated
  "budget.monthly 100%" card. See it on a preview with `/?chat&demo=budget`.
- The hard stop is the spend limit on the Anthropic workspace that owns the key.
  The app cap reserves the worst case before each call (two attempts on Opus and
  Sonnet, which retry refusals on a fallback model; about $1 on Opus) and settles
  to the real cost after. A stopped or failed answer keeps the whole reservation.

## Charts and code blocks

- Data charts are never static images. Draw them with `<ArticleChart>`
  (`src/components/article-chart.tsx`): `line`, `bar`, or `hbar` (sideways
  bars, for long category names). Data comes from the real run, never read off
  an old image. Keep them compact: fewest panels, one unit per chart.
- Code, logs and terminal output use `<CodePre code={...} lang="..." />`
  (`src/components/code-pre.tsx`), so every block is coloured. Default `log`
  colouring suits captured output; pass `json`, `bash`, `python` etc. for code.

## SEO, required (owner, 29 Oct 2026)

Every page must be easy for search engines to read. `npm run build` runs
`scripts/check-seo.mjs` first (`prebuild`), so Vercel will not deploy a page
that breaks these rules. Run `npm run check:seo` before you call a page done.

On every new or changed page:

- **Metadata:** `title`, `description`, `alternates.canonical` (the page's own
  path) and a full `openGraph` (url, title, description, images). The OG image
  must exist in `public/`. Case studies use the hero webp at its real size.
- **Structured data:** `<PageShell jsonLd={pageJsonLd(metadata)}>` from
  `@/lib/seo`. TypeScript requires the prop. Posts pass `postJsonLd(post)`;
  only error and 404 pages pass `null`. The site-wide Person and WebSite data
  is in `siteJsonLd()` (root layout); update it there, not on a page.
- **One `<h1>`** per page.
- **Alt text** on every `<img>` and `<Image>`.
- **Linked:** a new case study needs its `PROJECTS` entry or an `ARCHIVE` row
  with its `slug` in `src/lib/data.ts`, or crawlers can't find it.

Automatic, don't edit by hand: `src/app/sitemap.ts` lists every `page.tsx` and
every post on its own. Bump its `LAST_MODIFIED` when content really changes.

## Illustrations and image generation (owner, 28 Oct 2026)

The site must not read as AI-made or "vibe coded". So:

- **Simple illustrations: go ahead** with our image models (the
  `openai-imagegen` MCP, `openai_generate_image`). Simple means flat spot
  illustrations, small icons or glyphs, plain line drawings, empty-state art.
  Match the site: dark background, flat colours from the site palette, no
  glow or gradients, no text inside the image.
- **Anything fancy: ask the owner first**, with one sample and the prompt.
  Fancy means photoreal or 3D renders, hero or cover art, detailed scenes,
  people or faces, logos, mockups of a project, or anything that looks
  obviously AI-made.
- Never use a generated image as a screenshot or as evidence of what a project
  does. Screenshots come from the real app; charts from `<ArticleChart>`;
  diagrams stay hand-built SVG.
- Save as `.webp` under `public/<area>/<slug>/` with real alt text, and say in
  the reply or handoff which images were generated.
