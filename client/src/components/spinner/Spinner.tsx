import clsx from 'clsx'
import styles from './Spinner.module.css'

type SpinnerProps = {
  size?: 'sm' | 'md' | 'lg'
  label?: string
  className?: string
}

export function Spinner({ size = 'md', label = 'Loading', className }: SpinnerProps) {
  return (
    <div className={clsx(styles.root, className)} role='status' aria-live='polite'>
      <span className={clsx(styles.spinner, styles[size])} aria-hidden='true' />
      <span className={styles.label}>{label}</span>
    </div>
  )
}
