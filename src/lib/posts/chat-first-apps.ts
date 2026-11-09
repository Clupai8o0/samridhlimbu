import type { Post } from '@/lib/writing'

// nomnom lib/server/mcp.ts, the schema for one item of a log_meal call
const NOMNOM_ITEM = `const item = z.object({
  food_id: z.string().optional(),
  free_text: z.string().optional(),
  quantity: z.number().positive(),
  unit: z.enum(Unit).describe("G and ML are exact. PIECE, SERVING, CUP, TBSP, TSP, OZ are converted using the food's own portion data."),
  source: z.enum(ItemSource),
});`

// glow-up packages/core/src/meals.ts, branch mc/build-backend-infra-f5dfd6
const GLOWUP_MEAL = `export const mealInputSchema = z.strictObject({
  member: id,
  time: z.iso.datetime({ offset: true }),
  description: z.string().trim().min(1).max(2000),
  kcal_estimate: z.number().min(0).max(100_000),
  protein_estimate: z.number().min(0).max(10_000),
  source: sourceSchema,
});`

export const CHAT_FIRST_POST: Post = {
  slug: 'chat-is-the-input',
  title: 'The chat is the input: three apps built to be logged from Claude',
  date: '2026-11-09',
  readMin: 6,
  tags: ['ai-agents', 'mcp', 'postgres'],
  excerpt:
    'Tempo, nomnom and Glow Up take their input from a chat. The model calls the app’s tools, and the web page is mostly where you read the result. The rule is that the model names things and code does the maths, and one of the three bends it. Some of those rules are enforced by a schema, and some live only in a tool description that nothing on the server checks. Neither nomnom nor Glow Up has a daily user yet.',
  featured: false,
  content: [
    {
      type: 'paragraph',
      dropCap: true,
      html:
        'Three of my 2026 apps take their input from a chat. In <a href="/projects/tempo">Tempo</a> you tell Claude what you lifted. In <a href="/projects/nomnom">nomnom</a> you send Claude a photo of a meal. <a href="/projects/glow-up">Glow Up</a> is built so a household can tell Claude or ChatGPT what they ate, weighed or did. In each one the model calls tools on a server I wrote, and the web page is mostly where the numbers are read back.',
    },
    {
      type: 'paragraph',
      html:
        'The tools go over MCP, the Model Context Protocol, which is a standard way for a chat model to call an app’s functions. You add the server to Claude as a custom connector, and Claude signs in to it over OAuth. nomnom’s plan notes why OAuth and not an API key: Claude’s mobile app has no field to paste a key into.',
    },
    {
      type: 'paragraph',
      html:
        'One design rule runs through all three. The chat is the input, the web page is the readout, and the model never does the maths, so units, totals and records are worked out in code. Glow Up bends that last part.',
    },
    {
      type: 'table',
      headers: ['', 'Tempo', 'nomnom', 'Glow Up'],
      rows: [
        ['You log', 'workouts and sets', 'meals, from a photo or a sentence', 'meals, weight and workouts'],
        ['Chat', 'Claude', 'Claude', 'Claude over MCP, ChatGPT over REST'],
        ['Chat tools', '40', '10', '8'],
        ['Server', 'FastAPI (Python)', 'Next.js (TypeScript)', 'Next.js (TypeScript)'],
        ['Status', 'live since August 2026', 'deployed in August 2026, not yet in daily use', 'sign-in screens deployed, meal logging on a preview deploy, the rest on branches'],
      ],
      caption: 'Tool counts are the tools each server registers in its source.',
    },
    { type: 'heading', level: 2, text: 'Split the work at the arithmetic' },
    {
      type: 'paragraph',
      html:
        'The cleanest split is in nomnom, whose server instructions say: “you identify the food and judge the portion. The database supplies the nutrition numbers and the server does the arithmetic.” The model searches a local copy of the USDA food database, picks a food, and sends an amount with a unit. This is the schema for one item in a <code>log_meal</code> call, with most descriptions trimmed:',
    },
    { type: 'code', lang: 'ts', label: 'nomnom · lib/server/mcp.ts', code: NOMNOM_ITEM },
    {
      type: 'paragraph',
      html:
        'There is no calorie field, so the model has nowhere to put a number it worked out. One file, <code>units.ts</code>, turns the amount into grams. For a cup or a piece it looks up that food’s own USDA portion or density, then it multiplies the nutrients per 100 g. Day totals are summed in code from the stored items. If no conversion works, the item is saved with no weight, counts zero calories and waits in a review queue.',
    },
    {
      type: 'image',
      src: '/projects/nomnom/review-mobile.webp',
      alt: 'The nomnom review page on a phone: one item, pizza slice, pepperoni, marked Estimated and Needs a look, counting 0 kcal',
      caption: 'nomnom’s review queue, from a local demo with made-up meals. An item with no weight behind it counts zero until it is fixed.',
    },
    {
      type: 'paragraph',
      html:
        'Training works the same way in Tempo. The model sends the weight and reps of a set. The server decides whether it is a personal record by replaying that exercise’s sets in date order, and it works out volume and tonnage. An exercise’s tonnage comes back empty when any of its sets in the range was bodyweight, since a partial total would look like a real one.',
    },
    {
      type: 'paragraph',
      html:
        'The rule bends in Glow Up. A meal is stored as text plus the chat’s own guess at calories and protein (descriptions trimmed):',
    },
    { type: 'code', lang: 'ts', label: 'Glow Up · packages/core/src/meals.ts', code: GLOWUP_MEAL },
    {
      type: 'paragraph',
      html:
        'Between 0 and 100,000 kcal, any guess is accepted. The project brief allows for it: “Calorie guesses are rough; text and estimate are stored so they can be fixed.” The maths Glow Up plans to keep in code, shared points, streaks and levels worked out from an event log, is not built yet.',
    },
    { type: 'heading', level: 2, text: 'Enforced in code, or only asked for' },
    {
      type: 'paragraph',
      html:
        'A tool description is a prompt, and nothing on the server checks that the model followed it. Sorting the rules in the three apps by where each one lives gave this:',
    },
    {
      type: 'table',
      headers: ['Rule', 'App', 'Where it lives'],
      rows: [
        ['The model cannot send calories', 'nomnom', 'Code: <code>log_meal</code> has no calorie field'],
        ['Send a unit, never convert to grams yourself', 'nomnom', 'Description only. A unit of <code>G</code> is stored as given'],
        ['Prefer your own past portion', 'nomnom', 'Description. Code uses it only as a fallback when the food has no suitable portion data'],
        ['Confidence never goes above the level of the reported source', 'nomnom', 'Code, but the model reports the source, so a mislabelled source starts too high'],
        ['No meal photos stored', 'Glow Up', 'Code: the schema rejects unknown fields'],
        ['Only your own household', 'Glow Up', 'Code: the household comes from the sign-in token'],
        ['Keep calories and weight out of shared summaries', 'Glow Up', 'Description only'],
        ['A retry does not log twice', 'Tempo, nomnom', 'Code, when the model sends the optional retry key'],
        ['A retry does not log twice', 'Glow Up', 'Description only: check the list before retrying'],
      ],
    },
    {
      type: 'paragraph',
      html:
        'Take the past portion. In nomnom a search result carries <code>yourTypicalGrams</code>, the median of your past portions of that food, from Postgres’s <code>percentile_cont(0.5)</code>. The tool description tells the model to prefer it over its own estimate. If the model sends 120 g of oats anyway, code stores 120 g.',
    },
    {
      type: 'paragraph',
      html:
        'Glow Up’s privacy rule works the same way. Its list tools return calories and weights, and only their descriptions say to keep those numbers out of a summary the household shares. Shared summaries are not built yet, so today the rule has nothing to guard.',
    },
    { type: 'heading', level: 2, text: 'Where the model still has freedom' },
    {
      type: 'paragraph',
      html:
        'Moving the maths into code does not remove judgement from the model. In nomnom it still decides whether to search before logging, which result is the food, how much is on the plate and which unit to use. It also labels where each item came from: <code>VISION</code> for a photo, <code>SEARCH</code> for a search match. That label sets the starting confidence, so a photo guess labelled as a search match starts higher than it should.',
    },
    {
      type: 'paragraph',
      html:
        'Glow Up’s tools tell the model to ask who is speaking, because the plan is for two people to share one ChatGPT account. The server checks that the member belongs to the household, but it cannot tell who is typing. The model also says which chat it is, <code>claude</code> or <code>gpt</code>, and that is stored as given. nomnom’s MCP file opens with a comment that fits all three apps: “The descriptions matter as much as the code. They are the only instructions the model gets, and the model is the one doing the logging.”',
    },
    { type: 'heading', level: 2, text: 'The readout' },
    {
      type: 'paragraph',
      html:
        'On the web, nomnom shows the day’s total, what each entry came from and the review queue, and it has a barcode scanner. It is also where you fix a portion, and a fixed item is relabelled as entered by hand. Tempo is the exception, because its web app logs workouts too. Both doors call the same Python functions. One test fails if a REST route or MCP tool touches the database itself, and contract tests check that the main MCP read tools return what their REST endpoints return. Glow Up’s live site has only its sign-in and consent screens. Its phone design is a preview that is not wired to the API yet.',
    },
    { type: 'heading', level: 2, text: 'Chat clients retry' },
    {
      type: 'paragraph',
      html:
        'Early in Tempo, a repeated call left two identical sessions dated 1 May. Tempo’s logging tools now take a client key, and so do nomnom’s. A second call with the same key returns the first record. The key is optional, so it only helps when the model sends one. Glow Up’s writes have no key yet, and the tool text tells the model to check the list before it retries.',
    },
    { type: 'heading', level: 2, text: 'What is not proven' },
    {
      type: 'list',
      items: [
        'Nobody uses nomnom or Glow Up daily. nomnom has been live since August, and its plan still reads “connector not yet added”. The next step written there is a fortnight of real use on a phone.',
        'Nobody has signed in to Glow Up from a real Claude or ChatGPT chat. The Google and email sign-in keys are not set up. Meal logging runs only on a separate preview deploy, and weight and workout logging are on branches.',
        'The tool calls on the nomnom and Glow Up case studies were written by hand against local copies of the servers. Neither page shows a real chat.',
        'So I have no data on how often a model follows the description-only rules in the table, such as preferring your past portion.',
        'nomnom’s food search is hand-tuned. A plain query for “apple” still ranks a restaurant dish above the fruit.',
      ],
    },
    {
      type: 'paragraph',
      html:
        'For a fourth app I would write that table before any tool, and move each rule I can into the schema. For the rest, the web page needs a place to catch a bad entry, as nomnom’s review queue does for a portion with no weight.',
    },
  ],
}
