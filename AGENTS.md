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
  status line: `● <rotating verb>` on the left, `samridhlimbu.com<path> · v0.1`
  on the right. Drop it in as the **first** child inside the page's outer
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

## Charts and code blocks

- Data charts are never static images. Draw them with `<ArticleChart>`
  (`src/components/article-chart.tsx`): `line`, `bar`, or `hbar` (sideways
  bars, for long category names). Data comes from the real run, never read off
  an old image. Keep them compact: fewest panels, one unit per chart.
- Code, logs and terminal output use `<CodePre code={...} lang="..." />`
  (`src/components/code-pre.tsx`), so every block is coloured. Default `log`
  colouring suits captured output; pass `json`, `bash`, `python` etc. for code.

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
