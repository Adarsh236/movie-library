import { z } from 'zod'

export const tmdbGenreSchema = z.object({
  id: z.number().int().positive(),
  name: z.string().min(1),
})

export const tmdbGenresResponseSchema = z.object({
  genres: z.array(tmdbGenreSchema),
})

export const tmdbMovieSchema = z.object({
  id: z.number().int().positive(),
  title: z.string().min(1),
  poster_path: z.string().nullable().optional(),
  backdrop_path: z.string().nullable().optional(),
  release_date: z.string().optional().default(''),
  vote_average: z.number().optional().default(0),
  genre_ids: z.array(z.number().int()).optional().default([]),
})

export const tmdbMoviesResponseSchema = z.object({
  page: z.number().int().positive(),
  results: z.array(tmdbMovieSchema),
  total_pages: z.number().int().nonnegative(),
  total_results: z.number().int().nonnegative(),
})
