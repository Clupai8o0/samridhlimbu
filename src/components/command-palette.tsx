'use client'

import { useEffect, useState, useRef } from 'react'
import { useRouter } from 'next/navigation'

type Item = {
  k: string
  label: string
  hint?: string
  href: string | null
  group: string
}

const ITEMS: Item[] = [
  // Navigate
  { k: '/',         label: 'home',                         hint: 'gh', href: '/',          group: 'navigate' },
  { k: '/about',    label: 'about',                        hint: 'ga', href: '/about',     group: 'navigate' },
  { k: '/projects', label: 'projects',                     hint: 'gp', href: '/projects',  group: 'navigate' },
  { k: '/resume',   label: 'resume',                       hint: 'gr', href: '/resume',    group: 'navigate' },
  { k: '/writing',  label: 'writing',                      hint: 'gw', href: '/writing',   group: 'navigate' },

  // Projects
  { k: '/projects/kairos',            label: 'kairos · ai-native scheduling',        hint: '', href: '/projects/kairos',            group: 'projects' },
  { k: '/projects/hoddle',            label: 'hoddle · mentorship platform',          hint: '', href: '/projects/hoddle',            group: 'projects' },
  { k: '/projects/tapcraft',          label: 'tapcraft · headless shopify + 3d',     hint: '', href: '/projects/tapcraft',          group: 'projects' },
  { k: '/projects/king-glazing',      label: 'king glazing · next.js + seo',         hint: '', href: '/projects/king-glazing',      group: 'projects' },
  { k: '/projects/nmmun',             label: 'nmmun · conference platform',           hint: '', href: '/projects/nmmun',             group: 'projects' },
  { k: '/projects/krishnaveni',       label: 'krishnaveni · headless cms',            hint: '', href: '/projects/krishnaveni',       group: 'projects' },

  // Archive
  { k: '/projects/farmers-intuition', label: 'farmers intuition · hack48 winner',   hint: '', href: '/projects/farmers-intuition', group: 'archive' },
  { k: '/projects/govchat',           label: 'govchat · rag platform',               hint: '', href: '/projects/govchat',           group: 'archive' },
  { k: '/projects/notes-app',         label: 'notes-app · ci/cd showcase',           hint: '', href: '/projects/notes-app',         group: 'archive' },
  { k: '/projects/load-balancer',     label: 'load-balancer · go + prometheus',      hint: '', href: '/projects/load-balancer',     group: 'archive' },

  // External
  { k: '_gh',  label: 'github',    hint: '', href: 'https://github.com/clupai8o0',                  group: 'external' },
  { k: '_li',  label: 'linkedin',  hint: '', href: 'https://linkedin.com/in/samridh-limbu',          group: 'external' },
  { k: '_web', label: 'clupai.com · freelance studio', hint: '', href: 'https://clupai.com',         group: 'external' },

  // Actions
  { k: '_mail', label: 'copy email · samridh@samridhlimbu.com', hint: '⌘c', href: null, group: 'actions' },
]

const GROUP_LABELS: Record<string, string> = {
  navigate: 'navigate',
  projects: 'projects',
  archive:  'archive',
  external: 'external',
  actions:  'actions',
}

