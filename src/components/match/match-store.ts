import { parseAnswers, type Answers } from '@/lib/match'

// The visitor's last answers, so a return visit lands on their results.
const STORE_KEY = 'match:v1'

export function loadSaved(): Answers | null {
  try {
    return parseAnswers(JSON.parse(localStorage.getItem(STORE_KEY) ?? 'null'))
  } catch {
    return null
  }
}

export function saveAnswers(a: Answers) {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(a))
  } catch {
    // Private mode: results still show, they just aren't remembered.
  }
}

export function clearSaved() {
  try {
    localStorage.removeItem(STORE_KEY)
  } catch {
    // Nothing saved to clear.
  }
}

// The bottom-left nudge card stays away for a while once the visitor has
// closed it or found the funnel or the chat some other way.
const NUDGE_KEY = 'nudge:v1'
export const NUDGE_DONE_EVENT = 't2:nudge-done'

// Also kept in memory, for private mode (no storage) and for a nudge that
// mounts after the event already fired.
let doneThisLoad = false

export function nudgeDoneAt(): number {
  if (doneThisLoad) {
    return Date.now()
  }
  try {
    return Number(localStorage.getItem(NUDGE_KEY) ?? 0) || 0
  } catch {
    return 0
  }
}

export function markNudgeDone() {
  doneThisLoad = true
  try {
    localStorage.setItem(NUDGE_KEY, String(Date.now()))
  } catch {
    // Private mode: it just comes back next visit.
  }
  window.dispatchEvent(new Event(NUDGE_DONE_EVENT))
}
