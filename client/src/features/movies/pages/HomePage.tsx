import { useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useGetMoviesQuery } from '../api/moviesApi'
import { PageContent } from '../components/page-content/PageContent'
import { buildHomeUrl, parsePageParam } from '../lib/movieRouteState'

export function HomePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const page = parsePageParam(searchParams.get('page'))
  const query = useGetMoviesQuery({ page })

  const handlePageChange = useCallback(
    (nextPage: number) => {
      void navigate(buildHomeUrl(nextPage))
    },
    [navigate],
  )

  return (
    <PageContent
      title='All Movies'
      subtitle='Browse the latest movie catalogue.'
      data={query.data}
      isLoading={query.isLoading}
      isFetching={query.isFetching}
      error={query.error}
      onPageChange={handlePageChange}
    />
  )
}
