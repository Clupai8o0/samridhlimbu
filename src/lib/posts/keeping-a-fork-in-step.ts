import type { Post } from '@/lib/writing'

const RUN_AGENT = `run_agent()
{
    # $1 = task. The agent works only in the private worktree.
    claude -p "$1" \\
        --model "$AGENT_MODEL" --effort low \\
        --permission-mode acceptEdits \\
        --allowedTools "Read" "Edit" "Write" "Grep" "Glob" \\
            "Bash(git:*)" "Bash(npm:*)" "Bash(npx:*)" "Bash(cargo:*)" \\
        --append-system-prompt "You are the unattended updater for a personal fork of MonoCode, working in $WORK. Keep the fork's own features working and take upstream's changes. Never push, never touch files outside $WORK, never delete fork/. If you cannot finish safely, say FAILED and stop."
}`

const LOG = `[2026-10-24 13:10:25] merging 115 upstream commits
[2026-10-24 13:10:25] conflicts: src/app/App.tsx src/app/shell/Sidebar.tsx src/app/shell/TitleBar.tsx
                      src/app/shell/UsageFooter.tsx src/features/files/ui/FileTree.tsx
                      src/features/sessions/ui/Composer.tsx src/features/sessions/ui/SessionPane.tsx
[2026-10-24 13:16:23] staged e46e3be; loads on next open`

