import { baseApi } from './baseApi'
import type { GenreOption, MoviesResponse } from '../features/movies/types'

type GetMoviesParams = {
  page?: number
  genre?: string
}

type SearchMoviesParams = {
  title: string
  page?: number
  genre?: string
}

function cleanParams(params: Record<string, string | number | undefined>) {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== '' && value !== undefined),
  )
}

export const moviesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMovies: builder.query<MoviesResponse, GetMoviesParams>({
      query: ({ page = 1, genre = '' }) => ({
        url: '/movies',
        params: cleanParams({
          page,
          genre: genre.trim(),
        }),
      }),
      providesTags: ['Movies'],
    }),

    searchMovies: builder.query<MoviesResponse, SearchMoviesParams>({
      query: ({ title, page = 1, genre = '' }) => ({
        url: '/movies/search',
        params: cleanParams({
          title: title.trim(),
          page,
          genre: genre.trim(),
        }),
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

export const { useGetMoviesQuery, useSearchMoviesQuery, useGetGenresQuery } = moviesApi
