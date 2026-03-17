import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { AppShell } from '../components/app-shell/AppShell'
import { Header } from '../components/header/Header'
import { Sidebar } from '../components/sidebar/Sidebar'
import { useHeaderSearch } from '../hooks/header-search/useHeaderSearch'

export function RootLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const { searchValue, handleChange, handleSubmit, handleClear, resetSearchDraft } =
    useHeaderSearch()

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

  function handleSidebarClose(): void {
    setIsSidebarOpen(false)
  }

  function handlePrimaryNavigate(nextRoute: string): void {
    resetSearchDraft(nextRoute)
    setIsSidebarOpen(false)
  }

  return (
    <AppShell
      header={
        <Header
          onOpenSidebar={() => setIsSidebarOpen(true)}
          searchValue={searchValue}
          onSearchChange={handleChange}
          onSearchSubmit={handleSubmit}
          onSearchClear={handleClear}
          onPrimaryNavigate={handlePrimaryNavigate}
        />
      }
      sidebar={
        <Sidebar onNavigate={handleSidebarClose} onPrimaryNavigate={handlePrimaryNavigate} />
      }
      isSidebarOpen={isSidebarOpen}
      onSidebarClose={handleSidebarClose}
    >
      <Outlet />
    </AppShell>
  )
}
