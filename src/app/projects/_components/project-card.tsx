'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { Project } from '@/lib/data'

const MONO = '"JetBrains Mono", var(--font-mono), monospace'
const SANS = 'Inter, var(--font-inter), sans-serif'
const DISPLAY = 'Manrope, var(--font-manrope), sans-serif'

interface Props {
  project: Project
  hasDetailPage: boolean
}

export function ProjectCard({ project: p, hasDetailPage }: Props) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={hasDetailPage ? `/projects/${p.slug}` : '#'}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        border: `1px solid ${hovered ? 'var(--border-2)' : 'var(--border)'}`,
        padding: 14,
        cursor: hasDetailPage ? 'pointer' : 'default',
        textDecoration: 'none',
        color: 'inherit',
        display: 'block',
        transform: hovered ? 'translateY(-3px)' : 'translateY(0)',
        boxShadow: hovered ? '0 10px 32px rgba(0,0,0,.5)' : 'none',
        transition: 'border-color .2s, transform .2s cubic-bezier(.25,.46,.45,.94), box-shadow .2s',
      }}
    >
      <div style={{ overflow: 'hidden', marginBottom: 10 }}>
        {p.cover
          ? (
            <img
              src={p.cover}
              alt={p.name}
              style={{
                width: '100%',
                height: 90,
                objectFit: 'cover',
                display: 'block',
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform .38s cubic-bezier(.25,.46,.45,.94)',
              }}
            />
          ) : (
            <div
              className="placeholder"
              style={{
                height: 90,
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform .38s cubic-bezier(.25,.46,.45,.94)',
              }}
            >
              [ {p.slug} · cover ]
            </div>
          )
        }
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{
            fontFamily: DISPLAY,
            fontWeight: 600,
            fontSize: 13,
            color: hovered ? 'var(--accent)' : 'var(--fg)',
            transition: 'color .15s',
          }}>
            {p.name}
          </span>
          {p.updating && (
            <span style={{
              fontFamily: MONO,
              fontSize: 8,
              color: 'var(--muted-2)',
              border: '1px dashed var(--border)',
              padding: '1px 4px',
              letterSpacing: 0.04,
            }}>
              updating
            </span>
          )}
        </div>
        <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <span style={{
            fontFamily: MONO,
            fontSize: 10,
            color: 'var(--accent)',
            display: 'inline-block',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateX(0)' : 'translateX(-6px)',
            transition: 'opacity .18s, transform .2s cubic-bezier(.25,.46,.45,.94)',
          }}>
            →
          </span>
          <span style={{ fontFamily: MONO, fontSize: 9.5, color: 'var(--muted-2)' }}>{p.year}</span>
        </span>
      </div>

      <div style={{ fontFamily: SANS, fontSize: 11.5, color: 'var(--muted)', marginTop: 4, lineHeight: 1.5 }}>
        {p.pitchShort}
      </div>
    </Link>
  )
}
