import { useEffect, useState } from 'react'
import { NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { buildSearchUrl, parseTitleParam } from '../../features/movies/lib/movieRouteState'
import { useRecentSearches } from '../../hooks/useRecentSearches'
import styles from './Header.module.css'
import { SearchBar } from '../search-bar/SearchBar'

type HeaderProps = {
  onOpenSidebar: () => void
}

type SearchDraftState = {
  routeKey: string
  value: string
}

const SEARCH_DEBOUNCE_MS = 400
const MIN_SEARCH_LENGTH = 3

function normalizeSearchValue(value: string): string {
  return value.trim()
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { addSearch } = useRecentSearches()

  const routeTitle =
    location.pathname === '/search' ? parseTitleParam(searchParams.get('title')) : ''

  const routeInputValue = location.pathname === '/search' ? routeTitle : ''
  const routeKey = `${location.pathname}?title=${routeTitle}`

  const [draftState, setDraftState] = useState<SearchDraftState>(() => ({
    routeKey,
    value: routeInputValue,
  }))

  const searchValue = draftState.routeKey === routeKey ? draftState.value : routeInputValue
  const debouncedSearchValue = useDebouncedValue(searchValue, SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    const normalizedCurrentValue = normalizeSearchValue(searchValue)
    const normalizedDebouncedValue = normalizeSearchValue(debouncedSearchValue)

    if (normalizedDebouncedValue !== normalizedCurrentValue) {
      return
    }

    if (!normalizedDebouncedValue) {
      if (location.pathname === '/search') {
        void navigate('/', { replace: true })
      }

      return
    }

    if (normalizedDebouncedValue.length < MIN_SEARCH_LENGTH) {
      return
    }

    if (location.pathname === '/search' && routeTitle === normalizedDebouncedValue) {
      return
    }

    void navigate(buildSearchUrl(normalizedDebouncedValue), {
      replace: location.pathname === '/search',
    })
  }, [debouncedSearchValue, location.pathname, navigate, routeTitle, searchValue])

  function handleChange(nextValue: string): void {
    setDraftState({
      routeKey,
      value: nextValue,
    })
  }

  function handleSubmit(value: string): void {
    const normalizedValue = normalizeSearchValue(value)

    setDraftState({
      routeKey,
      value: normalizedValue,
    })

    if (!normalizedValue) {
      void navigate('/')
      return
    }

    if (normalizedValue.length < MIN_SEARCH_LENGTH) {
      return
    }

    addSearch(normalizedValue)
    void navigate(buildSearchUrl(normalizedValue))
  }

  function handleClear(): void {
    setDraftState({
      routeKey,
      value: '',
    })

    void navigate('/', { replace: true })
  }

  return (
    <div className={styles.header}>
      <div className={styles.start}>
        <button
          type='button'
          className={styles.menuButton}
          onClick={onOpenSidebar}
          aria-label='Open navigation menu'
        >
          ☰
        </button>

        <NavLink to='/' className={styles.logo}>
          MOVIE Lib
        </NavLink>
      </div>

      <div className={styles.searchSlot}>
        <SearchBar
          value={searchValue}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClear={handleClear}
          placeholder='Search movies by title'
        />
      </div>

      <nav className={styles.end} aria-label='Top navigation'>
        <NavLink
          to='/about'
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          About
        </NavLink>
      </nav>
    </div>
  )
}
