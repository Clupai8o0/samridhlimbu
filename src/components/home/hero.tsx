import Image from 'next/image'
import Link from 'next/link'
import { Icon } from '@/components/icons'
import { CopyButton } from '@/components/copy-button'
import styles from './home.module.css'

export const EMAIL = 'samridh@samridhlimbu.com'

export const AVAILABILITY =
  'Final-year CS at Deakin, graduating June 2027. Open to summer 2026\u2060–\u206027 software engineering internships and graduate roles from mid-2027, in Melbourne.'

const PROOF = [
  { k: '<200 ms search', v: 'US health-tech contract', href: '#contract' },
  { k: '26K+ lines · 51 routes', v: 'hoddle.org', href: '/projects/hoddle' },
  { k: 'Winner · GovHack 2025', v: 'GovChat', href: '/projects/govchat' },
  { k: '190+ members', v: 'DSEC president', href: '/projects/dsec' },
]

/**
 * Home hero. Returns stagger items as a fragment so they stay direct
 * children of the page's [data-stagger] root.
 */
export function Hero() {
  return (
    <>
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
        <h1 className={styles.name}>
          Samridh <span style={{ color: 'var(--accent)' }}>Limbu</span>
        </h1>
        <p className={styles.tagline}>
          <span style={{ color: 'var(--fg)' }}>Software engineer</span> in Melbourne. React and TypeScript up front, FastAPI and Postgres behind.
        </p>
      </div>

      <div data-stagger-item>
        <p className={styles.availability}>
          <span aria-hidden="true" style={{ color: 'var(--term-green)', marginRight: 8 }}>●</span>
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
        </div>
      </div>

      <ul data-stagger-item className={styles.proof} aria-label="Highlights">
        {PROOF.map(p => (
          <li key={p.k}>
            <Link href={p.href} className={styles.proofItem}>
              <span className={styles.proofKey}>{p.k}</span>
              <span className={styles.proofValue}>{p.v}</span>
            </Link>
          </li>
        ))}
      </ul>
    </>
  )
}
