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

type SearchDraftState = {
  routeKey: string
  value: string
  hasPendingUserInput: boolean
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
  const routeKey = `${location.pathname}?title=${routeTitle}`

  const [draftState, setDraftState] = useState<SearchDraftState>(() => ({
    routeKey,
    value: routeInputValue,
    hasPendingUserInput: false,
  }))

  const activeDraft =
    draftState.routeKey === routeKey
      ? draftState
      : {
          routeKey,
          value: routeInputValue,
          hasPendingUserInput: false,
        }

  const searchValue = activeDraft.value
  const hasPendingUserInput = activeDraft.hasPendingUserInput
  const debouncedSearchValue = useDebouncedValue(searchValue, debounceMs)

  useEffect(() => {
    const normalizedRouteTitle = normalizeSearchValue(routeTitle)

    if (location.pathname !== '/search') {
      return
    }

    if (normalizedRouteTitle.length < minSearchLength) {
      return
    }

    addSearch(normalizedRouteTitle)
  }, [addSearch, location.pathname, minSearchLength, routeTitle])

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
    setDraftState({
      routeKey,
      value: nextValue,
      hasPendingUserInput: true,
    })
  }

  function handleSubmit(value: string): void {
    const normalizedValue = normalizeSearchValue(value)

    setDraftState({
      routeKey,
      value: normalizedValue,
      hasPendingUserInput: false,
    })

    if (!normalizedValue) {
      void navigate('/', { replace: true })
      return
    }

    if (normalizedValue.length < minSearchLength) {
      return
    }

    addSearch(normalizedValue)

    void navigate(buildSearchUrl(normalizedValue), {
      replace: location.pathname === '/search',
    })
  }

  function handleClear(): void {
    setDraftState({
      routeKey,
      value: '',
      hasPendingUserInput: false,
    })

    void navigate('/', { replace: true })
  }

  return {
    searchValue,
    handleChange,
    handleSubmit,
    handleClear,
  }
}
