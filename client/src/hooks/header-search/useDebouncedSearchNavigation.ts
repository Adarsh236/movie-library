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

function isAutoSearchRoute(pathname: string): boolean {
  return pathname === '/' || pathname === '/search'
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
  const latestRouteKeyRef = useRef(routeKey)

  useEffect(() => {
    latestRouteKeyRef.current = routeKey
  }, [routeKey])

  useEffect(() => {
    const normalizedRouteTitle = normalizeSearchTitle(routeTitle)

    if (pathname !== '/search') {
      return
    }

    if (normalizedRouteTitle.length < minSearchLength) {
      return
    }

    addSearch(normalizedRouteTitle)
  }, [addSearch, minSearchLength, pathname, routeTitle])

  useEffect(() => {
    if (timerRef.current !== null) {
      window.clearTimeout(timerRef.current)
    }

    if (!isAutoSearchRoute(pathname)) {
      return
    }

    const scheduledRouteKey = routeKey
    const scheduledSearchValue = searchValue
    const scheduledPathname = pathname
    const scheduledRouteTitle = routeTitle

    timerRef.current = window.setTimeout(() => {
      if (latestRouteKeyRef.current !== scheduledRouteKey) {
        return
      }

      const normalizedValue = normalizeSearchTitle(scheduledSearchValue)

      if (shouldRedirectHome(normalizedValue)) {
        if (scheduledPathname === '/search') {
          void navigate('/', { replace: true })
        }
        return
      }

      if (
        !shouldNavigateToSearch({
          pathname: scheduledPathname,
          routeTitle: scheduledRouteTitle,
          normalizedValue,
          minSearchLength,
        })
      ) {
        return
      }

      addSearch(normalizedValue)

      void navigate(buildSearchUrl(normalizedValue), {
        replace: scheduledPathname === '/search',
      })
    }, debounceMs)

    return () => {
      if (timerRef.current !== null) {
        window.clearTimeout(timerRef.current)
        timerRef.current = null
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
