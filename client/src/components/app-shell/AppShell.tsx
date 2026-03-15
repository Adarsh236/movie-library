import type { PropsWithChildren, ReactNode } from 'react'
import clsx from 'clsx'
import styles from './AppShell.module.css'

type AppShellProps = PropsWithChildren<{
  header: ReactNode
  sidebar: ReactNode
  isSidebarOpen: boolean
  onSidebarClose: () => void
}>

export function AppShell({
  header,
  sidebar,
  isSidebarOpen,
  onSidebarClose,
  children,
}: AppShellProps) {
  return (
    <div className={styles.shell}>
      <header className={styles.header}>{header}</header>

      <div
        className={clsx(styles.overlay, isSidebarOpen && styles.overlayVisible)}
        aria-hidden={!isSidebarOpen}
        onClick={onSidebarClose}
      />

      <aside
        className={clsx(styles.sidebar, isSidebarOpen && styles.sidebarOpen)}
        aria-label='Sidebar'
      >
        {sidebar}
      </aside>

      <main className={styles.main} id='main-content'>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  )
}
