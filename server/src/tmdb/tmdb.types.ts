import z from 'zod'
import { tmdbGenresResponseSchema, tmdbMoviesResponseSchema } from './tmdb.schemas'

export interface TmdbGenre {
  id: number
  name: string
}

export interface TmdbMovie {
  id: number
  title: string
  release_date?: string
  poster_path?: string | null
  vote_average: number
  genre_ids?: number[]
}

export type TmdbGenresResponse = z.infer<typeof tmdbGenresResponseSchema>
export type TmdbMoviesResponse = z.infer<typeof tmdbMoviesResponseSchema>
