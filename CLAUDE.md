@AGENTS.md

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

---

## Skill Guide

Skills are organized by purpose. When tasks overlap, prefer the most specific skill listed first.

### Design System Generation

Use when creating a new visual identity, design system, or style guide.

- `/ui-ux-pro-max` — primary design-system generator (67 styles, 161 palettes, 57 font pairings). Start here.
- `/design-dna` — reverse-engineer design DNA from screenshots or reference URLs into structured JSON, then generate from it.
- `/ckm-design-system` — CKM design system scaffolding (tokens, components, guidelines).
- `/ckm-brand` — brand identity guidelines.
- `/ckm-design` — general design artifacts.
- `/ckm-ui-styling` — UI styling patterns and component specs.
- `/ckm-banner-design` — promotional banner design.
- `/ckm-slides` — slide deck design.

### Component Discovery & Review (shadcn)

Use when building or auditing shadcn/ui components.

- `/shadcn-component-discovery` — find existing shadcn components across 1,500+ registry entries before writing custom code.
- `/shadcn-component-review` — audit custom components against shadcn design patterns.

### UI/UX Polish & Quality (impeccable)

Use when improving visual quality of existing UI. These are composable sub-skills from the `impeccable` package.

- `/impeccable` — load the full design language context; invoke before other impeccable sub-skills.
- `/audit` — full design audit with file:line output.
- `/critique` — honest design critique.
- `/polish` — holistic polish pass.
- `/typeset` — typography refinement.
- `/colorize` — color system improvements.
- `/layout` — spatial and grid corrections.
- `/animate` — add or improve motion design.
- `/adapt` — responsive/adaptive design fixes.
- `/bolder` — increase visual confidence/hierarchy.
- `/quieter` — reduce visual noise.
- `/clarify` — improve clarity and readability.
- `/delight` — add micro-interactions and detail.
- `/distill` — simplify and remove excess.
- `/optimize` — performance-aware visual optimization.
- `/overdrive` — push design to its limits.
- `/shape` — refine shapes, borders, radii.

### Design Taste Variants (taste-skill)

Use when you need an opinionated visual direction. Pick one per session.

- `/design-taste-frontend` — general high-end frontend taste (start here).
- `/high-end-visual-design` — premium, editorial-quality UI.
- `/minimalist-ui` — clean, reduced, minimal direction.
- `/industrial-brutalist-ui` — raw, bold, brutalist direction.
- `/redesign-existing-projects` — redesign workflow for existing code.
- `/stitch-design-taste` — stitch-style assembled aesthetic.
- `/full-output-enforcement` — force complete output (no truncation).
- `/gpt-taste` — ChatGPT-influenced UI taste (use only when matching that aesthetic).

### UI/UX Reference

Use when reviewing implementations against patterns and best practices.

- `/userinterface-wiki` — knowledge base covering animation, CSS, typography, UX patterns, icon usage (11 categories). Outputs file:line findings.

### Animation (GSAP)

Use when adding GSAP animations. Use `gsap-react` first in this project.

- `/gsap-react` — useGSAP hook, React integration, cleanup patterns. **Start here for this project.**
- `/gsap-core` — gsap.to/from/set, easing, staggers.
- `/gsap-timeline` — timelines, labels, callbacks.
- `/gsap-scrolltrigger` — scroll-driven animations.
- `/gsap-plugins` — MorphSVG, DrawSVG, SplitText, Flip, etc.
- `/gsap-utils` — clamp, mapRange, interpolate helpers.
- `/gsap-performance` — GPU-composited transforms, will-change, FPS optimization.
- `/gsap-frameworks` — Vue/Svelte integration (not needed here; kept for reference).

### Memory & Planning (claude-mem)

Use to maintain context across sessions and structure work.

- `/mem-search` — search stored session memory and observations.
- `/knowledge-agent` — build a knowledge base from the codebase.
- `/make-plan` — create structured implementation plans.
- `/do` — execute a plan step-by-step with memory tracking.
- `/smart-explore` — explore codebase with memory-aware context.
- `/timeline-report` — generate timeline of changes and decisions.
- `/claude-code-plugin-release` — release workflow for Claude Code plugins.

### Agent Orchestration (ruflo)

Use for multi-agent workflows, swarms, and autonomous task coordination.

- `/swarm-orchestration` — deploy and coordinate multi-agent swarms.
- `/swarm-advanced` — advanced swarm patterns.
- `/v3-swarm-coordination` — v3 swarm protocol.
- `/v3-core-implementation` — core agent implementation patterns.
- `/v3-deep-integration` — deep system integration patterns.
- `/v3-memory-unification` — unified memory across agents.
- `/v3-performance-optimization` — agent performance tuning.
- `/v3-security-overhaul` — security hardening for agent systems.
- `/v3-cli-modernization` — modernize CLI agent interfaces.
- `/v3-ddd-architecture` — domain-driven design for agents.
- `/v3-mcp-optimization` — MCP server optimization.
- `/worker-benchmarks` — benchmark worker performance.
- `/worker-integration` — integrate worker agents.

### Code Quality

Use when writing, reviewing, or refactoring any code.

- `/karpathy-guidelines` — Karpathy coding principles: think first, surgical changes, surface assumptions, define success criteria. Apply automatically during all code tasks.

### Knowledge Graphs

Use when mapping codebase structure or building queryable knowledge from mixed content.

- `/graphify` — transform code, docs, and data into interactive HTML knowledge graphs.

### Antigravity (1,400+ skills)

The full antigravity collection is installed and available. These cover domains including security, infrastructure, product management, marketing, data science, and more. Use `/audit-skills` to discover skills for a specific domain.

---

## Skill Redundancy Notes

The following overlaps exist — prefer the skill listed first:

| Task | Prefer | Over |
|------|--------|------|
| Design system creation | `/ui-ux-pro-max` | `/ckm-design-system` |
| Component audit | `/shadcn-component-review` | `/critique` (for code-level review) |
| Design review | `/audit` (impeccable) | `/userinterface-wiki` (for pattern reference) |
| UI taste direction | `/design-taste-frontend` | `/gpt-taste` (ChatGPT-specific) |
| Memory across sessions | `/mem-search` | global memory system |
| Multi-agent work | `/swarm-orchestration` | `/v3-swarm-coordination` |
