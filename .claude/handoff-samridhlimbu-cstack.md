# Handoff: cstack writing post + project page (updated 28 Oct 2026, vivobook)

**Status: done and pushed on `cstack-post-20261028`. Waiting on Sam: merge or not.**

## Done
| Step | Result |
|---|---|
| Skeptic pass | Checked every number against `~/Documents/projects/cstack` (HEAD `e065d5c`) and facts.md. Fixed the claims that were wrong (list below). |
| Design check | Desktop SVGs fine, no dividers. On a phone their text shrank to ~6-7px, so I added portrait versions (`public/writing/cstack/*-m.svg`, generator `.claude/tmp/cstack-post/gen_mobile.py`), served under 640px through `<picture>`. |
| Voice | unslop audit: no hard hits. Fixed one "X, not Y" tail on the page. Soft flags left as judgement calls: even sentence lengths, and a closing paragraph that echoes the opening. Spelling is Australian. |
| Build + QA | `next build` passes in a copy without `projects/load-balancer` (still broken on the other branch: `__STRATEGY_ROWS__`). sweep.py on 3 routes, 4 views: no overflow, broken images or page errors. Charts render. cstack is the first card on /writing and is featured. |
| Codex review | Diff of the cstack files only, from `7d0d303`. 2 findings, both fixed: 96-100% now covers only the four right-or-wrong tasks, and the claims.svg description now has A sending the handoff. |

Fixes from the skeptic pass:
- Project page: the review diagram's alt text described a bug chart. It now has the right alt, sits under "reviews on the diff", and a real bugs-of-17 chart was added.
- Alt text and captions for routing.svg and review.svg now match what the diagrams show.
- The 2.7x figure is now labelled as Opus 5 in the page description.
- The reviewer chart title no longer says every model shown is routed.
- Wording fixed: "rules/" no longer says "copies", and subagents "inherited the session's effort".

Commits: `2a6401c`, `45692d1`. The Mac's WIP is in `8523655`.

## Left, in order
1. **Sam: merge?** If yes, merge `cstack-post-20261028` into `main`. It needs the load-balancer fix from `case-studies-cstack-morgue` first, or the build fails on that page.
2. Optional: grow the small tap targets the sweep flagged. Both are in shared components, not this work: the chart "view data" toggle (78x18) and the footer "x" link.

## Decisions for Sam
- **Merge** (recommended, once load-balancer is fixed), or hold for a read on the phone first.
- **Extra reviewers skipped.** DeepSeek and Grok passes were not run. `second_opinion.py` treats `samridhlimbu-cstack` as confidential because the folder isn't listed in model-policy.json. Adding `samridhlimbu-*` as personal would allow them next time.

## Changed outside this post
- `src/lib/writing.ts`: the image block has a new optional `mobileSrc` (1 line).
- `src/app/writing/[slug]/page.tsx`: image blocks are wrapped in `<picture>` and use `mobileSrc` under 640px. Posts without it are unchanged.

## Commands
- Build without the broken page: `git archive HEAD | tar -x -C .claude/tmp/qa-build`, then `cp -al node_modules` into it, remove `src/app/projects/load-balancer`, and run `npx next build && npx next start -p 3311`. A symlinked node_modules breaks Turbopack.
- On Linux, sweep.py needs a venv with `playwright` and `EXE` pointed at `~/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome`.
- Regenerate the phone SVGs: `python3 .claude/tmp/cstack-post/gen_mobile.py`.

## Guardrails
g82 no stash, g85 no pkill, g31 quote refspecs. The repo is public: the privacy check passed (counts only, no paths or client names).
