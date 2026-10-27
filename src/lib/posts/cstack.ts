import type { Post } from '@/lib/writing'

const QUICK_START = `git clone https://github.com/Clupai8o0/cstack ~/clupai
cd ~/clupai
./install.sh                       # prints the plan, changes nothing
./install.sh --yes --settings      # links rules, skills, output style; merges hooks into ~/.claude/settings.json
export CLUPAI_HOME=~/clupai        # add to your shell profile`

export const CSTACK_POST: Post = {
  slug: 'cstack-one-layer-six-agents',
  title: 'cstack: one layer for six coding agents, and what I measured while tuning it',
  date: '2026-10-27',
  readMin: 14,
  tags: ['ai-agents', 'tooling', 'benchmarks', 'python'],
  excerpt:
    'cstack is the shared set of rules, hooks and skills that six coding-agent CLIs use on my Mac, so parallel sessions stop editing the same files and starting the same stacks. Most of its token rules come from benchmarks on my own work. The biggest single saving was effort: Opus 5 subagents at low effort cost $0.33 a task against $0.90 at extra-high, and still scored 96-100% on every task.',
  featured: true,
  content: [
    {
      type: 'paragraph',
      dropCap: true,
      html:
        'I usually have several coding-agent sessions open on the same repos at once, across two Claude Code accounts and a handful of other CLIs, and I check on most of them from my phone. Without shared rules they tripped over each other\'s files, started duplicate Docker stacks and burned quota on work a cheaper model could do. cstack is what I built to stop that. It is the setup I run every day, public under the MIT licence, and I did not design it as a framework for other people.',
    },
    {
      type: 'paragraph',
      html:
        'Everything in it does one of three jobs. It keeps parallel sessions out of each other\'s way, it spends fewer tokens, and it lets me work from my phone. This post covers the first two, and the numbers behind the second.',
    },
    { type: 'heading', level: 2, text: 'One folder, six agents' },
    {
      type: 'paragraph',
      html:
        'The six agents are Claude Code, Codex, OpenCode, dsh (DeepSeek\'s CLI), kimi and Grok Build. Each loads rules, skills and hooks its own way. The aim was one source of truth in six formats, without six copies to keep in sync by hand.',
    },
    {
      type: 'image',
      src: '/writing/cstack/layer.svg',
      mobileSrc: '/writing/cstack/layer-m.svg',
      alt: 'Diagram of the cstack folder, holding rules/CLAUDE.md, agents/*/DELTA.md, hooks, core skills, mods and model-policy.json. Claude Code gets the rules by symlink. scripts/sync-agents.py sends AGENTS.md, skills and hooks to Codex, OpenCode, dsh and kimi. Grok Build reads Claude\'s files itself and gets only a DELTA.md. The same hooks run in all six agents.',
      caption: 'One folder feeds all six agents. Claude Code by symlink, four CLIs through sync-agents.py, and Grok Build through its own Claude compatibility plus a DELTA.md.',
    },
    {
      type: 'paragraph',
      html:
        'Claude Code gets the global rules through a symlink that <code>install.sh</code> makes, and <code>scripts/sync-agents.py</code> wires up the other five. For Codex, OpenCode, dsh and kimi it generates an <code>AGENTS.md</code> from the shared rules plus a short <code>DELTA.md</code> for that agent, then links their skills and hook config. Grok Build reads Claude\'s files itself, so it gets only its <code>DELTA.md</code>. Because the agents link to one folder, one edit reaches all of them, and <code>sync-agents.py --check</code> shows any drift.',
    },
    {
      type: 'paragraph',
      html:
        'The coordinating is done by 12 hooks, all written in Python, which Claude Code runs natively. Codex, OpenCode, dsh, kimi and Grok Build run the same scripts through <code>agent_hook.py</code>, an adapter for their hook events. State lives in small JSON files with file locks. There is no server to run.',
    },
    {
      type: 'table',
      headers: ['Hook', 'What it does'],
      rows: [
        ['<code>claims.py</code>', 'Claims each file a session edits, blocks a second session in the same worktree and warns across worktrees. Also keeps status notes and their history.'],
        ['<code>queues.py</code>', 'Gives one session at a time a turn on a shared target, like a staging deploy or a merge.'],
        ['<code>guardrails.py</code>', 'Checks commands and edits against rules learned from earlier failures.'],
        ['<code>stacks.py</code>', 'Shares one Docker stack, simulator or emulator between sessions by lease.'],
        ['<code>memory_guard.py</code>', 'Blocks new agents and heavy commands when the Mac is low on memory.'],
        ['<code>memory_recall.py</code>', 'Adds only the memories that match the prompt, from every account.'],
        ['<code>effort_gate.py</code>', 'Makes the model state the effort a task needs, and ask to change it early in a session.'],
        ['<code>reset.py</code>', 'Lets a long session clear or compact its own context at a break point.'],
        ['<code>alerts.py</code>', 'Plays a sound and shows a notification when a session finishes or needs me. A question left 5 minutes goes to the phone app.'],
        ['<code>session_mirror.py</code>', 'Every 15 seconds, copies session entries between Claude accounts so their sessions can message each other.'],
        ['<code>agent_hook.py</code>', 'Lets the five outside CLIs run the same hooks.'],
        ['<code>codex_hook.py</code>', 'A 9-line shim to <code>agent_hook.py</code> for Codex.'],
      ],
    },
    {
      type: 'paragraph',
      html:
        'The repo is mostly Python, with 9,607 lines across 24 files. Its only shell script is <code>install.sh</code>, at 197 lines. Of the hooks, the biggest are <code>stacks.py</code> (1,077 lines), <code>claims.py</code> (898), <code>alerts.py</code> (870) and <code>agent_hook.py</code> (768).',
    },
    { type: 'heading', level: 2, text: 'Keeping sessions out of each other\'s way' },
    {
      type: 'paragraph',
      html:
        'The first problem was two sessions editing one file. <code>claims.py</code> runs before every edit. It records which session is editing which file in <code>claude-claims.json</code>, inside the repo\'s git common dir, so every worktree and every account reads the same list. A second session that tries to edit a claimed file in the same worktree is blocked. From a different worktree it gets a warning instead.',
    },
    {
      type: 'image',
      src: '/writing/cstack/claims.svg',
      mobileSrc: '/writing/cstack/claims-m.svg',
      alt: 'Timeline in five steps. Session A edits a file and claims it in claude-claims.json in the git common dir. Session B tries the same file, reads the claim and is blocked; from another worktree it would only get a warning. The sessions exchange one handoff over SendMessage covering what is done, the branch, files, tests and what is left. A releases the claim, and B\'s edit is allowed.',
      caption: 'Two sessions, one file. B is blocked, the two exchange one handoff, A releases its claim, and then B can edit.',
    },
    {
      type: 'paragraph',
      html:
        'A blocked session can message the one holding the claim, because each name in <code>claims.py list</code> is a <code>SendMessage</code> address. The rules ask for one handoff covering what is done, the branch, the files, the tests and what is left. The session with less done hands over, releases its claims and moves on, and if the two cannot agree within two messages they ask me.',
    },
    {
      type: 'paragraph',
      html:
        'Each session also keeps a status note. Every note is logged with its time and the files edited, so a new session can search the history for whether something was already done or tried. As of 27 Oct 2026, this site\'s repo has 68 logged events from 10 sessions since 23 Sep: 61 notes, 6 session ends and 1 release.',
    },
    {
      type: 'paragraph',
      html:
        'Two hooks handle shared things that are not files. <code>queues.py</code> gives one session at a time a turn on a target like a staging deploy. <code>stacks.py</code> leases Docker stacks, simulators and emulators. A session that asks for a stack another session already has up reuses it, so there is never a second copy. A launchd reaper runs every 10 minutes and stops stacks nobody has leased for 45 minutes.',
    },
    { type: 'heading', level: 2, text: 'Turning failures into rules' },
    {
      type: 'paragraph',
      html:
        'Some mistakes repeat across sessions. One session runs <code>git stash</code> on a repo other sessions are working in, and their uncommitted work goes into the stash with its own. Writing that down in one session\'s memory protects that session. A guardrail protects every session that comes after.',
    },
    {
      type: 'image',
      src: '/writing/cstack/guardrail-loop.svg',
      mobileSrc: '/writing/cstack/guardrail-loop-m.svg',
      alt: 'A four-step loop. 1: it breaks once, for example git stash took the uncommitted work of other live sessions. 2: it becomes a rule, written by guardrails.py learn into guardrails.json, with the action warn, STOP, queue or deny. 3: every session checks each command and edit before it runs, in all six agents. 4: on STOP, check the case; if it applies, fix it or tell the user; if it does not, ack with what was checked and retry. A dashed arrow leads from step 4 back to step 1 for the next failure.',
      caption: 'A failure becomes a rule that every later session checks before it runs a command or edits a file.',
    },
    {
      type: 'paragraph',
      html:
        '<code>guardrails.py learn</code> writes a rule into <code>guardrails.json</code>. A rule has a pattern that matches a command or a file path, an action (warn, stop, queue or deny), and a reason that says what could break and what to do instead. <code>claims.py</code> checks every command and edit against the rules before it runs. A stop asks for a check. If the edge case applies, the session fixes it or tells me what could break. If it does not, the session acks the rule with what it checked and tries again. When a risky command fails, <code>claims.py</code> suggests a new rule.',
    },
    {
      type: 'table',
      headers: ['Guardrails on my machine, as of 27 Oct 2026', 'Count'],
      rows: [
        ['Learned between 18 Sep and 27 Oct 2026', '85'],
        ['Still active', '76'],
        ['Retired', '9'],
        ['Active: warn', '38'],
        ['Active: stop', '31'],
        ['Active: queue', '7'],
        ['Active: deny', '0'],
        ['Matching a command (the rest match a file path)', '80 of 85'],
        ['Sum of every rule\'s hit counter', '2,342'],
      ],
    },
    {
      type: 'paragraph',
      html:
        'The rules say to retire a rule that turns out wrong, and 9 have been retired so far. None of the active rules is a deny.',
    },
    { type: 'heading', level: 2, text: 'Spending fewer tokens' },
    {
      type: 'paragraph',
      html:
        'The routing rules in cstack come from two tests I ran on my own work in September and October 2026: a routing benchmark and a bake-off on real commits. Cost is API list price, standing in for plan usage. A few rules rest on estimates instead of runs, and the README marks those.',
    },
    { type: 'heading', level: 3, text: 'Effort mattered more than the model' },
    {
      type: 'paragraph',
      html:
        'The routing benchmark had five tasks built from real study and open-source work, with planted bugs and defects so they could be scored. They were a fact-check of 18 claims, a bug fix with 29 hidden tests, an audit of 13 subtle claims, a PR review with 4 planted defects, and a mentor update judged blind. I ran 23 setups, two runs each, and Opus 5 and Codex judged the results blind. Their writing rankings matched closely (correlation 0.9).',
    },
    {
      type: 'chart',
      kind: 'bar',
      title: 'Extra-high effort cost 2.7x as much per task as low',
      subtitle: 'Opus 5, mean cost per task at API list price, 5 tasks, 2 runs each, lower is better',
      xLabel: 'effort',
      unit: 'USD',
      categories: ['low', 'medium', 'high', 'extra-high'],
      series: [{ name: 'Cost per task', values: [0.33, 0.42, 0.53, 0.9] }],
    },
    {
      type: 'table',
      headers: ['Opus 5 effort', 'Fact-check', 'Bug fix', 'Audit', 'Review', 'Writing /10', '$ per task'],
      rows: [
        ['low', '100%', '100%', '96%', '100%', '8.0', '0.33'],
        ['medium', '100%', '100%', '100%', '100%', '7.8', '0.42'],
        ['high', '100%', '100%', '100%', '100%', '8.8', '0.53'],
        ['extra-high', '100%', '100%', '100%', '100%', '6.8', '0.90'],
      ],
    },
    {
      type: 'paragraph',
      html:
        'Low effort lost 4 points on the audit task and nothing on the other three, while writing went the other way: extra-high scored 6.8 against 8.0 at low, and high effort wrote best at 8.8. A subagent inherits the session\'s effort unless it is given a <code>model</code> and <code>effort</code> of its own. A session running at extra-high runs every subagent it spawns at extra-high too, for 2.7 times the cost and no meaningful gain. So cstack pins subagents at low effort and keeps high effort for text a person reads.',
    },
    {
      type: 'paragraph',
      html:
        'I used to describe the 2.7x as a model-routing saving, and that was wrong. It is one model at two effort levels. It was also measured on Opus 5. Opus 5.5 has since replaced it as my main worker and I have not re-run the benchmark, so these numbers are Opus 5\'s. One more setup from the same run ruled out a common pattern, where a cheap model does the work and Opus reviews it. That scored 100% but cost $0.78 a task, against $0.33 for Opus 5 at low effort alone.',
    },
    { type: 'heading', level: 3, text: 'The bake-off on real commits' },
    {
      type: 'paragraph',
      html:
        'The benchmark tasks were small, 3 to 60 steps each. For the bake-off I took 10 tasks from the git history of one production React Native + Firebase app. Six were short, four were long, and one touched 20 files. I checked that each task\'s tests failed before the real commit and passed after it. Each model did each task once.',
    },
    {
      type: 'chart',
      kind: 'bar',
      title: 'The same 10 tasks cost $1.44 on Haiku and $26.95 on Fable',
      subtitle: 'Total cost of 10 real app tasks, lower is better. Every model shown passed all 10. Haiku and Sonnet are 5.5 at low effort; "Opus low" and "Opus high" are Opus 5.5',
      caption: 'DeepSeek V4 Flash and Kimi K3 costs are approximate (about $1.50 and $14.70).',
      xLabel: 'model',
      unit: 'USD',
      categories: ['Haiku', 'DeepSeek', 'Sonnet', 'Opus low', 'Kimi K3', 'Opus high', 'Opus 5', 'Fable'],
      series: [{ name: 'Cost of 10 tasks', values: [1.44, 1.5, 4.78, 8.22, 14.7, 16.12, 20.6, 26.95] }],
    },
    {
      type: 'paragraph',
      html:
        'Every model in that chart passed 10 of 10. Some outside it did not: Gemini 3.8 Flash and GLM-5.3 passed 9, and DeepSeek V4 Pro passed 7. The tasks were too easy to separate the top models on pass rate, so cost, time and code quality decided. From cheapest to dearest is about 19x. Sonnet 5.5 at low effort did the 10 tasks for 58% of what Opus 5.5 low cost. Opus 5.5 low cost about half of Opus 5.5 high, with the same pass rate and a code-quality score of 32 against 31, where lower is cleaner.',
    },
    {
      type: 'paragraph',
      html:
        'The cheap models came with catches. Haiku 5.5 gets 5 times dearer past a 100k-token prompt, and it was slow on long tasks, taking 30 minutes on one where Sonnet took 8. DeepSeek V4 Flash wrote 34-54% more defects than Claude in a blind quality review, so its code always gets a review pass. On AA-Omniscience, a public test rather than one of mine, it gave a wrong answer instead of "don\'t know" 96.5% of the time. It never writes factual prose for me.',
    },
    {
      type: 'paragraph',
      html:
        'On 10 and 11 Oct I also tried mixing Claude models. Every mix passed 10 of 10, so mixing bought no extra passes, and most of them cost more.',
    },
    {
      type: 'table',
      headers: ['Setup (all passed 10 of 10)', 'Cost of 10 tasks', 'Time'],
      rows: [
        ['Sonnet 5.5 low alone', '$4.78', '32 min'],
        ['Opus directs Haiku', '$4.89', '30 min'],
        ['Opus directs Sonnet + Haiku', '$6.73', '26 min'],
        ['Opus plans, Haiku codes', '$12.44 (92% of it Opus)', '65 min'],
        ['Haiku low with an Opus advisor', '$3.10', '61 min'],
        ['Same, plus a reminder to consult the advisor', '$12.84', '70 min'],
        ['Opus plans, Sonnet codes', '$16.38', '69 min'],
      ],
    },
    {
      type: 'paragraph',
      html:
        'Having Opus plan for a cheaper coder added $8-12 for nothing. The advisor setup was cheap until I added a reminder to consult Opus, after which Haiku consulted it on most turns and the cost went from $3.10 to $12.84. So one cheap model on its own is the default. An Opus lead directing cheaper subagents is worth it only when speed matters.',
    },
    {
      type: 'image',
      src: '/writing/cstack/routing.svg',
      mobileSrc: '/writing/cstack/routing-m.svg',
      alt: 'Diagram of which model takes which kind of job in cstack: Sonnet 5.5 at low effort for coding a test decides, or Haiku 5.5 low for a short job; Opus 5.5 at low effort as the main worker; Opus 5.5 at high effort for text people read, reviews and judging; Fable 5.1 for the hardest coding; DeepSeek V4 Flash for bulk work on open or personal folders, followed by a review pass; then Codex reviews the diff of every code change.',
      caption: 'Where each kind of job goes, after the benchmark and the bake-off.',
    },
    {
      type: 'paragraph',
      html:
        'Opus 5.5 at low effort is the main worker, and the same model at high effort writes anything a person reads and does the final reviews. Sonnet 5.5 or Haiku 5.5 at low effort take coding where a test decides pass or fail. Fable 5.1 only gets the hardest coding. DeepSeek V4 Flash takes bulk work, always followed by a review.',
    },
    {
      type: 'paragraph',
      html:
        'Outside models are called through one script, <code>second_opinion.py</code>, which applies a policy per folder. Confidential folders get Codex only. Open folders also allow DeepSeek, Kimi and OpenCode, and personal folders add Gemini and Grok Build. Any folder not listed counts as confidential. Because the script reads the policy from the working directory, the calling agent cannot pick its own. Outside CLIs run inside a macOS <code>sandbox-exec</code> profile, and Codex uses its own sandbox.',
    },
    { type: 'heading', level: 3, text: 'Context size' },
    {
      type: 'paragraph',
      html:
        'Long sessions cost more per call. By my estimate, a call at 600-900k tokens of context costs about 3 times one at 200k, $0.38 against $0.13. In the week to 23 Sep, 59% of my Claude spend went on calls past 200k. After I turned on auto-compact at 250k in every account, the share over the four weeks to 24 Oct was 10-14%. That is a before and after, not a controlled test, so I cannot say auto-compact alone caused the drop.',
    },
    {
      type: 'paragraph',
      html:
        'Two smaller findings shaped the rules. At 563k, <code>/compact</code> cost $0.81 and <code>/clear</code> with a written handoff cost $0.69, so I pick the handoff when another session might continue the work. And 10 long agents were 71% of my past Opus usage, so agents stay short. <code>reset.py</code> lets a long session in kitty clear or compact its own context at a break point. It writes a handoff first, and the fresh context starts from it.',
    },
    { type: 'heading', level: 2, text: 'Reviews on the diff' },
    {
      type: 'paragraph',
      html:
        'Since 21 Oct every code change gets a Codex review before it counts as done. <code>second_opinion.py --review</code> puts the git diff in the prompt with a brief that asks for findings only, so the reviewer stays on the change and does not explore the repo. Before that, in September, 302 Codex reviews through MCP used 267M input tokens, a median of 553k each. Those were Codex tokens on its own plan, which is why reviews cost almost no Claude usage. I have no after-measurement for the diff-only version yet.',
    },
    {
      type: 'image',
      src: '/writing/cstack/review.svg',
      mobileSrc: '/writing/cstack/review-m.svg',
      alt: 'Six steps of a review. 1: git diff, only the change. 2: second_opinion.py --review adds a findings-only brief. 3: model-policy.json decides which models may see the folder: Codex only for confidential folders, more for open and personal ones. 4: outside CLIs run under sandbox-exec, and Codex uses its own sandbox. 5: a fallback ladder tries Codex first and moves to the next route if it fails or is out of quota. 6: the findings go back to the session, which fixes what it confirms.',
      caption: 'The reviewer gets only the diff and a findings-only brief, through the same policy, sandbox and fallback as every outside call.',
    },
    {
      type: 'paragraph',
      html:
        'To pick reviewers I used 5 real changes whose tests passed but which held 17 bugs that a later review caught. Each reviewer\'s findings were graded blind.',
    },
    {
      type: 'chart',
      kind: 'bar',
      title: 'Opus 5.5 at high effort found the most bugs',
      subtitle: 'Bugs found of 17 known bugs across 5 real changes, first run, Opus grader, higher is better',
      caption: 'Second runs: Opus 5.5 high found 9, Fable 5.1 found 4. Gemini 4 Argon found 10 and then 8, at about twice the price, and is not routed. Sonnet and GPT-6.1 Sol were tested but are not used as reviewers.',
      xLabel: 'reviewer',
      unit: 'bugs',
      categories: ['Opus 5.5', 'DeepSeek', 'GLM-5.3', 'Grok 4.7', 'Sonnet', 'Fable', 'Astra', 'Kimi K3', 'GPT-6.1'],
      series: [{ name: 'Bugs found of 17', values: [10, 9, 8, 7, 6, 6, 5, 4, 3] }],
    },
    {
      type: 'paragraph',
      html:
        'Opus 5.5 at high effort found 10 and 9 over its two runs, for about $4.35 per 5 reviews, while Fable 5.1 found 6 and 4 for about $11.80. Opus found 4-5 bugs Fable missed and Fable found none that Opus missed, so Opus 5.5 took over as the Claude reviewer. Codex\'s reviewer, GPT-6 Astra, found 5, one of which no other model found. It still reviews every change because it runs on Codex\'s plan and costs almost no Claude usage. Today the review trio is DeepSeek V4 Flash, Opus 5.5 and Astra.',
    },
    {
      type: 'paragraph',
      html:
        'The worst result was on security. Of 5 known bugs in database security rules, 4 went unfound by every model. Those rules still need a person to read them.',
    },
    { type: 'heading', level: 2, text: 'What I got wrong, and the limits' },
    {
      type: 'list',
      items: [
        '<strong>Small samples.</strong> The benchmark was 5 tasks with 2 runs per setup, of 3 to 60 steps, not 300-step jobs. The bake-off ran each task once per model on one app. Code-quality scores were one run each and noisy.',
        '<strong>One person\'s data.</strong> My tasks, my app and my habits. Judges also tend to favour their own model family. I would not expect the numbers to carry over to someone else\'s work unchanged.',
        '<strong>Opus 5, not 5.5.</strong> The effort numbers are Opus 5\'s. The bake-off has Opus 5.5 low at about half the cost of high with the same pass rate, which points the same way, but I have not re-run the five benchmark tasks.',
        '<strong>Some rules are estimates.</strong> The cost of long context, the 30-50k setup tokens every agent pays, and the ~7.5k-token skill listing are estimates, and the README marks them as such.',
        '<strong>macOS first.</strong> The sandbox uses <code>sandbox-exec</code>, the memory guard reads macOS stats, and alerts use macOS sounds and kitty. On Linux the memory guard does nothing and the sandboxed routes fail.',
        '<strong>Hooks fail open.</strong> A broken hook never blocks work, except a deliberate deny, and <code>claims.py</code> gives up on a lock after 3 seconds. So a broken hook fails silently, and it is worth checking that <code>claims.py list</code> works after install. There are no tests or CI for the hooks yet, though both are on the roadmap.',
        '<strong>Prices age fast.</strong> Every number here is from September and October 2026.',
      ],
    },
    { type: 'heading', level: 2, text: 'Trying it' },
    {
      type: 'paragraph',
      html:
        'Clone the repo and run <code>install.sh</code>. With no flags it prints its plan and changes nothing.',
    },
    {
      type: 'code',
      lang: 'bash',
      label: 'Quick start, from the README',
      code: QUICK_START,
    },
    {
      type: 'paragraph',
      html:
        'It replaces <code>~/.claude/CLAUDE.md</code> with a link to the shared rules and backs up the old file next to it. <code>--no-rules</code> keeps your own file instead. Edit <code>model-policy.json</code> before you call any outside model, since unlisted folders count as confidential. For your own numbers, <code>bakeoff/</code> is a generic harness that runs a bake-off on your repo\'s history.',
    },
    {
      type: 'paragraph',
      html:
        'The code is at <a href="https://github.com/Clupai8o0/cstack" target="_blank" rel="noopener noreferrer">github.com/Clupai8o0/cstack</a>, and the <a href="/projects/cstack">project page</a> has the short version.',
    },
  ],
}
