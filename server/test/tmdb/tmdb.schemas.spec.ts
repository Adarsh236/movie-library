import { tmdbMoviesResponseSchema } from '../../src/tmdb/tmdb.schemas'

describe('tmdbMoviesResponseSchema', () => {
  it('accepts a valid TMDB movies payload', () => {
    const parsed = tmdbMoviesResponseSchema.safeParse({
      page: 1,
      results: [
        {
          id: 101,
          title: 'Batman Begins',
          overview: 'Some overview',
          poster_path: '/poster.jpg',
          backdrop_path: '/backdrop.jpg',
          release_date: '2005-06-10',
          vote_average: 7.8,
          genre_ids: [28, 12],
        },
      ],
      total_pages: 1,
      total_results: 1,
    })

    expect(parsed.success).toBe(true)
  })

  it('rejects malformed TMDB payloads', () => {
    const parsed = tmdbMoviesResponseSchema.safeParse({
      page: '1',
      results: 'invalid',
      total_pages: 1,
      total_results: 1,
    })

    expect(parsed.success).toBe(false)
  })
})
