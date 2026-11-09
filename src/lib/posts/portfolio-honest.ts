import type { Post } from '@/lib/writing'

const SEED_GUARD = `// Refuse unless every DB-like variable points at this machine.
for (const [k, v] of Object.entries(process.env)) {
  if (!/DATABASE|POSTGRES|SUPABASE|DIRECT_URL|PRISMA|MONGO|REDIS|FIREBASE|NEON|TURSO/.test(k) || !v?.includes('://')) {
    continue
  }
  const host = new URL(v).hostname
  if (!['localhost', '127.0.0.1', '[::1]'].includes(host)) {
    throw new Error(\`refusing: \${k} points at \${host}\`)
  }
}`

const WORK_GREP = `grep -n -i -e ontract -e timesheet -e invoice -e client -e billing -e sprint \\
  $S/scripts/seed-shots.ts`

const SEO_LINKED = `// Case studies must be linked from somewhere else, or crawlers can't find them.
const slug = route.match(/^\\/projects\\/([^/[]+)$/)?.[1]
if (slug) {
  const linked = allSource.some(([f, s]) => f !== file
    && (s.includes(\`'/projects/\${slug}'\`) || s.includes(\`"/projects/\${slug}"\`)
      || new RegExp(\`slug:\\\\s*'\${slug}'\`).test(s)))
  if (!linked) {
    fail(file, \`nothing links to /projects/\${slug}; add it to PROJECTS or an ARCHIVE row\`)
  }
}`

