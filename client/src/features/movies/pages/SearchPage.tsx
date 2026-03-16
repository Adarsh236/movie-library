import { skipToken } from '@reduxjs/toolkit/query'
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom'
import { useSearchMoviesQuery } from '../api/moviesApi'
import { buildSearchUrl, parsePageParam, parseTitleParam } from '../lib/movieRouteState'
import { PageContent } from '../components/page-content/PageContent'

const MIN_SEARCH_LENGTH = 2

export function SearchPage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const title = parseTitleParam(searchParams.get('title'))
  const page = parsePageParam(searchParams.get('page'))

  const isValidSearch = title.length >= MIN_SEARCH_LENGTH

  const query = useSearchMoviesQuery(isValidSearch ? { title, page } : skipToken)

  if (!isValidSearch) {
    return <Navigate to='/' replace />
  }

  return (
    <PageContent
      title={`Results for "${title}"`}
      subtitle={query.data ? `${query.data.totalItems} movies found` : 'Searching...'}
      data={query.data}
      isLoading={query.isLoading}
      isFetching={query.isFetching}
      error={query.error}
      onPageChange={(nextPage) => {
        void navigate(buildSearchUrl(title, nextPage))
      }}
      emptyState={<p>No matches found for "{title}".</p>}
    />
  )
}
