import { useLocation, useSearchParams } from 'react-router-dom'
import { parseTitleParam } from '../../features/movies/lib/movieRouteState'

export function useHeaderSearchRoute() {
  const location = useLocation()
  const [searchParams] = useSearchParams()

  const routeTitle =
    location.pathname === '/search' ? parseTitleParam(searchParams.get('title')) : ''

  const routeValue = location.pathname === '/search' ? routeTitle : ''
  const routeKey = `${location.pathname}${location.search}`

  return {
    pathname: location.pathname,
    routeTitle,
    routeValue,
    routeKey,
  }
}
