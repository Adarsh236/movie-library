import { z } from 'zod'

const DEFAULT_CLIENT_ORIGINS = ['http://localhost:5173'] as const

export const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),

  PORT: z.preprocess((value) => {
    if (value === undefined || value === null) {
      return undefined
    }

    if (typeof value === 'string') {
      const normalized = value.trim()

      if (!normalized) {
        return undefined
      }

      const parsed = Number.parseInt(normalized, 10)

      return Number.isInteger(parsed) && parsed > 0 ? parsed : value
    }

    return value
  }, z.number().int().positive().default(4000)),

  CLIENT_ORIGINS: z.preprocess(
    (value) => {
      if (value === undefined || value === null || value === '') {
        return DEFAULT_CLIENT_ORIGINS
      }

      if (typeof value === 'string') {
        return value
          .split(',')
          .map((origin) => origin.trim())
          .filter(Boolean)
      }

      return value
    },
    z
      .array(z.url())
      .min(1)
      .default([...DEFAULT_CLIENT_ORIGINS]),
  ),

  TMDB_ACCESS_TOKEN: z.string().min(1, 'TMDB_ACCESS_TOKEN is required'),
})

export type AppEnv = z.infer<typeof envSchema>
