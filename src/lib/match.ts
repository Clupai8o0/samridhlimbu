// The "match my work" funnel: a few questions, then the case studies that fit.
// Pure data and scoring, shared by the modal (client) and the email action
// (server), so the server rebuilds the shortlist from the answers instead of
// trusting a list of slugs sent by the browser.
//
// Every tag below must be true of the case study it sits on. When a case
// study changes, check its tags here too.

import { PROJECTS } from '@/lib/data'

export const WHO = [
  { id: 'hiring', label: 'Hiring', hint: 'recruiter or hiring manager' },
  { id: 'engineer', label: 'An engineer', hint: 'checking how I build' },
  { id: 'client', label: 'Need something built', hint: 'freelance or contract' },
  { id: 'browsing', label: 'Just looking', hint: 'curious' },
] as const

export const ROLES = [
  { id: 'frontend', label: 'Frontend / UI' },
  { id: 'fullstack', label: 'Full-stack product' },
  { id: 'backend', label: 'Backend / APIs' },
  { id: 'ai', label: 'AI / LLM / agents' },
  { id: 'devops', label: 'Infra / DevOps' },
  { id: 'embedded', label: 'Embedded / IoT' },
] as const

export const TRAITS = [
  { id: 'shipped', label: 'Live in production' },
  { id: 'tests', label: 'Tests and quality' },
  { id: 'lead', label: 'Ownership and leading' },
  { id: 'perf', label: 'Performance and scale' },
  { id: 'data', label: 'Databases and data' },
  { id: 'design', label: 'UI and design' },
  { id: 'security', label: 'Security and access' },
  { id: 'fast', label: 'Ships fast (hackathons)' },
] as const

export const STACKS = [
  { id: 'react', label: 'React / Next.js' },
  { id: 'ts', label: 'TypeScript' },
  { id: 'python', label: 'Python' },
  { id: 'node', label: 'Node.js' },
  { id: 'postgres', label: 'PostgreSQL' },
  { id: 'go', label: 'Go' },
  { id: 'csharp', label: 'C# / .NET' },
  { id: 'angular', label: 'Angular' },
  { id: 'c', label: 'C / C++' },
  { id: 'swift', label: 'Swift' },
] as const

export type Who = (typeof WHO)[number]['id']
export type Role = (typeof ROLES)[number]['id']
export type Trait = (typeof TRAITS)[number]['id']
export type Stack = (typeof STACKS)[number]['id']

export const MAX_TRAITS = 3
export const RESULT_COUNT = 4

export interface Answers {
  who: Who
  roles: Role[]
  traits: Trait[]
  stacks: Stack[]
}

interface Tags {
  /** How strongly the project shows each kind of role, 1 to 3. */
  roles: Partial<Record<Role, 1 | 2 | 3>>
  traits: Trait[]
  stacks: Stack[]
  /** Built for a paying client or an outside organisation. */
  client?: boolean
}

// Case studies outside PROJECTS (the archive rows with a page).
const ARCHIVE_BLURBS: Record<string, { name: string; blurb: string }> = {
  airtable: { name: 'Airtable clone', blurb: 'A grid that scrolls a 100,000-row table. Row loading written four times and measured.' },
  'farmers-intuition': { name: 'Farmers Intuition', blurb: 'Vineyard watering advisor built overnight at Hack48: a gradient boosting model plus a voice assistant.' },
  seatly: { name: 'Seatly', blurb: 'Restaurant bookings: onboarding wizard, a booking engine that picks tables, an operator dashboard.' },
  govchat: { name: 'GovChat', blurb: 'GovHack 2025 winner. Finds Australian government datasets from plain English, with a trust score.' },
  'notes-app': { name: 'notes-app', blurb: 'A small app carrying a 10-stage Jenkins pipeline: tests, scans, approval, AWS deploy, rollback.' },
  'load-balancer': { name: 'load-balancer', blurb: 'Concurrent HTTP load balancer in Go: four strategies, health checks, circuit breakers, Prometheus.' },
  'fleet-platform': { name: 'Fleet platform', blurb: 'Backend for 2,000 simulated taxis. MQTT ingest, queue-fed workers, AWS Fargate scaling 1 to 6 tasks.' },
  'bed-monitor': { name: 'Bed monitor', blurb: 'Aged care bed monitor: register-level C and four FreeRTOS tasks on a SAMD21, Python dashboard.' },
  'robot-api': { name: 'Robot controller API', blurb: 'REST API in C# and ASP.NET Core on PostgreSQL, with BCrypt auth, two roles and paged lists.' },
  'art-gallery': { name: 'Art Gallery', blurb: 'Catalogue API and web app: Express and MongoDB behind Next.js, Google sign-in roles, 126 tests.' },
  'voice-controller': { name: 'Voice light controller', blurb: 'Voice switch for lights: a Raspberry Pi turns speech into commands, an Arduino switches over BLE.' },
}

