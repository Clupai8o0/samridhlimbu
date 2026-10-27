# Handoff: cstack writing post + project page with diagrams and charts (27 Oct 2026)

Sam asked: "add cstack as a writing and a project in samridhlimbu and explain it with illustrations, diagrams and statistics".
The owner moved the work to the vivobook mid-run, so the skeptic pass was stopped before it finished.

## Done (uncommitted, branch `case-studies-cstack-morgue`)
| File | What |
|---|---|
| `src/lib/posts/cstack.ts` | New post `CSTACK_POST`, slug `cstack-one-layer-six-agents`, 2026-10-27, featured, with chart blocks, tables and diagram images |
| `src/lib/writing.ts` | 2 lines only: `import { CSTACK_POST } ...` at the top, and `CSTACK_POST,` as the last POSTS entry. samridhlimbu-64 handed this file over after committing a011a1e |
| `src/app/projects/cstack/page.tsx` | Upgraded: more stats, 5 diagrams, ArticleChart charts, links to the write-up |
| `public/writing/cstack/{layer,claims,guardrail-loop,routing,review}.svg` | Hand-written SVG diagrams, used by both the post and the page |
| `.claude/tmp/cstack-post/facts.md` | Fact sheet with a source for every number, plus a "do not claim" list. Earlier fact check: `.claude/tmp/cstack-check.md` |

- Checks: eslint is clean on all 3 TS files. `tsc` is clean for these files; its one error is `load-balancer/page.tsx` (`__STRATEGY_ROWS__`, samridhlimbu-89's work in progress).
- Not touched: `data.ts` (held by samridhlimbu-89), `article-chart.tsx`, the `[slug]` renderer.

## Left, in order
1. **Skeptic pass (was cut off).**
   - Claims: check every number, chart value, caption and diagram label in the 3 TS files and 5 SVGs against `~/Documents/projects/cstack` (README, docs/) and facts.md.
   - Watch for: effort vs model routing (2.7x is Opus 5 low vs xhigh), "same score", Opus 5 vs 5.5, causal claims the docs don't make.
   - The post writer noted that `routing.svg` and `review.svg` were drawn after their captions were written. Check that the alt text and captions match the drawings.
2. **Design check.**
   - Render each SVG at 1200 and 390 px on a dark page and look at it.
   - No dividers (owner rule).
   - Phone text must stay readable.
   - Check render scripts: `.claude/tmp/cstack-post/render.py`.
3. **Voice.** Run an unslop audit on the post and the page prose. Australian spelling.
4. **Build and QA.**
   - `npm run build`, then `next start -p 3311`.
   - Run `sweep.py` from the portfolio-showcase skill on `/projects/cstack`, `/writing` and `/writing/cstack-one-layer-six-agents`.
   - Check the charts render, the card order and the featured flag.
5. **Codex review** of the diff (always required):
   - Command: `second_opinion.py - --cwd <site> --review --ladder codex`.
   - Also run `dsh:deepseek-flash` (with `--timeout 3000`, g59) and `grok:grok-4.7` (with `--timeout`, g26), because this is a personal folder.
6. **Commit.**
   - Stage by name only: the 3 TS files and the 5 SVGs. Never AGENTS.md, CLAUDE.md or `.claude/`.
   - Other sessions' files are in the tree (load-balancer, notes-app, fleet-platform, bed-monitor, lock-in svgs).
   - Push the branch.
   - **Merge to main only when Sam says "merge".**

## Risks / guardrails
- The site repo is public: a push publishes. The privacy check must pass first (no client names, no paths, counts only for guardrails and claims history).
- Guardrails:
  - g82: never `git stash`.
  - g83: careful with `git apply --cached`.
  - g67: no bare `ls`.
  - g85: no `pkill`.
  - g31: quote push refspecs.
- `cstack` repo is read-only.

## Decisions for Sam
- None yet. Ask after QA whether to merge.
