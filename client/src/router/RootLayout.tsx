import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import { AppShell } from '../components/app-shell/AppShell'
import { Header } from '../components/header/Header'
import { Sidebar } from '../components/sidebar/Sidebar'

export function RootLayout() {
  const location = useLocation()

  const routeKey = useMemo(
    () => `${location.pathname}${location.search}`,
    [location.pathname, location.search],
  )

  const [openedForRoute, setOpenedForRoute] = useState<string | null>(null)

  const isSidebarOpen = openedForRoute === routeKey

  useEffect(() => {
    if (!isSidebarOpen) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [isSidebarOpen])

  return (
    <AppShell
      header={<Header onOpenSidebar={() => setOpenedForRoute(routeKey)} />}
      sidebar={<Sidebar onNavigate={() => setOpenedForRoute(null)} />}
      isSidebarOpen={isSidebarOpen}
      onSidebarClose={() => setOpenedForRoute(null)}
    >
      <Outlet />
    </AppShell>
  )
}
