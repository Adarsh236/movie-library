import { type PropsWithChildren, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import clsx from 'clsx'
import styles from './AppShell.module.css'
import { useMobileSidebar } from '../../hooks/useMobileSidebar'

type AppShellProps = PropsWithChildren<{
  sidebar?: ReactNode
  headerSearch?: ReactNode
  onLogoClick?: () => void
}>

export function AppShell({ children, sidebar, headerSearch, onLogoClick }: AppShellProps) {
  const location = useLocation()
  const locationKey = `${location.pathname}${location.search}`

  const { sidebarOpen, sidebarRef, toggleButtonRef, closeSidebar, toggleSidebar } =
    useMobileSidebar({ locationKey })

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <div className={styles.headerInner}>
          <button
            ref={toggleButtonRef}
            type='button'
            className={styles.mobileSidebarToggle}
            onClick={toggleSidebar}
            aria-label={sidebarOpen ? 'Close filters' : 'Open filters'}
            aria-expanded={sidebarOpen}
            aria-controls='catalog-sidebar'
          >
            {sidebarOpen ? '✕' : '☰'}
          </button>

          <button
            type='button'
            className={styles.logoButton}
            onClick={onLogoClick}
            aria-label='Go to all movies'
          >
            <span className={styles.logoAccent}>MOVIE</span>
            <span className={styles.logoText}>LIB</span>
          </button>

          <div className={styles.headerSearch}>{headerSearch}</div>
        </div>
      </header>

      <div className={styles.body}>
        <div
          className={clsx(styles.sidebarOverlay, sidebarOpen && styles.sidebarOverlayOpen)}
          onClick={closeSidebar}
          aria-hidden='true'
        />

        <aside
          ref={sidebarRef}
          id='catalog-sidebar'
          className={clsx(styles.sidebar, sidebarOpen && styles.sidebarOpen)}
        >
          {sidebar}
        </aside>

        <main className={styles.main}>{children}</main>
      </div>
    </div>
  )
}
