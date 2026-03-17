import { useEffect } from 'react'
import {
  normalizeSearchTitle,
  isSearchLongEnough,
} from '../../features/movies/lib/searchValidation'

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
    const normalizedRouteTitle = normalizeSearchTitle(routeTitle)

    if (pathname !== '/search') {
      return
    }

    if (!isSearchLongEnough(normalizedRouteTitle, minSearchLength)) {
      return
    }

    addSearch(normalizedRouteTitle)
  }, [addSearch, minSearchLength, pathname, routeTitle])
}
