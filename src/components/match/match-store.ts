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
