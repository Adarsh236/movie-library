import type { GenreOption, MoviesResponse } from '../types/types'
import { baseApi } from './baseApi'

type GetMoviesParams = {
  page?: number
}

type SearchMoviesParams = {
  title: string
  page?: number
}

type GetMoviesByGenreParams = {
  genreId: string
  page?: number
}

function cleanParams(params: Record<string, string | number | undefined>) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== undefined),
  )
}

export const moviesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMovies: builder.query<MoviesResponse, GetMoviesParams>({
      query: ({ page = 1 }) => ({
        url: '/movies',
        params: cleanParams({ page }),
      }),
      providesTags: ['Movies'],
    }),

    searchMovies: builder.query<MoviesResponse, SearchMoviesParams>({
      query: ({ title, page = 1 }) => ({
        url: '/movies/search',
        params: cleanParams({
          title: title.trim(),
          page,
        }),
      }),
      providesTags: ['Movies'],
    }),

    getMoviesByGenre: builder.query<MoviesResponse, GetMoviesByGenreParams>({
      query: ({ genreId, page = 1 }) => ({
        url: `/movies/genre/${genreId}`,
        params: cleanParams({ page }),
      }),
      providesTags: ['Movies'],
    }),

    getGenres: builder.query<{ items: GenreOption[] }, void>({
      query: () => ({
        url: '/movies/genres',
      }),
      providesTags: ['Genres'],
    }),
  }),
})

export const {
  useGetMoviesQuery,
  useSearchMoviesQuery,
  useGetMoviesByGenreQuery,
  useGetGenresQuery,
} = moviesApi
