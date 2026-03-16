import { CACHE_MANAGER } from '@nestjs/cache-manager'
import { Test, TestingModule } from '@nestjs/testing'
import { MoviesService } from '../../src/movies/movies.service'
import { TmdbService } from '../../src/tmdb/tmdb.service'

describe('MoviesService', () => {
  let service: MoviesService

  const tmdbServiceMock = {
    getGenres: jest.fn(),
    discoverMovies: jest.fn(),
    discoverMoviesByGenre: jest.fn(),
    searchMoviesByTitle: jest.fn(),
  }

  const cacheManagerMock = {
    get: jest.fn(),
    set: jest.fn(),
  }

  beforeEach(async () => {
    jest.clearAllMocks()

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MoviesService,
        {
          provide: TmdbService,
          useValue: tmdbServiceMock,
        },
        {
          provide: CACHE_MANAGER,
          useValue: cacheManagerMock,
        },
      ],
    }).compile()

    service = module.get(MoviesService)
  })

  it('returns cached movies without calling TMDB', async () => {
    const cachedValue = {
      items: [
        {
          id: 1,
          title: 'Cached Movie',
          releaseDateLabel: 'Jan 1, 2024',
          posterUrl: null,
          rating: 7.5,
          genres: ['Action'],
        },
      ],
      page: 1,
      totalItems: 1,
      totalPages: 1,
    }

    cacheManagerMock.get.mockResolvedValueOnce(cachedValue)

    const result = await service.getMovies({ page: 1 })

    expect(result).toEqual(cachedValue)
    expect(tmdbServiceMock.discoverMovies).not.toHaveBeenCalled()
  })

  it('fetches and caches genres on cache miss', async () => {
    cacheManagerMock.get.mockResolvedValueOnce(null)

    tmdbServiceMock.getGenres.mockResolvedValueOnce({
      genres: [{ id: 28, name: 'Action' }],
    })

    const result = await service.getGenres()

    expect(result).toEqual({
      items: [{ id: '28', label: 'Action' }],
    })

    expect(tmdbServiceMock.getGenres).toHaveBeenCalledTimes(1)
    expect(cacheManagerMock.set).toHaveBeenCalledWith(
      expect.any(String),
      {
        items: [{ id: '28', label: 'Action' }],
      },
      expect.any(Number),
    )
  })
})
