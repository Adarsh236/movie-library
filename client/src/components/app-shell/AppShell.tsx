import type { PropsWithChildren, ReactNode } from 'react'
import styles from './AppShell.module.css'

type AppShellProps = PropsWithChildren<{
  sidebar?: ReactNode
}>

export function AppShell({ children, sidebar }: AppShellProps) {
  return (
    <main className={styles.page}>
      {sidebar ? <aside className={styles.sidebar}>{sidebar}</aside> : null}
      <section className={styles.content}>{children}</section>
    </main>
  )
}
