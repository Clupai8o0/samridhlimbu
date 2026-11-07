// Counters for the chat bot: monthly spend and per-visitor message counts.
//
// With an Upstash Redis database connected (Vercel Marketplace sets
// KV_REST_API_URL / KV_REST_API_TOKEN, or UPSTASH_REDIS_REST_URL / _TOKEN),
// counts are shared by every server instance. Without one they live in this
// instance's memory, which is fine for local dev but is only a soft limit in
// production: the Anthropic workspace spend limit is the hard stop.

const URL = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL
const TOKEN = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN

export const sharedStore = Boolean(URL && TOKEN)

type Cmd = (string | number)[]

async function redis(cmds: Cmd[]): Promise<unknown[]>
{
  const res = await fetch(`${URL}/pipeline`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(cmds),
    cache: 'no-store',
  })
  if (!res.ok) {
    throw new Error(`redis ${res.status}`)
  }
  const out = (await res.json()) as { result?: unknown; error?: string }[]
  return out.map((r) => {
    if (r.error) {
      throw new Error(`redis: ${r.error}`)
    }
    return r.result
  })
}

const mem = new Map<string, { v: number; exp: number }>()

function memGet(key: string): number
{
  const e = mem.get(key)
  if (!e || e.exp < Date.now()) {
    mem.delete(key)
    return 0
  }
  return e.v
}

function memAdd(key: string, by: number, ttlSec: number): number
{
  const v = memGet(key) + by
  const prev = mem.get(key)
  mem.set(key, { v, exp: prev && prev.exp > Date.now() ? prev.exp : Date.now() + ttlSec * 1000 })
  if (mem.size > 5000) {
    for (const [k, e] of mem) {
      if (e.exp < Date.now()) {
        mem.delete(k)
      }
    }
  }
  return v
}

export async function getNumber(key: string): Promise<number>
{
  if (!sharedStore) {
    return memGet(key)
  }
  const [v] = await redis([['GET', key]])
  return Number(v ?? 0) || 0
}

// Adds `by` to a counter and returns the new value. The expiry is set only
// when the key is new, so a window never slides forward.
export async function addNumber(key: string, by: number, ttlSec: number): Promise<number>
{
  if (!sharedStore) {
    return memAdd(key, by, ttlSec)
  }
  const [v] = await redis([
    ['INCRBYFLOAT', key, by],
    ['EXPIRE', key, ttlSec, 'NX'],
  ])
  return Number(v) || 0
}
