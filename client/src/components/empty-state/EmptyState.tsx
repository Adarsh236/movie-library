import type { ReactNode } from 'react'
import styles from './EmptyState.module.css'

type EmptyStateProps = {
  title: string
  description?: string
  action?: ReactNode
}

export function EmptyState({ title, description, action }: EmptyStateProps) {
  return (
    <div className={styles.root}>
      <div className={styles.icon} aria-hidden='true'>
        ○
      </div>

      <div className={styles.body}>
        <h2 className={styles.title}>{title}</h2>
        {description ? <p className={styles.description}>{description}</p> : null}
      </div>

      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  )
}