export const MONOCODE_POST: Post = {
  slug: 'keeping-a-fork-in-step',
  title: 'Keeping a fork in step with a fast upstream, with an agent doing the merges',
  date: '2026-11-09',
  readMin: 5,
  tags: ['ai-agents', 'git', 'tooling', 'open-source'],
  excerpt:
    'I run my own fork of MonoCode, an open-source desktop app for coding agents. Upstream ships every day, so my fork merges it on its own: a script lets a Claude agent fix conflicts, then runs the type check, about 7,500 tests and a full app build before anything reaches me. In a month it tried 28 merges. Eighteen went through untouched, the agent fixed five sets of conflicts and one broken build, and four were left to me.',
  content: [
    {
      type: 'paragraph',
      dropCap: true,
      html:
        'MonoCode is a desktop app for running coding agents such as Claude Code and Codex side by side. Another developer wrote it and publishes it under the MIT licence. On 7 October I forked it to add things I wanted for my own setup, and by 8 November I had made 578 commits on my branch. Over about the same weeks upstream took 480 commits from its author and 171 from 41 other contributors. If I let my fork fall behind a project moving that fast, each merge would only get harder.',
    },
    {
      type: 'paragraph',
      html:
        'So on the first day I wrote <code>fork/update.sh</code>. My launcher starts it every time I open the app. This post covers how it works, what its log says after a month, and the habits that keep the merges small.',
    },
    { type: 'heading', level: 2, text: 'What the updater does' },
    {
      type: 'list',
      ordered: true,
      items: [
        'Fetch upstream. If nothing is new and my branch has not moved, stop.',
        'Make a private git worktree on a detached copy of my branch, so the checkout I work in is never reset.',
        'Merge upstream. If git stops on conflicts, hand them to a Claude agent with a narrow brief.',
        'Run <code>npm ci</code>, <code>tsc --noEmit</code>, <code>npm test</code> and a full Tauri app build. If that fails after a merge, give the agent one try to fix it.',
        'Move my branch forward only if it is still where the run started, then stage the new app. The launcher swaps it in the next time MonoCode opens.',
      ],
    },
    {
      type: 'paragraph',
      html:
        'A failed merge or build leaves my branch and the installed app as they were and sends a macOS notification. The agent runs headless with a small set of tools: file edits, and git, npm, npx and cargo in the shell. Its brief tells it never to push. The script pushes the branch itself once everything has passed.',
    },
    { type: 'code', lang: 'bash', code: RUN_AGENT },
    { type: 'heading', level: 2, text: 'A month of runs' },
    {
      type: 'paragraph',
      html:
        'The updater writes every run to a log. Between 7 October and 9 November it started 140 times. In 28 runs upstream had something new to merge. Most of the rest either rebuilt and staged my own new commits (69) or found nothing to do (41).',
    },
    {
      type: 'chart',
      kind: 'hbar',
      title: 'Most upstream merges needed no help',
      subtitle: 'Outcome of the 28 runs that merged upstream, 10 Oct to 9 Nov 2026',
      caption: 'Counted from the updater log. One run of the five counted as fixed by the agent (14 Oct) was thrown away because I had moved the branch meanwhile; the next day\'s run merged the same changes.',
      unit: 'runs',
      categories: ['merged and built cleanly', 'conflicts fixed by the agent', 'conflicts left to me', 'build broke, agent fixed it', 'build broke, still failing'],
      series: [{ name: 'Runs', values: [18, 5, 3, 1, 1] }],
    },
    {
      type: 'paragraph',
      html:
        'The biggest run the agent handled alone merged 115 commits on 24 October with seven files in conflict, including the main <code>App.tsx</code>, the sidebar and the composer. From the merge to a staged app took six minutes. Its summary said it took upstream\'s new layout, put my badges, buttons and hidden-feature guards back on top, and that 5,713 tests passed.',
    },
    { type: 'code', lang: 'text', code: LOG },
    {
      type: 'paragraph',
      html:
        'The three it could not finish were one clash, tried again as upstream grew. Upstream and I had both built controls for the same mobile settings screens, so the question was which design to keep, and git markers cannot answer that. I finished it by hand on 3 November with an agent beside me: 63 upstream commits, 166 files changed. Where both sides had built the same control, I kept upstream\'s. I also fixed two breaks the merge left behind: a duplicate test mock, and an import of a component upstream had renamed, which would have thrown as soon as it rendered.',
    },
    {
      type: 'paragraph',
      html:
        'The latest run, on 9 November, merged 11 commits and then failed its tests, and the agent could not fix them. The updater kept the build I had and told me. That merge is still waiting.',
    },
    { type: 'heading', level: 2, text: 'Habits that keep merges small' },
    {
      type: 'table',
      headers: ['Habit', 'Why'],
      rows: [
        ['Fork code in its own folders (<code>src/fork</code>, <code>fork_*.rs</code>)', 'Upstream never edits those files, so they never conflict. Upstream files only get the hooks that call into them.'],
        ['Hide upstream features with a flag, never delete them', 'A deleted file turns every later upstream change to it into a conflict.'],
        ['Fork features switch off under Vitest', 'Upstream\'s tests see the app they were written for, so a red test usually means a real break.'],
        ['Merge often, from the app launch', 'Most runs merged under 25 commits. Small merges conflict less and are easier to check.'],
        ['Branch only moves on a full pass', 'A bad merge never reaches the app I work in.'],
      ],
    },
    {
      type: 'paragraph',
      html:
        'The tests needed one fix first. Upstream\'s suite assumes a US locale and a Node without its own <code>localStorage</code>. On my Mac, in en_AU under Node 26, 325 tests failed on a clean checkout, so the updater sets both before it runs them.',
    },
    { type: 'heading', level: 2, text: 'What I would change' },
    {
      type: 'paragraph',
      html:
        'The agent did well when both sides of a conflict had to survive: it kept upstream\'s change and put mine back on top. It stopped when the two sides had made different design choices for the same screen, which was the only merge it gave up on. A future version could spot that kind of clash early, for example from conflicts spread across one feature folder, and come straight to me instead of trying first.',
    },
    {
      type: 'paragraph',
      html:
        'None of my changes are in upstream, and I have not opened a pull request there. The fork is public on the <code>mine</code> branch of <a href="https://github.com/Clupai8o0/monocode/tree/mine">Clupai8o0/monocode</a>, and there is a <a href="/projects/monocode">case study</a> with screens of the features.',
    },
  ],
}
