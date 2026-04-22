'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

const ITEMS = [
  { k: '/',        label: 'go: home',                    hint: 'gh', href: '/' },
  { k: '/about',   label: 'go: about',                   hint: 'ga', href: '/about' },
  { k: '/projects',label: 'go: projects',                hint: 'gp', href: '/projects' },
  { k: '/projects/kairos', label: 'open: kairos case study', hint: 'gk', href: '/projects/kairos' },
  { k: '/resume',  label: 'open: resume',                hint: 'gr', href: '/resume' },
  { k: '_mail',    label: 'copy: samridh@samridhlimbu.com', hint: '⌘c', href: null },
  { k: '_gh',      label: 'open: github',                hint: '',   href: 'https://github.com/samridhlimbu' },
  { k: '_li',      label: 'open: linkedin',              hint: '',   href: 'https://linkedin.com/in/samridhlimbu' },
]

interface Props {
  open: boolean
  onClose: () => void
}

export function CommandPalette({ open, onClose }: Props) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [idx, setIdx] = useState(0)

  const filtered = ITEMS.filter(x => x.label.toLowerCase().includes(q.toLowerCase()))

  useEffect(() => { if (idx >= filtered.length) setIdx(0) }, [filtered.length, idx])
  useEffect(() => { if (!open) setQ('') }, [open])

  function run(item: typeof ITEMS[0]) {
    if (item.href && !item.href.startsWith('http')) {
      router.push(item.href)
    } else if (item.href) {
      window.open(item.href, '_blank')
    } else if (item.k === '_mail') {
      navigator.clipboard.writeText('samridh@samridhlimbu.com')
    }
    onClose()
  }

  if (!open) return null

  return (
    <div
      onClick={onClose}
      style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(4px)', display: 'flex', justifyContent: 'center', alignItems: 'flex-start', paddingTop: 90 }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{ width: 420, background: 'var(--bg)', border: '1px solid var(--border-2)', boxShadow: '0 20px 60px rgba(0,0,0,.6)' }}
      >
        <div style={{ padding: '12px 14px', borderBottom: '1px solid var(--border)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', fontSize: 13 }}>❯</span>
          <input
            autoFocus
            value={q}
            onChange={e => setQ(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Escape') { onClose(); return }
              if (e.key === 'ArrowDown') { e.preventDefault(); setIdx((idx + 1) % filtered.length) }
              if (e.key === 'ArrowUp') { e.preventDefault(); setIdx((idx - 1 + filtered.length) % filtered.length) }
              if (e.key === 'Enter' && filtered[idx]) run(filtered[idx])
            }}
            placeholder="type a command…"
            style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--fg)', fontFamily: 'var(--font-body, Inter, sans-serif)', fontSize: 13 }}
          />
          <span className="t2-key">esc</span>
        </div>

        <div style={{ maxHeight: 280, overflowY: 'auto' }}>
          {filtered.map((item, i) => (
            <div
              key={item.label}
              className={`t2-cmd-item${i === idx ? ' active' : ''}`}
              onClick={() => run(item)}
              onMouseEnter={() => setIdx(i)}
            >
              <span style={{ color: 'var(--accent)', fontFamily: 'var(--font-mono)', width: 10 }}>›</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.hint && <span className="t2-key">{item.hint}</span>}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 16, color: 'var(--muted-2)', fontSize: 11, fontFamily: 'var(--font-mono)' }}>no matches.</div>
          )}
        </div>

        <div style={{ padding: '8px 14px', borderTop: '1px solid var(--border)', fontSize: 9.5, color: 'var(--muted-2)', display: 'flex', gap: 12, fontFamily: 'var(--font-mono)' }}>
          <span><span className="t2-key">↑↓</span> nav</span>
          <span><span className="t2-key">↵</span> select</span>
          <span style={{ marginLeft: 'auto' }}>samridhlimbu.com</span>
        </div>
      </div>
    </div>
  )
}
