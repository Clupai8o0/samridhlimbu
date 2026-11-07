// Telegram alerts for the chat, each sent at most once per window so a
// flood of refused requests never turns into a flood of messages.
import { notifyTelegram, tgEsc } from '@/lib/notify'
import { ENV_LABEL } from './guard'
import { once } from './store'

const DAY = 86400

function month(): string
{
  return new Date().toISOString().slice(0, 7)
}

function nextMonthStart(): string
{
  const d = new Date()
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth() + 1, 1))
    .toLocaleDateString('en-AU', { day: 'numeric', month: 'long', timeZone: 'UTC' })
}

async function send(key: string, ttl: number, html: string)
{
  try {
    if (await once(`chat:alert:${key}`, ttl)) {
      await notifyTelegram(ENV_LABEL + html)
    }
  } catch (err) {
    console.error('chat: alert failed', err)
  }
}

const usd = (n: number) => `$${n.toFixed(2)}`

/** Spend passed 80% of the cap this month. */
export function alertNearCap(spent: number, cap: number)
{
  return send(`warn:${month()}`, 40 * DAY,
    `<b>Chat budget at 80%</b>\n${usd(spent)} of ${usd(cap)} used this month on samridhlimbu.com.`)
}

/** The cap refused a request: the chat is off until next month. */
export function alertCapHit(spent: number, cap: number)
{
  return send(`cap:${month()}`, 40 * DAY,
    `<b>Chat budget used up</b>\n${usd(spent)} of ${usd(cap)} this month. The chat is off until ${tgEsc(nextMonthStart())}.\nTo turn it back on, raise CHAT_MONTHLY_CAP_USD in Vercel.`)
}

/** The site-wide daily message limit was reached. */
export function alertSiteLimit(limit: number)
{
  return send(`site:${new Date().toISOString().slice(0, 10)}`, DAY,
    `<b>Chat daily limit hit</b>\n${limit} messages today. New questions are refused until midnight UTC.`)
}

/** A visitor hit their own rate limit (sent once a day at most). */
export function alertVisitorLimit()
{
  return send(`ip:${new Date().toISOString().slice(0, 10)}`, DAY,
    '<b>Chat: a visitor hit the message limit</b>\nCould be someone scripting it. Only worth a look if it keeps happening.')
}

/** Many rule-breaking messages today (prompt-injection attempts). */
export function alertAttacks(count: number)
{
  return send(`attack:${new Date().toISOString().slice(0, 10)}`, DAY,
    `<b>Chat: ${count} attempts today to change the bot's rules</b>\nThey got a fixed reply and cost nothing.`)
}