const TAGS: Record<string, Tags> = {
  hoddle: { roles: { fullstack: 3, frontend: 2, backend: 2 }, traits: ['shipped', 'lead', 'data', 'tests', 'security', 'design'], stacks: ['react', 'ts', 'postgres'], client: true },
  kairos: { roles: { fullstack: 3, ai: 2, frontend: 1, backend: 1 }, traits: ['tests', 'data'], stacks: ['react', 'ts', 'postgres'] },
  aria: { roles: { fullstack: 1, ai: 1, backend: 1 }, traits: ['fast', 'tests'], stacks: ['react', 'ts'] },
  r1gpt: { roles: { fullstack: 2, frontend: 2, ai: 1 }, traits: ['fast', 'data', 'tests'], stacks: ['react', 'ts', 'postgres'] },
  dsec: { roles: { fullstack: 3, backend: 2, frontend: 1, ai: 1 }, traits: ['shipped', 'lead', 'security'], stacks: ['react', 'ts', 'python', 'postgres'] },
  ontrack: { roles: { frontend: 3, fullstack: 2, backend: 1 }, traits: ['lead', 'tests', 'design', 'security'], stacks: ['angular', 'ts'] },
  tempo: { roles: { backend: 3, ai: 3, fullstack: 2 }, traits: ['shipped', 'tests', 'data'], stacks: ['python', 'react', 'ts', 'postgres'] },
  morgue: { roles: { fullstack: 2, frontend: 2, ai: 1 }, traits: ['lead', 'perf'], stacks: ['react', 'ts', 'node', 'postgres'] },
  cstack: { roles: { ai: 3, devops: 2, backend: 1 }, traits: [], stacks: ['python'] },
  'king-glazing': { roles: { frontend: 3, fullstack: 2 }, traits: ['shipped', 'design', 'perf'], stacks: ['react', 'ts', 'postgres'], client: true },
  allarkive: { roles: { ai: 3, backend: 2, devops: 1 }, traits: [], stacks: ['python'] },
  'acknowledgement-force': { roles: { frontend: 1, fullstack: 1 }, traits: ['shipped', 'design'], stacks: ['swift', 'react', 'ts'] },
  krishnaveni: { roles: { frontend: 3 }, traits: ['shipped', 'design'], stacks: ['react', 'ts'], client: true },
  nmmun: { roles: { frontend: 3 }, traits: ['shipped', 'design'], stacks: ['react', 'ts'], client: true },
  tapcraft: { roles: { frontend: 3, fullstack: 1 }, traits: ['shipped', 'design'], stacks: ['react', 'ts'] },
  'lock-in': { roles: { embedded: 3, ai: 1, backend: 1 }, traits: ['tests'], stacks: ['python', 'c'] },
  airtable: { roles: { frontend: 2, fullstack: 2 }, traits: ['perf'], stacks: ['react', 'ts', 'postgres'] },
  'farmers-intuition': { roles: { ai: 3, backend: 1 }, traits: ['fast'], stacks: ['python'] },
  seatly: { roles: { fullstack: 3, backend: 1 }, traits: ['data'], stacks: ['react', 'ts', 'python', 'postgres'] },
  govchat: { roles: { ai: 3, backend: 2, fullstack: 1 }, traits: ['fast'], stacks: ['python', 'react'] },
  'notes-app': { roles: { devops: 3, fullstack: 1 }, traits: ['tests', 'security'], stacks: ['react', 'node'] },
  'load-balancer': { roles: { backend: 3, devops: 3 }, traits: ['perf'], stacks: ['go'] },
  'fleet-platform': { roles: { backend: 3, devops: 3 }, traits: ['perf'], stacks: ['node', 'postgres'] },
  'bed-monitor': { roles: { embedded: 3 }, traits: [], stacks: ['c', 'python'] },
  'robot-api': { roles: { backend: 3 }, traits: ['security', 'data'], stacks: ['csharp', 'postgres'] },
  'art-gallery': { roles: { fullstack: 2, backend: 2 }, traits: ['tests', 'security'], stacks: ['node', 'react'] },
  'voice-controller': { roles: { embedded: 3, ai: 2 }, traits: [], stacks: ['python', 'c'] },
}

