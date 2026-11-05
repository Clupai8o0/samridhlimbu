# Handoff: recruiter fixes (5 Nov 2026)

Branch `mc/can-you-bring-up-a-bunch-of-models-to-cr-1b0399`, merged straight into main (no PR, owner's call).
Worktree: `~/Documents/projects/samridhlimbu-worktrees/mc-can-you-bring-up-a-bunch-of-models-to-cr-1b0399`.

## Done
- Fixes 1–5 and 8 from the 5-model critique (`.claude/tmp/critique/summary.md`, git-ignored), with the featured picks agreed in a grilling session.
- tsc, eslint, check:seo and `npm run build` pass. Resume PDF is still 2 pages, same as live.
- Reviews: Opus 5.5 high (5 findings, fixed), Grok 4.7 (2 findings, fixed), Codex (no findings). DeepSeek was out of credit.

## Left, in order
1. Look at the home hero and /projects on the live site (Chrome wasn't connected). Check the 4 proof tiles and the Hoddle card status fit.
2. Jan 2027: DSEC handover. Change "Jun 2025–present" everywhere (list in project memory `sam-role-dates`).
3. Top up DeepSeek credit if you want it back as a review pass.

## Also done (10482eb)
- Fix 7: home drops `cat ~/readme.md`, the rotating verb (fixed "Open to work · Melbourne") and `v0.1` (gone site-wide); X/Instagram left the hero (still in footer and command palette).
- Resume heading "Research papers" is now "Coursework papers". Codex and Grok: no findings.

## Not done
- WAM still "~87": the exact figure isn't recorded anywhere. Sam to supply it.

## Risks and guardrails
- `samridhlimbu-worktrees` is now personal in `model-policy.json` (5 Nov 2026), so every reviewer can run in worktrees.
- g94: pass `< /dev/null` to second_opinion.py. g82: no `git stash`.
