import { useEffect, useMemo, useRef, useState } from 'react'
import { NavLink, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useDebouncedValue } from '../../hooks/useDebouncedValue'
import { buildSearchUrl, parseTitleParam } from '../../features/movies/lib/movieRouteState'
import { useRecentSearches } from '../../hooks/useRecentSearches'
import styles from './Header.module.css'
import { SearchBar } from '../search-bar/SearchBar'

type HeaderProps = {
  onOpenSidebar: () => void
}

const SEARCH_DEBOUNCE_MS = 400
const MIN_SEARCH_LENGTH = 2

export function Header({ onOpenSidebar }: HeaderProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { addSearch } = useRecentSearches()

  const isSyncingFromRouteRef = useRef(false)

  const routeTitle = useMemo(() => {
    return location.pathname === '/search' ? parseTitleParam(searchParams.get('title')) : ''
  }, [location.pathname, searchParams])

  const [searchValue, setSearchValue] = useState(routeTitle)
  const debouncedSearchValue = useDebouncedValue(searchValue, SEARCH_DEBOUNCE_MS)

  useEffect(() => {
    const nextValue = location.pathname === '/search' ? routeTitle : ''

    isSyncingFromRouteRef.current = true

    setSearchValue((currentValue) => {
      return currentValue === nextValue ? currentValue : nextValue
    })
  }, [location.pathname, routeTitle])

  useEffect(() => {
    const nextRouteValue = location.pathname === '/search' ? routeTitle : ''

    if (isSyncingFromRouteRef.current) {
      if (searchValue === nextRouteValue) {
        isSyncingFromRouteRef.current = false
      }

      return
    }

    const normalizedInputValue = searchValue.trim()
    const normalizedDebouncedValue = debouncedSearchValue.trim()

    if (normalizedDebouncedValue !== normalizedInputValue) {
      return
    }

    if (!normalizedDebouncedValue) {
      if (location.pathname === '/search') {
        navigate('/', { replace: true })
      }

      return
    }

    if (normalizedDebouncedValue.length < MIN_SEARCH_LENGTH) {
      return
    }

    if (location.pathname === '/search' && routeTitle === normalizedDebouncedValue) {
      return
    }

    navigate(buildSearchUrl(normalizedDebouncedValue), {
      replace: location.pathname === '/search',
    })
  }, [debouncedSearchValue, searchValue, location.pathname, navigate, routeTitle])

  function handleSubmit(value: string) {
    const normalizedValue = value.trim()

    if (!normalizedValue) {
      setSearchValue('')
      navigate('/')
      return
    }

    if (normalizedValue.length < MIN_SEARCH_LENGTH) {
      return
    }

    addSearch(normalizedValue)
    navigate(buildSearchUrl(normalizedValue))
  }

  function handleClear() {
    isSyncingFromRouteRef.current = true
    setSearchValue('')
    navigate('/', { replace: true })
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
          CINEVAULT
        </NavLink>
      </div>

      <div className={styles.searchSlot}>
        <SearchBar
          value={searchValue}
          onChange={setSearchValue}
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
