import type { Post } from '@/lib/writing'

const RANGE_CODE = `// src/lib/fits.ts, trimmed (... marks cut lines)
async function range(url: string, start: number, length: number, signal?: AbortSignal, allowShort = false)
{
    signal?.throwIfAborted();
    budget(length);
    const response = await fetcher(url, { headers: { Range: \`bytes=\${start}-\${start + length - 1}\` }, signal });
    if (response.status !== 206) {
        ...
        throw new Error(\`Range request requires 206, received \${response.status}\`);
    }
    ...
}

// Reading a box of pixels: only the rows it covers, split across a few parallel requests
const { data } = await range(chunkUrl(index.url, chunk), hdu.dataStart + (box.y0 + first) * width * 4, (last - first) * width * 4, controller.signal);`

export const SLOWSKY_POST: Post = {
  slug: 'slowsky-one-weekend-many-models',
  title: 'Slowsky: one weekend, one person, many models',
  date: '2026-11-18',
  readMin: 11,
  tags: ['slowsky', 'ai-agents', 'astronomy', 'typescript', 'hackathons'],
  excerpt:
    'For NASA Space Apps 2026 I built Slowsky on my own in one weekend: a page that shows a patch of sky on visit after visit by NASA\'s SPHEREx telescope, from real frames read byte by byte out of S3. One Claude Code session ran the build and handed pieces to Claude, Codex and Gemini, with Grok among the reviewers. How the data path works, how the build ran, and the checks that kept the numbers honest.',
  content: [
    {
      type: 'paragraph',
      dropCap: true,
      html:
        'On 14 and 15 November 2026 I entered the NASA Space Apps Challenge on my own, for the Melbourne event, on the challenge called "Planet X and SPHEREx". What I built is Slowsky, a web page that shows a patch of sky on visit after visit by NASA\'s SPHEREx space telescope, in date order, so you can watch it change. It is live at <a href="https://slowsky.clupai.com" target="_blank" rel="noopener noreferrer">slowsky.clupai.com</a>, and the code is on <a href="https://github.com/Clupai8o0/slowsky" target="_blank" rel="noopener noreferrer">GitHub</a> under the MIT licence.',
    },
    {
      type: 'paragraph',
      html:
        'I wrote very little of the code by hand. One Claude Code session ran the build and handed pieces to Claude, Codex and Gemini, with Grok among the reviewers. The rule was that each piece passed its own test and two reviews before it merged. This post covers how a frame gets from NASA\'s archive to the screen, how the build ran, and the checks that kept the page from saying more than the data does. I submitted on Sunday night.',
    },
    {
      type: 'image',
      src: '/projects/slowsky/hero.webp',
      alt: 'Slowsky showing Barnard\'s Star in a SPHEREx frame from 30 August 2025 at 0.85 µm, with Gaia star rings, the tool column on the left and the target notes on the right',
      caption: 'Barnard\'s Star, the fastest-moving star in our sky. The gold ring marks where its catalogue motion puts it on each date.',
    },
    { type: 'heading', level: 2, text: 'Not a planet finder' },
    {
      type: 'paragraph',
      html:
        'The obvious pitch for a challenge called "Planet X and SPHEREx" is a tool that hunts for Planet Nine. I did not build one, and the page says so. Optical searches by ZTF, DES and Pan-STARRS1 have together ruled out about 78% of its predicted range, and what is left is faint, around V 22 (<a href="https://arxiv.org/abs/2401.17977" target="_blank" rel="noopener noreferrer">Brown, Holman and Batygin 2024</a>). SPHEREx reaches 19.5 to 19.9 AB (5 sigma) below 3.8 µm, and only after its two-year survey, with four observations in each channel, away from the Milky Way\'s plane (<a href="https://arxiv.org/abs/2511.02985" target="_blank" rel="noopener noreferrer">Bock et al. 2025</a>). A single frame is shallower still (my reasoning, not the paper\'s). The bands differ, so this is a rough comparison, but the gap is too wide for a weekend\'s tool to close.',
    },
    {
      type: 'paragraph',
      html:
        'So Slowsky is a tool for looking. It shows what changed between visits, and it calls anything that stands out a candidate for a closer look, never a discovery. A change can be noise, a satellite trail or a hit on the detector.',
    },
    { type: 'heading', level: 2, text: 'From the archive to the screen' },
    {
      type: 'list',
      ordered: true,
      items: [
        '<strong>Find the frames.</strong> The page asks NASA\'s Infrared Science Archive (IRSA) which SPHEREx frames cover the spot. IRSA\'s search service does not accept calls from other websites\' pages, so the question goes through a small Vercel function, <code>api/sia.ts</code>. It lets only the DR1 and QR3 releases through.',
        '<strong>Read only the bytes it needs.</strong> The frames are FITS files in NASA\'s public S3 bucket, <code>nasa-irsa-spherex</code>. The page reads each file\'s header and wavelength table, then only the image rows that cover the view, using HTTP range requests. It never downloads a whole file.',
        '<strong>Keep one frame per visit, at one wavelength.</strong> Each part of a SPHEREx detector sees a slightly different wavelength. Frames from one detector are grouped into visits, and for each visit the page keeps the frame closest to the chosen wavelength at that spot. It keeps it only if the chosen wavelength is within half the band the spot sees. Without this, two dates would differ in colour as well as in time.',
        '<strong>Line them up.</strong> The page removes zodiacal light, the glow of sunlit dust in the solar system, using the archive\'s own model stored in each file. Then it resamples every frame onto one grid with north up, from the sky mapping (WCS) in each header. For the preset targets, proper motion is applied for each frame\'s own date.',
        '<strong>Draw.</strong> All frames and the Stack picture share one brightness scale, so a frame that looks brighter has higher values in the data. Subtract gets scales of its own.',
      ],
    },
    {
      type: 'code',
      lang: 'ts',
      label: 'src/lib/fits.ts',
      code: RANGE_CODE,
    },
    {
      type: 'paragraph',
      html:
        'A reply that is not a partial one (status 206) is refused, so a server that ignores the range header cannot send a whole file by accident. The bad-pixel flags needed one more step. They are tile-compressed with RICE, so their raw bytes are not pixel values. The page decodes them with a small RICE decoder written in TypeScript from the FITS tile-compression spec (<code>src/lib/rice.ts</code>).',
    },
    {
      type: 'paragraph',
      html:
        'A live read takes 20 to 45 seconds, which is too long for a first visit. So the five preset targets open from a snapshot saved with the site: 24 real frames each, cut to 112 by 112 pixels, run through the same steps 3 to 5. <strong>Go live</strong> reads the same target from the archive, and if the archive does not answer, a preset falls back to the snapshot. The status line says which one you are looking at.',
    },
    {
      type: 'image',
      src: '/projects/slowsky/brightness-curve.webp',
      alt: 'Slowsky\'s Charts tab for RW Aurigae: a brightness curve relative to two Gaia comparison stars, from +49% to −20%, with a shaded band for the comparison stars\' scatter',
      caption: 'RW Aurigae changes its brightness. The curve divides it by two Gaia comparison stars in the same field. A rough check, not calibrated photometry.',
    },
    { type: 'heading', level: 2, text: 'Tests that compare against astropy' },
    {
      type: 'paragraph',
      html:
        'I cannot see by eye whether a frame is a third of a pixel off. So three tests check the maths against astropy, the standard Python library for astronomy.',
    },
    {
      type: 'table',
      headers: ['Gate', 'What has to hold'],
      rows: [
        ['WCS', 'The page\'s sky mapping matches astropy within 0.01 pixel at 9 points on each of two real frames, in both directions.'],
        ['S3 cutout', 'A box of pixels read from S3 sums to astropy\'s value within 1 part in 1000. This one needs the network, so it runs only on request.'],
        ['Regrid', 'Simulated field stars land within 0.3 pixel of each other and of their true position across dates.'],
      ],
    },
    {
      type: 'paragraph',
      html:
        'The repo has 3,150 tests in 68 files. I ran them again on my laptop on 18 November, while it was short of memory: 3,071 passed, 67 were skipped and 12 failed. All 12 failures were time limits, 9 time-outs and 3 speed checks, not wrong answers. One of them wants 9 frames of 721 by 721 pixels stacked in under 1,500 ms, and took 1,555.',
    },
    { type: 'heading', level: 2, text: 'How the build ran' },
    {
      type: 'paragraph',
      html:
        'The build began after kick-off at 09:00 on Saturday. The first commit landed at 13:23 Melbourne time, the last at 21:18 on Sunday, and I submitted at 23:10. One orchestrator session took each version through the same seven steps:',
    },
    {
      type: 'table',
      headers: ['Step', 'What happens', 'Done when'],
      rows: [
        ['1 Cut', 'Each piece gets a brief: the files it may touch, the shared contract, one test command, a builder', 'The brief is in the repo'],
        ['2 Build', 'One worktree and branch per piece', 'Code and its test are committed'],
        ['3 Gate', 'The orchestrator runs the test itself', 'Exit 0. After 3 failed rounds, a new builder or the piece is cut'],
        ['4 Review', 'The diff goes to two reviewers from different makers', 'Confirmed findings are fixed'],
        ['5 Merge', 'One integrator session merges, in order', 'Tests, typecheck and build pass on main'],
        ['6 Ship', 'Preview deploy, a real-browser check of the 5 targets, screenshots', 'A git tag'],
        ['7 Report', 'A report with screenshots goes to my phone', 'I have the link'],
      ],
    },
    {
      type: 'paragraph',
      html:
        'Step 3 is the one I would keep on any project. A builder saying its test passed does not count. The piece counts when the test passes on the orchestrator\'s own run.',
    },
    {
      type: 'table',
      headers: ['Work', 'Built by', 'Reviewed by'],
      rows: [
        ['Data and back end: S3, the archive proxy, the snapshot, the decoders, the cube', 'Codex (GPT-6.1 Sol, or Terra when short on time)', 'Claude Opus 5.5 at high effort, plus Grok 4.7'],
        ['Maths with a test: WCS, regrid, stack, photometry', 'Claude Sonnet 5.5, then Codex Terra', 'Codex, plus Gemini Argon'],
        ['Glue, page text, card wording', 'Claude Opus 5.5 at high effort', 'Codex, plus Gemini Argon'],
        ['Small parsers and tests', 'Claude Haiku 5.5', 'Codex'],
        ['A whole version before a submit', '', 'Codex at high effort, plus Claude Opus 5.5'],
      ],
      caption: 'The plan from the orchestrator\'s brief. When a model was out of quota, the next one in its row took the piece.',
    },
    {
      type: 'paragraph',
      html:
        'The event terms rule out working with Chinese-owned companies, so DeepSeek, Kimi, Qwen, GLM and MiniMax were off limits. A guardrail blocked them in the Slowsky folders, and every AI tool that touched the product is named in its README, with what it did.',
    },
    {
      type: 'chart',
      kind: 'bar',
      title: 'Commits per three hours',
      subtitle: 'Non-merge commits in the Slowsky repo, Melbourne time. 488 in all.',
      xLabel: 'block starting',
      unit: 'commits',
      categories: ['Sat 12:00', '15:00', '18:00', '21:00', 'Sun 00:00', '03:00', '06:00', '09:00', '12:00', '15:00', '18:00', '21:00'],
      series: [{ name: 'Commits', values: [48, 134, 92, 65, 18, 38, 38, 27, 9, 15, 3, 1] }],
    },
    {
      type: 'paragraph',
      html:
        'The plan froze features at v0.3 on Sunday morning. I did not hold to it. Ten more tagged versions followed. The last, v0.4.0, switched on the sort hint and opened the AI note to everyone, and was tagged at 19:19 on Sunday, under five hours before the close.',
    },
    { type: 'heading', level: 2, text: 'What the reviews caught' },
    {
      type: 'paragraph',
      html:
        '71 of the 488 commit subjects name a review. A typical catch: Codex\'s release review of v0.2 found four problems, and none of them was a crash.',
    },
    {
      type: 'list',
      items: [
        'The brightness chart\'s note said each bar included the star\'s own noise. It did not. The note now says what the bar holds.',
        'A frame with no usable pixels after regridding was drawn blank under a normal label. It is now left out and counted.',
        'When the live read failed and the snapshot had no frames at that colour, the page said SPHEREx had no frames of the spot. It now says the archive could not be reached.',
        'Snapshot requests had no deadline. They now get 15 seconds.',
      ],
    },
    {
      type: 'paragraph',
      html:
        '40 commit subjects mention wording. On a page people read as fact, a sentence that says more than the data is a bug too, and the reviews treated it as one.',
    },
    {
      type: 'image',
      src: '/projects/slowsky/comet-co2.webp',
      alt: 'Slowsky\'s Extras tab: twelve small SPHEREx pictures of comet 3I/ATLAS from 3.96 to 4.36 µm, and a chart whose value peaks at 4.25 µm',
      caption: 'Comet 3I/ATLAS in twelve SPHEREx frames. It lights up at 4.25 µm, where the SPHEREx team reports carbon dioxide gas. The card redraws public frames with rough numbers and adds nothing new to that work.',
    },
    { type: 'heading', level: 2, text: 'A source for every claim' },
    {
      type: 'paragraph',
      html:
        'The repo\'s <a href="https://github.com/Clupai8o0/slowsky/blob/main/SOURCES.md" target="_blank" rel="noopener noreferrer">SOURCES.md</a> has 147 rows in 12 tables. Each row takes a claim from the README, the page text, the target cards or the AI prompt, and gives the file that makes it and the source behind it. Numbers the page measures itself are left to the code and its tests. Claude Opus 5.5 checked them with the sources open. Gemini Argon then read the claims with no web access and marked what it judged wrong, and Claude checked each mark against a fetched page or the repo\'s own files before anything changed. Codex checked that each row points at a file that really makes the claim, and Codex and Grok each opened the sources for 15 rows themselves.',
    },
    {
      type: 'paragraph',
      html:
        'All of those checks were run by AI tools. No person has gone through the list line by line, and the file says so in its first section.',
    },
    {
      type: 'paragraph',
      html:
        'The page also has an AI note. Claude Opus 5.5 writes a few lines on what the page measured, from a fact sheet the page builds itself. A checker, <code>checkNote</code>, keeps only sentences that match a fixed list of sentence forms filled with the sheet\'s words and numbers, and drops every other sentence. It is a filter, not a proof: it checks the note against the sheet, not the measurements behind it. The note is open to every visitor, with a limit of 15 new notes a day per network address.',
    },
    { type: 'heading', level: 2, text: 'One call against the reviewers' },
    {
      type: 'paragraph',
      html:
        'A small neural network puts a sort hint under each candidate change on a live view: does this look like something moving, something changing brightness, a camera effect or noise? It was trained only on fake changes added to single real frames, and it never saw two real dates. In tests that held one field out of training at a time, it labelled only 55% of the fake movers whose peak was 3 to 5 times the noise as moving.',
    },
    {
      type: 'paragraph',
      html:
        'Reviews by Gemini and Claude Opus both said its lines could mislead, because the squares the page hands it are not the kind it learned from, and both advised against switching it on. I switched it on anyway. Each line carries the label "Experimental sort hint, trained only on fake changes added to single frames. Never tested on real two-date changes. Not a verdict." The README sets out why it may mislead. It is shown so a visitor can see it and judge it, as a guess about where to look first, never as an answer.',
    },
    { type: 'heading', level: 2, text: 'What I would keep' },
    {
      type: 'list',
      items: [
        'A test the orchestrator runs itself, not a builder\'s word that it passed.',
        'Two reviewers from different makers on every diff.',
        'A source list written while building, not after.',
        'Limits on the page, in plain words, next to the feature they limit.',
      ],
    },
    {
      type: 'paragraph',
      html:
        'Try it at <a href="https://slowsky.clupai.com" target="_blank" rel="noopener noreferrer">slowsky.clupai.com</a>, or read the <a href="/projects/slowsky">case study</a>.',
    },
  ],
}
