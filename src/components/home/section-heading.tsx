import Link from 'next/link'
import { Icon } from '@/components/icons'
import styles from './home.module.css'

/** Terminal-style section heading: `› title` on a hairline, optional link on the right. */
export function SectionHeading({
  id,
  children,
  link,
}: {
  id?: string
  children: React.ReactNode
  link?: { href: string; label: string }
}) {
  return (
    <div className={styles.sectionHead}>
      <h2 id={id} className={styles.sectionTitle}>
        <span aria-hidden="true" style={{ color: 'var(--accent)' }}>›</span>
        {children}
      </h2>
      {link && (
        <Link href={link.href} className={styles.sectionLink}>
          {link.label}
          <Icon name="arrow-right" size={12} />
        </Link>
      )}
    </div>
  )
}
