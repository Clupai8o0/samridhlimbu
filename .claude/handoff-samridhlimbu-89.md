# Handoff: seven case studies (samridhlimbu-89), 27 Oct 2026, ~22:55 +0545

Sam asked to fill these case studies:
- load-balancer: real logs as proof, plus graphs that show the improvements
- notes-app
- govchat: plus an improved version if possible
- bed monitor and fleet platform: diagrams and illustrations
- farmers-intuition and lock-in: the same

He asked for it to be done in parallel. It was stopped partway because of the move to the vivobook.

Branch: `case-studies-cstack-morgue`. Nothing is committed for this work, and nothing is pushed.

## State per project

| Project | State | Evidence workspace |
|---|---|---|
| bed-monitor | **Built.** New page `src/app/projects/bed-monitor/page.tsx` and `public/projects/bed-monitor/`. Skeptic pass was cut off partway (`$S/skeptic/`). | `.claude/tmp/bed-monitor-shots` |
| fleet-platform | **Built (partial: no illustrations).** New page `src/app/projects/fleet-platform/page.tsx` and `public/projects/fleet-platform/`. Skeptic pass was cut off. | `.claude/tmp/fleet-platform-shots` |
| load-balancer | Build was cut off. The page has been edited (282 lines) and `public/projects/load-balancer/` exists. Runs, CSVs, charts and log excerpts are in the workspace. Not checked. | `.claude/tmp/load-balancer-shots` |
| farmers-intuition | Build was cut off. The page has been edited (326 lines) and there are new SVG and webp files. Not checked. | `.claude/tmp/farmers-intuition-shots` |
| lock-in | Build was cut off. Four new SVGs (`system`, `wiring`, `fsm`, `distance`). The page is not edited yet. | `.claude/tmp/lock-in-shots` |
| notes-app | Build was cut off. The app ran and logs and stage times were captured. `public/projects/notes-app/` exists. The page is not edited. | `.claude/tmp/notes-app-shots` |
| govchat | Build was cut off. Clones, an eval folder and an `improved/` copy exist. The page and media are not edited. | `.claude/tmp/govchat-shots` |

- Saved results of the two finished builds (data.ts rows, blocked items, notes): `.claude/tmp/case-studies-build-results.json`.
- Workflow script with the full per-project briefs and rules: `.claude/tmp/case-studies-workflow.js`.
  - It can be re-run on the vivobook for the five unfinished projects (drop bed-monitor and fleet-platform from `PROJECTS`).
  - Tell each build agent to reuse what is already in its `$S` workspace.

## Left to do, in order

1. Finish the builds for load-balancer, farmers-intuition, lock-in, notes-app and govchat. Use the workflow, or do them one by one.
2. Run the skeptic and fix pass on all seven. That is stage 2 of the workflow.
3. In `src/lib/data.ts`:
   - Add `slug: 'bed-monitor'` and `slug: 'fleet-platform'` to their ARCHIVE rows.
   - Apply each agent's `dataTsChange`. The lock-in PROJECTS entry needs its claims re-checked (51 tests, 8 tasks, AU$70).
4. In `src/app/projects/page.tsx`, add `'bed-monitor'` and `'fleet-platform'` to `DETAIL_PAGES`.
5. Pick one style for the log blocks. fleet-platform uses a 1px border and bed-monitor uses none. No dividers is the rule, and a frame is allowed.
6. QA, reviews and shipping (skill `portfolio-showcase`, steps 8-11):
   - Run tsc, eslint and one `npm run build`.
   - Run `sweep.py` on the seven pages plus `/` and `/projects`.
   - Check that the SVGs render through `Shot`, because next/image does not optimise SVG.
   - Get Codex (high) and DeepSeek Flash reviews of the diff.
   - Stage by name only, commit and push the branch. Merge only when Sam says "merge".
7. Delete unused old media only after `grep -rn <file> src` comes back empty for each file.

## Open risks

- **Other sessions' files are in the same tree. Do not stage them:**
  - `src/app/projects/cstack/page.tsx`, `public/writing/cstack/` and `src/lib/posts/` belong to samridhlimbu-fd.
  - `src/lib/writing.ts` belongs to samridhlimbu-64.
  - Stage by file name only. Never stage AGENTS.md, CLAUDE.md or `.claude/`.
- **Illustrations are blocked.** The openai-imagegen MCP fails with "model dall-e-3 / dall-e-2 does not exist". The agents drew SVG schematics instead. Fixing that MCP's model config would unblock generated illustrations.
- **The bed-monitor dashboard shots are Sam's own captures from 7 Sep.** The firmware was not rebuilt, because the arduino:samd core is not installed on the Mac.
- **The fleet-platform AWS stack was torn down on 26 Aug and its repo is private,** so the page links to the writing post instead.
- **Ports 3430-3499 and 8430-8499 were used.** All of them are closed now. The `notes-app-showcase` stack is stopped, with its data kept.
- **Guardrails that apply:**
  - g82: no git stash
  - g85: no pkill by name
  - g67: no bare ls
  - g36: bracket pgrep patterns
  - g59 and g26: pass `--timeout` to second_opinion
  - g31: quote push refspecs

## Decisions for Sam

- [ ] GovChat improved version: keep it as a local-only prototype on the page (default), or publish it as its own repo.
- [ ] Fix the imagegen MCP model so real illustrations can be generated, or accept the SVG schematics.
