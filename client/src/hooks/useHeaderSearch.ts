import { useEffect, useState } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useDebouncedValue } from './useDebouncedValue'
import { buildSearchUrl, parseTitleParam } from '../features/movies/lib/movieRouteState'
import { useRecentSearches } from './useRecentSearches'

type UseHeaderSearchOptions = {
  debounceMs?: number
  minSearchLength?: number
}

type UseHeaderSearchResult = {
  searchValue: string
  handleChange: (nextValue: string) => void
  handleSubmit: (value: string) => void
  handleClear: () => void
}

function normalizeSearchValue(value: string): string {
  return value.trim()
}

export function useHeaderSearch(options: UseHeaderSearchOptions = {}): UseHeaderSearchResult {
  const { debounceMs = 700, minSearchLength = 3 } = options

  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { addSearch } = useRecentSearches()

  const routeTitle =
    location.pathname === '/search' ? parseTitleParam(searchParams.get('title')) : ''

  const routeInputValue = location.pathname === '/search' ? routeTitle : ''

  const [searchValue, setSearchValue] = useState(routeInputValue)
  const [hasPendingUserInput, setHasPendingUserInput] = useState(false)

  const debouncedSearchValue = useDebouncedValue(searchValue, debounceMs)

  useEffect(() => {
    setSearchValue(routeInputValue)
    setHasPendingUserInput(false)
  }, [routeInputValue, location.pathname, location.search])

  function commitSearch(rawValue: string, options?: { replace?: boolean }): void {
    const normalizedValue = normalizeSearchValue(rawValue)

    setSearchValue(normalizedValue)
    setHasPendingUserInput(false)

    if (!normalizedValue) {
      void navigate('/', { replace: true })
      return
    }

    if (normalizedValue.length < minSearchLength) {
      return
    }

    addSearch(normalizedValue)

    void navigate(buildSearchUrl(normalizedValue), {
      replace: options?.replace ?? location.pathname === '/search',
    })
  }

  useEffect(() => {
    if (!hasPendingUserInput) {
      return
    }

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

    if (normalizedDebouncedValue.length < minSearchLength) {
      return
    }

    if (location.pathname === '/search' && routeTitle === normalizedDebouncedValue) {
      return
    }

    addSearch(normalizedDebouncedValue)

    void navigate(buildSearchUrl(normalizedDebouncedValue), {
      replace: location.pathname === '/search',
    })
  }, [
    addSearch,
    debouncedSearchValue,
    hasPendingUserInput,
    location.pathname,
    minSearchLength,
    navigate,
    routeTitle,
    searchValue,
  ])

  function handleChange(nextValue: string): void {
    setSearchValue(nextValue)
    setHasPendingUserInput(true)
  }

  function handleSubmit(value: string): void {
    commitSearch(value)
  }

  function handleClear(): void {
    setSearchValue('')
    setHasPendingUserInput(false)
    void navigate('/', { replace: true })
  }

  return {
    searchValue,
    handleChange,
    handleSubmit,
    handleClear,
  }
}
