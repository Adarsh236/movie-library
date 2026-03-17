import { useNavigate } from 'react-router-dom'
import { buildSearchUrl } from '../../features/movies/lib/movieRouteState'
import { useSearchDraft } from './useSearchDraft'
import { useRecentSearchRouteSync } from './useRecentSearchRouteSync'
import { useDebouncedSearchNavigation } from './useDebouncedSearchNavigation'
import { useRecentSearches } from '../useRecentSearches'
import { useHeaderSearchRoute } from './useHeaderSearchRoute'
import {
  getValidSearchTitle,
  normalizeSearchTitle,
  SEARCH_TITLE_MIN_LENGTH,
} from '../../features/movies/lib/searchValidation'

type UseHeaderSearchOptions = {
  debounceMs?: number
  minSearchLength?: number
}

export function useHeaderSearch(options: UseHeaderSearchOptions = {}) {
  const { debounceMs = 700, minSearchLength = SEARCH_TITLE_MIN_LENGTH } = options

  const navigate = useNavigate()
  const { addSearch } = useRecentSearches()

  const { pathname, routeTitle, routeValue, routeKey } = useHeaderSearchRoute()
  const { searchValue, setDraftValue } = useSearchDraft(routeKey, routeValue)

  useRecentSearchRouteSync({
    pathname,
    routeTitle,
    minSearchLength,
    addSearch,
  })

  useDebouncedSearchNavigation({
    searchValue,
    routeKey,
    pathname,
    routeTitle,
    debounceMs,
    minSearchLength,
    navigate: (to, options) => void navigate(to, options),
    addSearch,
  })

  function handleChange(nextValue: string) {
    setDraftValue(nextValue)
  }

  function handleSubmit(value: string) {
    const normalizedValue = normalizeSearchTitle(value)

    setDraftValue(normalizedValue)

    if (!normalizedValue) {
      void navigate('/', { replace: true })
      return
    }

    if (!getValidSearchTitle(normalizedValue)) {
      return
    }

    addSearch(normalizedValue)

    void navigate(buildSearchUrl(normalizedValue), {
      replace: pathname === '/search',
    })
  }

  function handleClear() {
    setDraftValue('')
    void navigate('/', { replace: true })
  }

  return {
    searchValue,
    handleChange,
    handleSubmit,
    handleClear,
  }
}
