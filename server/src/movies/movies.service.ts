import { CACHE_MANAGER, type Cache } from '@nestjs/cache-manager'
import { Inject, Injectable } from '@nestjs/common'
import { PageQueryDto } from './dto/page-query.dto'
import { SearchMoviesQueryDto } from './dto/search-movies-query.dto'
import { buildGenreMap, mapGenres, mapMovieItem } from './mappers/movie.mapper'
import { TmdbService } from '../tmdb/tmdb.service'
import type { GenreResponseDto, MoviesResponseDto } from './movies.types'

const CACHE_TTL_MS = {
  SEARCH: 30_000, // 30s
  MOVIES: 60_000, // 60s
  GENRES: 86_400_000, // 24h
} as const

@Injectable()
export class MoviesService {
  constructor(
    private readonly tmdbService: TmdbService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async getMovies(query: PageQueryDto): Promise<MoviesResponseDto> {
    const key = `movies:discover:page:${query.page}`
    const cached = await this.cacheManager.get<MoviesResponseDto>(key)

    if (cached) {
      return cached
    }

    const genreMap = await this.getGenreMap()
    const source = await this.tmdbService.discoverMovies(query.page)

    const mapped: MoviesResponseDto = {
      items: (source.results ?? []).map((movie) => mapMovieItem(movie, genreMap)),
      page: source.page,
      totalItems: source.total_results,
      totalPages: source.total_pages,
    }

    await this.cacheManager.set(key, mapped, CACHE_TTL_MS.MOVIES)

    return mapped
  }

  async searchMovies(query: SearchMoviesQueryDto): Promise<MoviesResponseDto> {
    const normalizedTitle = query.title.trim().toLowerCase()
    const key = `movies:search:${encodeURIComponent(normalizedTitle)}:page:${query.page}`
    const cached = await this.cacheManager.get<MoviesResponseDto>(key)

    if (cached) {
      return cached
    }

    const genreMap = await this.getGenreMap()
    const source = await this.tmdbService.searchMoviesByTitle(query.title, query.page)

    const mapped: MoviesResponseDto = {
      items: (source.results ?? []).map((movie) => mapMovieItem(movie, genreMap)),
      page: source.page,
      totalItems: source.total_results,
      totalPages: source.total_pages,
    }

    await this.cacheManager.set(key, mapped, CACHE_TTL_MS.SEARCH)

    return mapped
  }

  async getMoviesByGenre(genreId: number, query: PageQueryDto): Promise<MoviesResponseDto> {
    const key = `movies:genre:${genreId}:page:${query.page}`
    const cached = await this.cacheManager.get<MoviesResponseDto>(key)

    if (cached) {
      return cached
    }

    const genreMap = await this.getGenreMap()
    const source = await this.tmdbService.discoverMoviesByGenre(genreId, query.page)

    const mapped: MoviesResponseDto = {
      items: (source.results ?? []).map((movie) => mapMovieItem(movie, genreMap)),
      page: source.page,
      totalItems: source.total_results,
      totalPages: source.total_pages,
    }

    await this.cacheManager.set(key, mapped, CACHE_TTL_MS.MOVIES)

    return mapped
  }

  async getGenres(): Promise<{ items: GenreResponseDto[] }> {
    const key = 'movies:genres:list'
    const cached = await this.cacheManager.get<{ items: GenreResponseDto[] }>(key)

    if (cached) {
      return cached
    }

    const source = await this.tmdbService.getGenres()

    const mapped = {
      items: mapGenres(source.genres ?? []),
    }

    await this.cacheManager.set(key, mapped, CACHE_TTL_MS.GENRES)

    return mapped
  }

  private async getGenreMap(): Promise<Map<number, string>> {
    const key = 'movies:genres:map'
    const cached = await this.cacheManager.get<[number, string][]>(key)

    if (cached) {
      return new Map(cached)
    }

    const source = await this.tmdbService.getGenres()
    const genreMap = buildGenreMap(source.genres ?? [])

    await this.cacheManager.set(key, Array.from(genreMap.entries()), CACHE_TTL_MS.GENRES)

    return genreMap
  }
}
