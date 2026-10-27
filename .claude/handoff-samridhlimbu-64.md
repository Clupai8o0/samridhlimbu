# Handoff: samridhlimbu-64 (27 Oct 2026)

All work is committed, pushed to main and live. Nothing of mine is uncommitted.

## Done
- Uni papers (SIT314, RLIG, Where Is the Algorithm) are writing posts, `featured: true`; /writing lists newest first (a011a1e).
- Article chart block: `{ type: 'chart', kind: 'bar'|'line', title, subtitle?, caption?, xLabel?, unit?, yMin?, categories, series }` in src/lib/writing.ts, drawn by src/components/article-chart.tsx. 3 demo charts in the SIT314 and RLIG posts (a011a1e).
- Review fixes from Codex, DeepSeek, Muse, Grok (a011a1e, ae823b9). Gridlines and baseline removed, Sam's no-dividers rule (7d0d303).
- Earlier: dividers removed site-wide (ae0ab5e), timeline lines removed (0ba66f4). Full detail in .claude/handoff.md.

## Left, in order
1. Nothing required.
2. Optional (Sam's checklist): make the SIT314 repo public.

## Branch and commands
- Branch `case-studies-cstack-morgue`; main is fast-forwarded to it.
- Deploy: `git merge-base --is-ancestor origin/main HEAD && git push origin case-studies-cstack-morgue case-studies-cstack-morgue:main`.
- Vercel status: `gh api repos/Clupai8o0/samridhlimbu/commits/<sha>/status --jq .state`.

## Open risks
- The full build failed at 22:55 on another session's half-done src/app/projects/load-balancer/page.tsx (`__STRATEGY_ROWS__` placeholder). That is samridhlimbu-89's work, not mine; it must be finished before their next push.
- Guardrails: g82 (no git stash), g85 (no pkill; kill by PID). Stage by file name; never AGENTS.md, CLAUDE.md or .claude/.

## Decisions pending for Sam
- None. Newest-first kept; gridlines removed as asked.
