import Link from 'next/link'
import { Icon } from '@/components/icons'
import { EXPERIENCE } from '@/lib/data'
import type { ExperienceItem } from '@/lib/data'
import { SectionHeading } from './section-heading'
import styles from './home.module.css'

function RowBody({ e }: { e: ExperienceItem }) {
  return (
    <>
      <span className={styles.logWhen}>{e.when}</span>
      <div className={styles.logMain}>
        <div className={styles.logTitle}>
          <span className={styles.logRole}>{e.role}</span>
          <span className={styles.logOrg}> · {e.org}</span>
        </div>
        <p className={styles.logDetail}>{e.detail}</p>
      </div>
    </>
  )
}

export function ExperienceLog() {
  return (
    <section data-reveal className={styles.section} aria-labelledby="experience-heading">
      <SectionHeading id="experience-heading" link={{ href: '/resume', label: 'full resume' }}>
        experience --log
      </SectionHeading>

      <ol data-reveal-kids className={styles.log}>
        {EXPERIENCE.map(e => (
          <li key={`${e.role}-${e.org}`}>
            {e.href?.startsWith('http') ? (
              <a href={e.href} target="_blank" rel="noopener noreferrer" className={`${styles.logRow} row-hover`}>
                <RowBody e={e} />
                <span className={`${styles.logArrow} row-arrow`} aria-hidden="true">
                  <Icon name="external" size={12} />
                </span>
              </a>
            ) : e.href ? (
              <Link href={e.href} className={`${styles.logRow} row-hover`}>
                <RowBody e={e} />
                <span className={`${styles.logArrow} row-arrow`} aria-hidden="true">
                  <Icon name="arrow-up-right" size={12} />
                </span>
              </Link>
            ) : (
              <div className={styles.logRow}>
                <RowBody e={e} />
              </div>
            )}
          </li>
        ))}
      </ol>
    </section>
  )
}
