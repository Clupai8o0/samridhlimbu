# Handoff: case studies (samridhlimbu-89), updated 28 Oct 2026, vivobook

**Status: 7 case studies built, reviewed, swept and pushed on `case-studies-cstack-morgue`. Art Gallery: in progress.**

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
2. Sam: merge this branch, then `cstack-post-20261028`. The two branches both touch `src/app/writing/[slug]/page.tsx`, in different spots; expect an easy merge.
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
- Branch `case-studies-cstack-morgue`, pushed. Never push main.
- Review: `python3 ~/Documents/Obsidian/brain/skills/_core/token-economy/scripts/second_opinion.py - --cwd . --review --base 7d0d303 --ladder codex --codex-effort high`
- Sweep (Linux): copy `~/Documents/Obsidian/brain/skills/design/portfolio-showcase/scripts/sweep.py`, set `EXE` to `~/.cache/ms-playwright/chromium-1234/chrome-linux64/chrome`, run with `~/.venvs/showcase/bin/python3 sweep.py OUTDIR ROUTES...` against `npx next start -p 3311`.
- One heavy thing at a time on the vivobook: the last session was killed for running a server, a browser and a dev server together.

## Guardrails
g82 no stash, g85 kill by PID only, g67 no bare ls, g31 quote refspecs. Stage by name; never stage AGENTS.md, CLAUDE.md or other sessions' `.claude/` files.
