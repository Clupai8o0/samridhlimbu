'use client'

import { openChat } from '../chat/chat-dialog'
import { CHAT_ENABLED } from '@/lib/chat/enabled'
import { openMatch } from './match-funnel'
import styles from './match.module.css'

/** The row that opens the "match my work" funnel. */
export function MatchTrigger({ prompt = 'hiring?', text = 'See the projects that fit your role' }: { prompt?: string; text?: string }) {
  return (
    <button type="button" className={styles.trigger} onClick={openMatch} aria-haspopup="dialog">
      <span className={styles.triggerPrompt}>❯ {prompt}</span>
      <span className={styles.triggerText}>{text}</span>
      <span className={styles.triggerMeta}>4 taps</span>
      <span className={styles.triggerArrow} aria-hidden="true">→</span>
    </button>
  )
}

/** A quieter line under the trigger that opens the "chat with my work" bot. */
export function ChatTrigger({ text = 'or ask my work a question' }: { text?: string }) {
  if (!CHAT_ENABLED) {
    return null
  }
  return (
    <button type="button" className={styles.askLink} onClick={openChat} aria-haspopup="dialog">
      <span aria-hidden="true">●</span> {text} <span className={styles.triggerArrow} aria-hidden="true">→</span>
    </button>
  )
}
