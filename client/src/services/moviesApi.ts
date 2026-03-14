import { baseApi } from './baseApi'
import type { GenreOption, MoviesResponse } from '../features/movies/types'

export interface GetMoviesParams {
  page?: number
  query?: string
  genre?: string
}

export const moviesApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getMovies: builder.query<MoviesResponse, GetMoviesParams>({
      query: ({ page = 1, query = '', genre = '' }) => ({
        url: '/movies',
        params: {
          page,
          query: query.trim(),
          genre,
        },
      }),
      providesTags: ['Movies'],
      keepUnusedDataFor: 60,
    }),
    getGenres: builder.query<{ items: GenreOption[] }, void>({
      query: () => ({
        url: '/movies/genres',
      }),
      providesTags: ['Genres'],
      keepUnusedDataFor: 60 * 60,
    }),
  }),
})

export const { useGetMoviesQuery, useGetGenresQuery } = moviesApi