export const PORTFOLIO_POST: Post = {
  slug: 'honest-case-studies',
  title: 'How I keep the case studies on this site honest',
  date: '2026-11-09',
  readMin: 8,
  tags: ['portfolio', 'tooling', 'ai-agents'],
  excerpt:
    'Since 25 October I have written or rewritten 36 of the 38 case studies on this site with one routine: run a copy of the project on made-up data where it can, check every sentence against git and the code, let skeptic agents attack the page, and fail the build if the SEO basics are missing. This is the routine, and the claims it took off the site.',
  featured: true,
  content: [
    {
      type: 'paragraph',
      dropCap: true,
      html:
        'A reader has no way to check a portfolio, so it is easy to discount. When I went back over my own project pages in October, several claims did not survive a look at the code. The Kairos page said the app was "in daily use" and placed tasks on a calendar "in under 3 s". The October rebuild is a local prototype that has not been deployed, and nothing I had measured the three seconds. Both claims are gone, and the label on that page now reads "prototype · oct 2026 rebuild".',
    },
    {
      type: 'paragraph',
      html:
        'Since then the case studies have gone through one routine, as far as each project allows. The site has 38 case-study pages, and 36 of them were written or rewritten between 25 October and 9 November. The other two have only had site-wide changes, like the divider removal and the SEO pass, and one corrected date. Claude Code agents do most of the legwork, and I check what they hand back. The routine is written down as a skill file that each session follows, and mistakes it has caught are added to it as rules.',
    },
    { type: 'heading', level: 2, text: 'The routine' },
    {
      type: 'list',
      ordered: true,
      items: [
        'Copy the project into a scratch folder and leave its repo alone.',
        'Run the copy on a local database with made-up seed data.',
        'Take screenshots of the running app with Playwright and, from this week, a short clip of the main flow.',
        'Check every sentence, number and caption against git and the code.',
        'Give the new page to two skeptic agents, one for claims and one for privacy and voice.',
        'Have models from other vendors review the diff.',
        'Build. A prebuild script fails the build if the page breaks the SEO rules.',
      ],
    },
    {
      type: 'paragraph',
      html:
        'Not every page gets every step. The hardware projects show logs and readings from the real boards, and the two school websites get no new screenshots because students appear in them.',
    },
    { type: 'heading', level: 2, text: 'Nothing runs inside the project\'s repo' },
    {
      type: 'paragraph',
      html:
        'I often have uncommitted work sitting in a project, so nothing runs inside it. The agent copies the repo into <code>.claude/tmp/&lt;slug&gt;-shots/app</code> without <code>.git</code>, <code>.env</code> files or <code>node_modules</code>, links <code>node_modules</code> back in, and starts the dev server from the copy. Before and after, it records three numbers in the real repo: <code>git status --short | wc -l</code>, <code>git rev-parse HEAD</code> and <code>git stash list | wc -l</code>. If any of them changed, something touched my work.',
    },
    {
      type: 'paragraph',
      html:
        'The start script runs the server under <code>env -i</code>, so the app sees only the variables the script names. There are no API keys and no remote database URLs. If a screen needs a live AI model and there is no key, that screen stays off the page. The agent never writes fake model output to fill the gap.',
    },
    {
      type: 'paragraph',
      html:
        'The seed script is new for each project and never edits the project\'s own seed. The skill gives a guard for the top of it: unless each database variable points at this machine, the seed refuses to run. Trimmed here; the full version also checks the local database folder:',
    },
    { type: 'code', lang: 'ts', label: 'seed guard from the skill file (trimmed)', code: SEED_GUARD },
    { type: 'heading', level: 2, text: 'Demo data must not look like paid work' },
    {
      type: 'paragraph',
      html:
        'The seed data follows one made-up persona: a final-year computer science student in Melbourne with side projects and a uni cyber-security club. There are no real names or emails. People appear as roles, such as "Lab partner" or "Club committee".',
    },
    {
      type: 'paragraph',
      html:
        'The first run, on Kairos, got this wrong. The seed had items called "Contract: sprint sync" and "Submit timesheet". None of it was real, but on a portfolio it reads as paid work for somebody else, and it showed up in the shots. It was caught late, and every shot was taken again. Now a grep runs over the seed before anything is shot:',
    },
    { type: 'code', lang: 'bash', code: WORK_GREP },
    {
      type: 'paragraph',
      html:
        'It is a blunt check. Run on the Kairos seed today it still matches twice, both on the word <code>client</code> in code: the database client import and the call that closes it. Each hit has to be read and cleared before the shoot, which is the point of it.',
    },
    { type: 'heading', level: 2, text: 'Every sentence gets a verdict' },
    {
      type: 'paragraph',
      html:
        'The fact audit goes through the old page line by line and marks each claim as true now, true of an old build only, false, or unverifiable. A number needs the command that produced it. Anything without evidence comes off. These are some of the changes, each from the site\'s git history:',
    },
    {
      type: 'table',
      headers: ['Page', 'Before', 'After', 'Commit'],
      rows: [
        ['Kairos', '"live · in daily use", "under 3 s"', '"prototype · oct 2026 rebuild"; the speed claim dropped', '<code>a4a5d26</code>'],
        ['R1GPT', 'Deploy: "Vercel · no database"', 'Postgres (Neon) with Drizzle, which the code uses', '<code>595eb90</code>'],
        ['Robot API (SIT331)', 'EF Core in the stack', 'Npgsql, which the final build uses', '<code>8f162e4</code>'],
        ['Hoddle', 'Invites expire after 14 days; 14,040 LinkedIn impressions', '7 days, as the code says; the impressions stat removed (no source)', '<code>418b062</code>'],
        ['GovChat', 'Most of the API commits are mine', 'About half of the API commits, as GitHub shows', '<code>345b7fb</code>'],
        ['Farmers\' Intuition', 'A teammate set up the API repo and I built the rest', 'The teammate wrote the first API: the data, the training and the first rules', '<code>d6e02fa</code>'],
        ['Fleet platform (SIT314)', '"Solo project"; the fleet was the bottleneck', '"Solo" dropped; the fleet "most likely" was, since my counters could not tell an empty fleet from a car another worker took first', '<code>7b3c928</code>'],
      ],
      caption: 'Claims the audit changed or removed. Commits are on the site repo.',
    },
    {
      type: 'paragraph',
      html:
        'The audit can also put a claim back. My resume said a Model UN conference site I built for a school was "used live by 500+ participants". Nothing in the repo supported the number, so it came off. Once I had a source, the school\'s own count, it went back the next day as "used by 500+ participants (the school\'s count)".',
    },
    {
      type: 'paragraph',
      html:
        'A check can also be wrong in the cautious direction. One reviewer flagged the word "freelance" on the page for a school website I built. The work was freelance, so the word stayed.',
    },
    { type: 'heading', level: 2, text: 'Skeptics, then a second reviewer' },
    {
      type: 'paragraph',
      html:
        'Once a page is rewritten, two agents try to break it. The claims skeptic re-runs the counting commands and tries to refute every sentence against the repo and the screenshots. If it finds no evidence, the claim counts as wrong. The privacy and voice skeptic looks for names, emails, anything that hints at paid work, features called AI when the code is rule-based, and the note saying the shots come from seeded data. Six commits on the site are titled as fixes after a skeptic pass. They are mostly small: the bed monitor\'s counters became "after 51 minutes up" instead of "over one 51-minute run", and a model call that "takes two to three seconds" became one that "took two to three seconds when I built it".',
    },
    {
      type: 'paragraph',
      html:
        'Then models from other vendors review the diff against a short list of the content rules. On the batch of illustrations, Codex found nothing, while DeepSeek and Grok found three captions that described something the picture did not show. One picture was redrawn and all three captions were rewritten.',
    },
    { type: 'heading', level: 2, text: 'Real screens, charts from raw data' },
    {
      type: 'paragraph',
      html:
        'The site\'s rules say a generated image is never used as a screenshot or as evidence of what a project does. Screenshots come from the running app, charts are drawn from data, and diagrams are hand-built SVG. Six pages carry a small generated illustration, and each caption starts "Illustration of" so nobody takes it for a screen. Pages with demo shots say once, near the shots, that they come from a local demo with seeded data, and say which build is live. The live Kairos site still serves the April-May build, and its button on the case study reads "earlier build".',
    },
    {
      type: 'paragraph',
      html:
        'Charts follow the same rule. My posts on uni papers used figures exported from the papers as images. I redrew most of them as site charts or tables from the source data. The SIT314 fleet ceiling now comes from the two run CSVs and the RLiG learning curves from the report\'s results file. One RLiG cost figure I dropped instead: two of its bars had no source numbers I could find, and a chart built from the paper\'s Table 1 already showed the timings.',
    },
    { type: 'heading', level: 2, text: 'The build refuses a page search engines can\'t read' },
    {
      type: 'paragraph',
      html:
        '<code>scripts/check-seo.mjs</code> runs before every build, so Vercel will not deploy a page that breaks it. Every page needs a title, a description, a canonical URL that matches its route, full Open Graph data whose image exists in <code>public/</code>, structured data, exactly one <code>&lt;h1&gt;</code>, and alt text on every image. A case study also has to be linked from somewhere else on the site, or crawlers will never find it:',
    },
    { type: 'code', lang: 'js', label: 'scripts/check-seo.mjs (trimmed)', code: SEO_LINKED },
    {
      type: 'paragraph',
      html:
        'It reads the source files as text with regular expressions and does not parse them. On the branch this post is written on it passes on 45 pages.',
    },
    { type: 'heading', level: 2, text: 'What it can\'t catch' },
    {
      type: 'paragraph',
      html:
        'A screenshot from a seeded local copy shows what the code does, but it cannot show that anyone uses it. The audit has a similar limit: it can only check a claim against something written down. A participant count, a placing in a competition or a testimonial is not in any repo. For those the audit has to take an outside word, such as the school\'s own count for the Model UN site, and it cannot check that word.',
    },
    { type: 'heading', level: 2, text: 'What it took' },
    {
      type: 'chart',
      kind: 'bar',
      title: 'Most of the rewrite landed on 28 October',
      subtitle: 'Commits per day that touched a case-study page, its media or src/lib/data.ts, 25 Oct to 8 Nov 2026',
      caption: '66 commits in total. Counted with git log on the site repo, merge commits excluded.',
      xLabel: 'day',
      unit: 'commits',
      categories: ['25 Oct', '26 Oct', '27 Oct', '28 Oct', '29 Oct', '30 Oct', '31 Oct', '1 Nov', '2 Nov', '3 Nov', '4 Nov', '5 Nov', '6 Nov', '7 Nov', '8 Nov'],
      series: [{ name: 'Commits', values: [5, 0, 14, 37, 2, 3, 0, 0, 0, 2, 0, 2, 0, 1, 0] }],
    },
    {
      type: 'paragraph',
      html:
        'Kairos went first, on 25 October, and became the model page. Two batches of pages landed on 28 October, and 37 of the 66 commits are from that day. Since then the work has been smaller: five new pages for older projects on 3 November, and on 5 November a recruiter-style review of the whole site, which cut the featured projects from 15 to 6 and made the Hoddle role read as a past one.',
    },
  ],
}