export interface MatchItem {
  slug: string
  name: string
  blurb: string
  /** Labels for what matched beyond the role, strongest first. */
  reasons: string[]
  score: number
  /** How strongly it shows the best of the chosen roles, 0 to 3. */
  roleWeight: number
}

const label = <T extends { id: string; label: string }>(list: readonly T[], id: string) =>
  list.find(x => x.id === id)?.label ?? id

function info(slug: string) {
  const p = PROJECTS.find(x => x.slug === slug)
  if (p) {
    return { name: p.name, blurb: p.pitchShort, featured: p.featured }
  }
  const a = ARCHIVE_BLURBS[slug]
  return a ? { ...a, featured: false } : null
}

/** The case studies that best fit the answers, best first. */
export function matchProjects(a: Answers, count = RESULT_COUNT): MatchItem[] {
  const scored: MatchItem[] = []
  for (const [slug, t] of Object.entries(TAGS)) {
    const meta = info(slug)
    if (!meta) {
      continue
    }
    const roleHits = a.roles.filter(r => (t.roles[r] ?? 0) > 0)
    const roleWeight = Math.max(0, ...a.roles.map(r => t.roles[r] ?? 0))
    const traitHits = a.traits.filter(x => t.traits.includes(x))
    const stackHits = a.stacks.filter(x => t.stacks.includes(x))
    // Role fit dominates (the strongest of the picked roles, plus a little for
    // each other picked role it also shows); a project that shows none of
    // them only surfaces when nothing else fits.
    let score = roleWeight * 4 + Math.max(0, roleHits.length - 1) * 2 + traitHits.length * 2 + stackHits.length
    if (roleWeight === 0) {
      score -= 6
    }
    if (a.who === 'client' && t.client) {
      score += 2
    }
    if (meta.featured) {
      score += 0.5
    }
    const reasons = [
      // With several roles picked, say which of them this one shows.
      ...(a.roles.length > 1 && roleHits.length > 1 ? roleHits.map(x => label(ROLES, x)) : []),
      ...traitHits.map(x => label(TRAITS, x)),
      ...stackHits.map(x => label(STACKS, x)),
      ...(a.who === 'client' && t.client ? ['Client or startup work'] : []),
    ]
    scored.push({ slug, name: meta.name, blurb: meta.blurb, reasons: reasons.slice(0, 3), score, roleWeight })
  }
  const ranked = scored.sort((x, y) => y.score - x.score)
  // Fewer, relevant picks beat padding the list with work from another field.
  const relevant = ranked.filter(x => x.roleWeight > 0)
  return (relevant.length ? relevant : ranked).slice(0, count)
}

const ids = <T extends { id: string }>(list: readonly T[]) => new Set(list.map(x => x.id))
const WHO_IDS = ids(WHO)
const ROLE_IDS = ids(ROLES)
const TRAIT_IDS = ids(TRAITS)
const STACK_IDS = ids(STACKS)

/** Checks answers that came from outside (the server action, localStorage). */
export function parseAnswers(raw: unknown): Answers | null {
  if (!raw || typeof raw !== 'object') {
    return null
  }
  const r = raw as Record<string, unknown>
  const list = (v: unknown, allowed: Set<string>, max: number) =>
    Array.isArray(v) && v.length <= max && v.every(x => typeof x === 'string' && allowed.has(x)) ? [...new Set(v as string[])] : null
  const traits = list(r.traits, TRAIT_IDS, MAX_TRAITS)
  const stacks = list(r.stacks, STACK_IDS, STACKS.length)
  // Answers saved before roles became a list have a single `role`.
  const roles = list(r.roles ?? (typeof r.role === 'string' ? [r.role] : null), ROLE_IDS, ROLES.length)
  if (typeof r.who !== 'string' || !WHO_IDS.has(r.who) || !roles?.length || !traits || !stacks) {
    return null
  }
  return { who: r.who as Who, roles: roles as Role[], traits: traits as Trait[], stacks: stacks as Stack[] }
}

/** One line describing the answers, for the email to Sam. */
export function describeAnswers(a: Answers) {
  return [
    `who: ${label(WHO, a.who)}`,
    `role: ${a.roles.map(x => label(ROLES, x)).join(', ')}`,
    `cares about: ${a.traits.map(x => label(TRAITS, x)).join(', ') || '-'}`,
    `stack: ${a.stacks.map(x => label(STACKS, x)).join(', ') || '-'}`,
  ]
}
