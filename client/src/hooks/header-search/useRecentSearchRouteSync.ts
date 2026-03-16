import { useEffect } from 'react'
import { normalizeSearchValue, isSearchLongEnough } from './search.helpers'

type UseRecentSearchRouteSyncArgs = {
  pathname: string
  routeTitle: string
  minSearchLength: number
  addSearch: (value: string) => void
}

export function useRecentSearchRouteSync({
  pathname,
  routeTitle,
  minSearchLength,
  addSearch,
}: UseRecentSearchRouteSyncArgs) {
  useEffect(() => {
    const normalizedRouteTitle = normalizeSearchValue(routeTitle)

    if (pathname !== '/search') {
      return
    }

    if (!isSearchLongEnough(normalizedRouteTitle, minSearchLength)) {
      return
    }

    addSearch(normalizedRouteTitle)
  }, [addSearch, minSearchLength, pathname, routeTitle])
}
