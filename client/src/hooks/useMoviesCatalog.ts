import { skipToken } from '@reduxjs/toolkit/query'
import {
  useGetMoviesByGenreQuery,
  useGetMoviesQuery,
  useSearchMoviesQuery,
} from '../services/moviesApi'

type UseMoviesCatalogArgs = {
  mode: 'all' | 'title' | 'genre'
  page: number
  title: string
  genreId: string
}

export function useMoviesCatalog({ mode, page, title, genreId }: UseMoviesCatalogArgs) {
  const allMoviesQuery = useGetMoviesQuery(
    mode === 'all'
      ? {
          page,
        }
      : skipToken,
  )

  const searchQuery = useSearchMoviesQuery(
    mode === 'title'
      ? {
          title,
          page,
        }
      : skipToken,
  )

  const genreQuery = useGetMoviesByGenreQuery(
    mode === 'genre'
      ? {
          genreId,
          page,
        }
      : skipToken,
  )

  if (mode === 'title') {
    return { mode, result: searchQuery } as const
  }

  if (mode === 'genre') {
    return { mode, result: genreQuery } as const
  }

  return { mode, result: allMoviesQuery } as const
}
