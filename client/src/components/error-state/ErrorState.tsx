import type { ReactNode } from 'react'
import styles from './ErrorState.module.css'

type ErrorStateProps = {
  title?: string
  message: string
  action?: ReactNode
}

export function ErrorState({ title = 'Something went wrong', message, action }: ErrorStateProps) {
  return (
    <div className={styles.root} role='alert'>
      <div className={styles.icon} aria-hidden='true'>
        !
      </div>

      <div className={styles.body}>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
      </div>

      {action ? <div className={styles.action}>{action}</div> : null}
    </div>
  )
}
