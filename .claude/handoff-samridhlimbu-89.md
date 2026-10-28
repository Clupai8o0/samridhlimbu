# Handoff: case studies (samridhlimbu-89), updated 28 Oct 2026, vivobook

**Status: LIVE. Merged into main and deployed 28 Oct 2026 (evening). Art Gallery: not merged, still in progress.**

## Live (28 Oct, merge `f8a60f8` on main; `f92b165` merged case-studies-cstack-morgue first)
- No conflicts; `npm run build` passed; privacy scan of `origin/main..main` clean (no client/employer names, keys, home paths or emails). Vercel git integration deployed `f8a60f8` on push.
- https://samridhlimbu.com/projects/cstack
- https://samridhlimbu.com/projects/morgue
- https://samridhlimbu.com/writing/cstack-one-layer-six-agents
- Also live: /projects/load-balancer, notes-app, govchat, farmers-intuition, lock-in, bed-monitor, fleet-platform. All returned 200.

## Paper figures replaced (28 Oct 2026, commit `ec471da`, live)
- SIT314 fleet-ceiling: now a themed line chart from `.claude/tmp/fleet-platform-shots/data/aug/e2_pinned.csv` and `e3_autoscaled.csv`.
- RLiG cost.webp: removed; the themed Table 1 chart already showed the same data (the Ns=200 and 5000 bars had no source numbers here).
- Where-is-the-algorithm: two-players and answer-key images are now table blocks (text from the paper PDF).
- Four image files deleted from public/. Codex reviewed: no findings. Checked live at 390 and 1440 px.
- Finished on the Mac (commit `02e9825`, live): RLiG curves are two line charts with one-sd bands (from `uni/sit320/11/report/results.json`), the rho sweep is three SHD charts plus a log-likelihood table (from `rho.tex`), and size128-collapse is a table. ArticleChart series take optional `lo`/`hi` bands; table blocks take a caption. Codex and DeepSeek reviewed. All three posts now load no paper images.
- Kept on purpose: merkle/TLS diagrams, and the project pages' charts (already dark, site-styled images made from real data).

## Done
| Step | Result |
|---|---|
| 7 case studies | load-balancer, notes-app, govchat, farmers-intuition, lock-in, bed-monitor, fleet-platform: pages, media, data.ts rows, DETAIL_PAGES. Each had a skeptic pass. |
| T1 research | `.claude/t1-candidates.md` (untracked). Archive rows added: Recall, SIT331 robot API, SIT210 voice controller. |
| Recall row | Now matches the main repo: "Recall · local-first screen memory", Swift · OCR · Ollama · Whisper.cpp. Gemini and Next.js were only in the hackathon fork. |
| Codex review (high), whole branch since `7d0d303` | 2 low findings, both in cstack. Table cells showed literal `<code>` tags: fixed in the writing renderer (cells now render as HTML, like paragraphs). The review-diagram caption mismatch is already fixed on `cstack-post-20261028`, so I left it there. |
| eslint `src` | Clean. (`eslint .` also lints the throwaway app copy in `.claude/tmp`, which is git-ignored.) |
| Build | `npm run build` passes. |
| Sweep | 9 routes x 4 views: no overflow, broken images or page errors. 18 SVGs serve as valid SVG and render. Only flag: footer "x" link is a small tap target (23x44, shared component). |

## Left, in order
1. Art Gallery case study (agent running; see below once updated).
2. Done 28 Oct: both branches merged into main and live (see above).
3. Optional: grow the footer "x" tap target to 44x44.
4. After merge: `podman rm art-gallery-showcase`, and delete `.claude/tmp/*-shots` when no longer needed.

## Decisions for Sam
- **Rotate the SIT210 keys now** (recommended), then remove them from the repo. `sit210/8.1hd/config.py` commits a real **Gemini API key** and a real **ElevenLabs API key**; `4.2d/server.py` hard-codes the HiveMQ (MQTT) password and Wi-Fi details. The repo is private, but the keys are in git history. Alternative: leave them, and never make the repo public.
- **Merge** this branch (recommended), or read the pages on the phone first.
- **GovChat improved version:** keep it as a local-only prototype on the page (recommended), or publish it as its own repo.
- **Illustrations:** keep the hand-drawn SVG schematics (recommended), or fix the imagegen MCP model so real illustrations can be generated.
- **SIT331 unit title** is unconfirmed (deakin.edu.au blocks bots). Pages say "SIT331" only. Add the official title if you want it.
- **CASCADE (SIT282)**: left off. Add it only if it was your own submission (Shambhavi co-committed).

## Branch and commands
- Branch `case-studies-cstack-morgue`, pushed and merged. Sam lifted "never push main" for samridhlimbu on 28 Oct.
- Review: `python3 ~/Documents/Obsidian/brain/skills/_core/token-economy/scripts/second_opinion.py - --cwd . --review --base 7d0d303 --ladder codex --codex-effort high`
- Sweep (Linux): copy `~/Documents/Obsidian/brain/skills/design/portfolio-showcase/scripts/sweep.py`, set `EXE` to `~/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome`, run with `~/.venvs/showcase/bin/python3 sweep.py OUTDIR ROUTES...` against `npx next start -p 3311`.
- One heavy thing at a time on the vivobook: the last session was killed for running a server, a browser and a dev server together.

## Guardrails
g82 no stash, g85 kill by PID only, g67 no bare ls, g31 quote refspecs. Stage by name; never stage AGENTS.md, CLAUDE.md or other sessions' `.claude/` files.
