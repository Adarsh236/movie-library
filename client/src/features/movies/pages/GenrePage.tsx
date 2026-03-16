import { skipToken } from '@reduxjs/toolkit/query'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useGetGenresQuery, useGetMoviesByGenreQuery } from '../api/moviesApi'
import { PageContent } from '../components/page-content/PageContent'
import { buildGenreUrl, parseGenreIdParam, parsePageParam } from '../lib/movieRouteState'
import { Spinner } from '../../../components/spinner/Spinner'
import { ErrorState } from '../../../components/error-state/ErrorState'
import { EmptyState } from '../../../components/empty-state/EmptyState'
import { getApiErrorMessage } from '../api/api.errors'

export function GenrePage() {
  const navigate = useNavigate()
  const { genreId: genreIdParam } = useParams()
  const [searchParams] = useSearchParams()

  const genreId = parseGenreIdParam(genreIdParam)
  const page = parsePageParam(searchParams.get('page'))

  const genresQuery = useGetGenresQuery()

  const selectedGenre = genresQuery.data?.find((genre) => Number(genre.id) === genreId)

  const moviesQuery = useGetMoviesByGenreQuery(
    genreId
      ? {
          genreId,
          page,
        }
      : skipToken,
  )

  if (genresQuery.isLoading) {
    return <Spinner size='lg' label='Loading genre...' />
  }

  if (genresQuery.isError) {
    return <ErrorState message={getApiErrorMessage(genresQuery.error)} />
  }

  if (!genreId || !selectedGenre) {
    return <EmptyState title='Genre not found' description='The selected genre does not exist.' />
  }

  return (
    <PageContent
      title={selectedGenre.label}
      subtitle='Browse movies by genre.'
      data={moviesQuery.data}
      isLoading={moviesQuery.isLoading}
      isFetching={moviesQuery.isFetching}
      error={moviesQuery.error}
      onPageChange={(nextPage) => {
        void navigate(buildGenreUrl(genreId, nextPage))
      }}
      emptyState={
        <EmptyState
          title={`No ${selectedGenre.label} movies found`}
          description='Try another genre or go back to all movies.'
        />
      }
    />
  )
}
