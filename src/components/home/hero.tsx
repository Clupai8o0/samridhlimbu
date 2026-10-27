import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@/components/icons'
import { CopyButton } from '@/components/copy-button'
import { HeroBackdrop } from './hero-backdrop'
import styles from './home.module.css'

export const EMAIL = 'samridh@samridhlimbu.com'

export const AVAILABILITY =
  'Final-year CS at Deakin, graduating June 2027. Open to summer 2026\u2060–\u206027 software engineering internships and graduate roles from mid-2027, in Melbourne.'

// countFrom: the number the count-up starts at (search went from seconds to <200 ms).
const PROOF: { k: string; v: string; href: string; count?: boolean; countFrom?: number }[] = [
  { k: '<200 ms search', v: 'US health-tech contract', href: '#contract', count: true, countFrom: 2000 },
  { k: '25K+\u00a0lines · 51\u00a0routes', v: 'hoddle.org', href: '/projects/hoddle', count: true },
  { k: 'Winner · GovHack 2025', v: 'GovChat', href: '/projects/govchat' },
  { k: '190+ members', v: 'DSEC president', href: '/projects/dsec', count: true },
]

const SOCIALS = [
  { href: 'https://x.com/clupai8o0', icon: 'x', label: 'X (@clupai8o0)' },
  { href: 'https://instagram.com/clupaii', icon: 'instagram', label: 'Instagram (@clupaii)' },
]

// Splits a word into letter spans for the name's entrance. `start` keeps
// the stagger index running across words.
function Letters({ word, start }: { word: string; start: number }) {
  return (
    <span className={styles.word}>
      {Array.from(word).map((ch, i) => (
        <span key={i} className={styles.letter} style={{ '--i': start + i } as React.CSSProperties}>
          {ch}
        </span>
      ))}
    </span>
  )
}

/**
 * Home hero. Returns stagger items as a fragment so they stay direct
 * children of the page's [data-stagger] root.
 */
export function Hero() {
  return (
    <>
      <HeroBackdrop />

      <div data-stagger-item className={styles.breadcrumb}>
        <span aria-hidden="true" style={{ color: 'var(--accent)' }}>❯</span>{' '}
        cat ~/readme.md<span className="t2-cursor thin" aria-hidden="true" />
      </div>

      <div data-stagger-item className={styles.identity}>
        <div className={styles.photo}>
          <Image
            src="/sam.jpeg"
            alt="Portrait of Samridh Limbu"
            fill
            preload
            sizes="96px"
            style={{ objectFit: 'cover', objectPosition: 'center top' }}
          />
        </div>
        <h1 className={styles.name} aria-label="Samridh Limbu">
          <span aria-hidden="true">
            <Letters word="Samridh" start={0} />{' '}
            <span style={{ color: 'var(--accent)' }}><Letters word="Limbu" start={7} /></span>
          </span>
        </h1>
        <p className={styles.tagline}>
          <span style={{ color: 'var(--fg)' }}>Software engineer</span> in Melbourne. React and TypeScript up front, FastAPI and Postgres behind.
        </p>
      </div>

      <div data-stagger-item>
        <p className={styles.availability}>
          <span className={styles.liveDot} aria-hidden="true" />
          {AVAILABILITY}
        </p>
        <div className={styles.actions}>
          <a href="/api/resume" className={`${styles.action} ${styles.actionPrimary}`}>
            <Icon name="download" size={14} />
            Resume PDF
          </a>
          <span className={styles.email}>
            <a href={`mailto:${EMAIL}`} className={styles.action}>
              <Icon name="mail" size={14} />
              {EMAIL}
            </a>
            <CopyButton code={EMAIL} label="Copy email address" />
          </span>
          <a href="https://github.com/clupai8o0" target="_blank" rel="noopener noreferrer me" className={styles.action}>
            <Icon name="github" size={14} />
            GitHub
          </a>
          <a href="https://linkedin.com/in/samridh-limbu" target="_blank" rel="noopener noreferrer me" className={styles.action}>
            <Icon name="linkedin" size={14} />
            LinkedIn
          </a>
          {SOCIALS.map(s => (
            <a
              key={s.icon}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer me"
              className={`${styles.action} ${styles.actionIcon}`}
              aria-label={s.label}
              title={s.label}
            >
              <Icon name={s.icon} size={14} />
            </a>
          ))}
        </div>
      </div>

      <ul data-stagger-item className={styles.proof} aria-label="Highlights">
        {PROOF.map((p, i) => (
          <li key={p.k} style={{ '--i': i } as React.CSSProperties}>
            <Link href={p.href} className={styles.proofItem} data-spotlight>
              <span className={styles.proofKey} data-count={p.count ? '' : undefined} data-count-from={p.countFrom}>
                {p.k}
              </span>
              <span className={styles.proofValue}>{p.v}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
