import { baseApi } from './baseApi'
import type { Genre, GenresResponse, MoviesResponse } from '../types/types'
import { ApiTag } from './api.constants'

type GetMoviesParams = {
  page?: number
}

type SearchMoviesParams = {
  title: string
  page?: number
}

type GetMoviesByGenreParams = {
  genreId: number
  page?: number
}

type QueryParamValue = string | number | boolean | null | undefined

function buildQueryParams<T extends Record<string, QueryParamValue>>(params: T) {
  return Object.fromEntries(
    Object.entries(params).filter(
      ([, value]) => value !== '' && value !== null && value !== undefined,
    ),
  )
}

export const moviesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMovies: builder.query<MoviesResponse, GetMoviesParams | void>({
      query: (params) => {
        const page = params?.page ?? 1

        return {
          url: '/movies',
          params: buildQueryParams({ page }),
        }
      },
      providesTags: [ApiTag.Movies],
    }),

    searchMovies: builder.query<MoviesResponse, SearchMoviesParams>({
      query: ({ title, page = 1 }) => ({
        url: '/movies/search',
        params: buildQueryParams({
          title: title.trim(),
          page,
        }),
      }),
      providesTags: [ApiTag.Movies],
    }),

    getMoviesByGenre: builder.query<MoviesResponse, GetMoviesByGenreParams>({
      query: ({ genreId, page = 1 }) => ({
        url: `/movies/genre/${genreId}`,
        params: buildQueryParams({ page }),
      }),
      providesTags: [ApiTag.Movies],
    }),

    getGenres: builder.query<Genre[], void>({
      query: () => ({
        url: '/genres',
      }),
      transformResponse: (response: GenresResponse) => response.items,
      providesTags: [ApiTag.Genres],
    }),
  }),
  overrideExisting: false,
})

export const {
  useGetMoviesQuery,
  useSearchMoviesQuery,
  useGetMoviesByGenreQuery,
  useGetGenresQuery,
} = moviesApi