interface Props {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: Props) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)
  const [copied, setCopied] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  const filtered = ITEMS.filter(x =>
    x.label.toLowerCase().includes(q.toLowerCase()) ||
    x.k.toLowerCase().includes(q.toLowerCase())
  )

  // Group filtered items, only show group headers when not searching
  const isSearching = q.trim().length > 0
  const groups = isSearching
    ? [{ id: 'results', items: filtered }]
    : Object.entries(
        filtered.reduce<Record<string, Item[]>>((acc, item) => {
          ;(acc[item.group] ??= []).push(item)
          return acc
        }, {})
      ).map(([id, items]) => ({ id, items }))

  const flatFiltered = groups.flatMap(g => g.items)

  useEffect(() => { if (idx >= flatFiltered.length) setIdx(0) }, [flatFiltered.length, idx])
  useEffect(() => { if (!open) { setQ(''); setIdx(0) } }, [open])

  // Scroll active item into view
  useEffect(() => {
    const el = listRef.current?.querySelector('[data-active="true"]') as HTMLElement | null
    el?.scrollIntoView({ block: 'nearest' })
  }, [idx])

  function run(item: Item) {
    if (item.k === '_mail') {
      navigator.clipboard.writeText('samridh@samridhlimbu.com')
      setCopied(true)
      setTimeout(() => { setCopied(false); onClose() }, 1400)
      return
    }
    if (item.href && !item.href.startsWith('http')) {
      router.push(item.href)
    } else if (item.href) {
      window.open(item.href, '_blank', 'noopener,noreferrer')
    }
    onClose()
  }

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(6px)',
        display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 80,
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          width: 500, background: 'var(--bg)',
          border: '1px solid var(--border-2)',
          boxShadow: '0 24px 80px rgba(0,0,0,.75)',
        }}
      >
        {/* Search input */}
        <div style={{
          padding: '11px 14px', borderBottom: '1px solid var(--border)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>❯</span>
          <input
            autoFocus
            value={q}
            onChange={e => { setQ(e.target.value); setIdx(0) }}
            onKeyDown={e => {
              if (e.key === 'Escape') { onClose(); return }
              if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((idx + 1) % flatFiltered.length) }
              if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((idx - 1 + flatFiltered.length) % flatFiltered.length) }
              if (e.key === 'Enter' && flatFiltered[idx]) run(flatFiltered[idx])
            }}
            placeholder="search commands…"
            style={{
              flex: 1, background: 'transparent', border: 'none', outline: 'none',
              color: 'var(--fg)', fontFamily: 'var(--font-inter, Inter, sans-serif)', fontSize: 13,
            }}
          />
          <span className="t2-key">esc</span>
        </div>

        {/* Results */}
        <div ref={listRef} style={{ maxHeight: 340, overflowY: 'auto' }}>
          {flatFiltered.length === 0 ? (
            <div style={{ padding: '14px 16px', color: 'var(--muted-2)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>
              no matches.
            </div>
          ) : (
            (() => {
              let globalI = 0
              return groups.map(group => (
                <div key={group.id}>
                  {!isSearching && (
                    <div style={{
                      padding: '7px 14px 4px',
                      fontSize: 9, letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: 'var(--muted-2)', fontFamily: 'var(--font-mono)',
                    }}>
                      {GROUP_LABELS[group.id] ?? group.id}
                    </div>
                  )}
                  {group.items.map(item => {
                    const itemI = globalI++
                    const isActive = itemI === idx
                    const isMail = item.k === '_mail'
                    return (
                      <div
                        key={item.k}
                        data-active={isActive}
                        className={`t2-cmd-item${isActive ? ' active' : ''}`}
                        onClick={() => run(item)}
                        onMouseEnter={() => setIdx(itemI)}
                      >
                        <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', width: 10, flexShrink: 0 }}>›</span>
                        <span style={{
                          flex: 1, fontFamily: 'var(--font-mono)', fontSize: 11.5,
                          color: copied && isMail ? 'var(--term-green)' : undefined,
                        }}>
                          {copied && isMail ? '✓ copied to clipboard' : item.label}
                        </span>
                        {item.hint && <span className="t2-key">{item.hint}</span>}
                      </div>
                    )
                  })}
                </div>
              ))
            })()
          )}
        </div>

        {/* Footer */}
        <div style={{
          padding: '7px 14px', borderTop: '1px solid var(--border)',
          fontSize: 9.5, color: 'var(--muted-2)',
          display: 'flex', gap: 12, fontFamily: 'var(--font-mono)',
          alignItems: 'center',
        }}>
          <span><span className="t2-key">↑↓</span> nav</span>
          <span><span className="t2-key">↵</span> open</span>
          <span><span className="t2-key">esc</span> close</span>
          <span style={{ marginLeft: 'auto' }}>{flatFiltered.length} command{flatFiltered.length !== 1 ? 's' : ''}</span>
        </div>
      </div>
    </div>
  )
}
