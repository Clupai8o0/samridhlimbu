'use client'

import { usePathname, useSearchParams } from 'next/navigation'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ChatPanel } from './chat-panel'
import frame from '../match/match.module.css'

/** Dispatch this on window to open the chat from anywhere. */
export const OPEN_CHAT_EVENT = 't2:open-chat'

export function openChat()
{
  window.dispatchEvent(new Event(OPEN_CHAT_EVENT))
}

/** Mounted once in the root layout (inside Suspense, for useSearchParams).
 *  Opens on the event, or on ?chat / #chat in the URL. */
export function ChatProvider()
{
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const search = useSearchParams()

  useEffect(() => {
    const onOpen = () => setOpen(true)
    window.addEventListener(OPEN_CHAT_EVENT, onOpen)
    return () => window.removeEventListener(OPEN_CHAT_EVENT, onOpen)
  }, [])

  useEffect(() => {
    function fromUrl()
    {
      const url = new URL(window.location.href)
      if (!url.searchParams.has('chat') && url.hash !== '#chat') {
        return
      }
      url.searchParams.delete('chat')
      if (url.hash === '#chat') {
        url.hash = ''
      }
      window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash)
      setOpen(true)
    }
    fromUrl()
    window.addEventListener('hashchange', fromUrl)
    return () => window.removeEventListener('hashchange', fromUrl)
  }, [pathname, search])

  return open ? <ChatDialog onClose={() => setOpen(false)} /> : null
}

function ChatDialog({ onClose }: { onClose: () => void })
{
  const ref = useRef<HTMLDialogElement>(null)
  const closing = useRef(false)
  const downOnBackdrop = useRef(false)

  const close = useCallback(() => {
    const el = ref.current
    if (!el || closing.current) {
      return
    }
    closing.current = true
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    el.setAttribute('data-closing', '')
    window.setTimeout(() => {
      el.close()
      onClose()
    }, reduce ? 0 : 140)
  }, [onClose])

  useEffect(() => {
    const el = ref.current
    if (!el) {
      return
    }
    if (!el.open) {
      el.showModal()
    }
    const html = document.documentElement
    const prev = html.style.overflow
    html.style.overflow = 'hidden'
    return () => {
      html.style.overflow = prev
    }
  }, [])

  return (
    <dialog
      ref={ref}
      className={frame.dialog}
      aria-label="Chat with my work"
      onCancel={(e) => {
        e.preventDefault()
        close()
      }}
      onPointerDown={(e) => {
        downOnBackdrop.current = e.target === ref.current
      }}
      onClick={(e) => {
        if (e.target === ref.current && downOnBackdrop.current) {
          close()
        }
      }}
    >
      <div className={frame.bar}>
        <span className={frame.barCmd}><b>❯</b> ./ask.sh --about my-work</span>
        <button type="button" className={frame.iconBtn} onClick={close} aria-label="Close">
          esc
        </button>
      </div>
      <ChatPanel onNavigate={close} autoFocus />
    </dialog>
  )
}
