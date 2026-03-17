import { useEffect, useRef } from 'react'
import { buildSearchUrl } from '../../features/movies/lib/movieRouteState'
import {
  normalizeSearchTitle,
  shouldNavigateToSearch,
  shouldRedirectHome,
} from '../../features/movies/lib/searchValidation'

type UseDebouncedSearchNavigationArgs = {
  searchValue: string
  routeKey: string
  pathname: string
  routeTitle: string
  debounceMs: number
  minSearchLength: number
  navigate: (to: string, options?: { replace?: boolean }) => void
  addSearch: (value: string) => void
}

export function useDebouncedSearchNavigation({
  searchValue,
  routeKey,
  pathname,
  routeTitle,
  debounceMs,
  minSearchLength,
  navigate,
  addSearch,
}: UseDebouncedSearchNavigationArgs) {
  const timerRef = useRef<number | null>(null)

  useEffect(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
    }

    const capturedRouteKey = routeKey
    const capturedValue = searchValue

    timerRef.current = window.setTimeout(() => {
      const normalizedValue = normalizeSearchTitle(capturedValue)

      if (capturedRouteKey !== routeKey) {
        return
      }

      if (shouldRedirectHome(normalizedValue)) {
        if (pathname === '/search') {
          navigate('/', { replace: true })
        }
        return
      }

      if (
        !shouldNavigateToSearch({
          pathname,
          routeTitle,
          normalizedValue,
          minSearchLength,
        })
      ) {
        return
      }

      addSearch(normalizedValue)

      navigate(buildSearchUrl(normalizedValue), {
        replace: pathname === '/search',
      })
    }, debounceMs)

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
      }
    }
  }, [
    addSearch,
    debounceMs,
    minSearchLength,
    navigate,
    pathname,
    routeKey,
    routeTitle,
    searchValue,
  ])
}
