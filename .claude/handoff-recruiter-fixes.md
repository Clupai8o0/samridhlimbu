# Handoff: recruiter fixes (5 Nov 2026)

Branch `mc/can-you-bring-up-a-bunch-of-models-to-cr-1b0399`, commit 598c596, not pushed.
Worktree: `~/Documents/projects/samridhlimbu-worktrees/mc-can-you-bring-up-a-bunch-of-models-to-cr-1b0399`.

## Done
- Fixes 1–5 and 8 from the 5-model critique (`.claude/tmp/critique/summary.md`, git-ignored), with the featured picks agreed in a grilling session.
- tsc, eslint, check:seo and `npm run build` pass. Resume PDF is still 2 pages, same as live.
- Opus 5.5 high-effort review: 5 findings, all fixed in the commit.

## Left, in order
1. **Codex review** (required; both logins were out of quota until ~08:43 / 09:12):
   `CODEX_HOME=~/.codex-plus python3 ~/Documents/Obsidian/brain/skills/_core/token-economy/scripts/second_opinion.py .claude/tmp/critique/review-focus.md --cwd "$PWD" --review --base origin/main --ladder codex --timeout 1500 < /dev/null`
2. Look at the home hero and /projects in a browser (Chrome wasn't connected). Check the 4 proof tiles and the Hoddle card status fit.
3. Push, open a PR, merge (Sam's call).
4. Jan 2027: DSEC handover. Change "Jun 2025–present" everywhere (list in project memory `sam-role-dates`).

## Not done (not chosen)
- Fix 7: terminal touches on the first screen and the Instagram/X links in the hero.
- Resume "Research papers" heading, WAM shown as "~87".

## Risks and guardrails
- The worktree folder isn't in `model-policy.json`, so DeepSeek and Grok refuse to run here. Only Codex works until `samridhlimbu-worktrees` is added as personal.
- g94: pass `< /dev/null` to second_opinion.py. g82: no `git stash`.
