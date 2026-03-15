import { Injectable } from '@nestjs/common'
import { TmdbService } from '../tmdb/tmdb.service'
import { GetMoviesByGenreQueryDto } from './dto/get-movies-by-genre-query.dto'
import { GetMoviesQueryDto } from './dto/get-movies-query.dto'
import { SearchMoviesQueryDto } from './dto/search-movies-query.dto'
import { buildGenreMap, mapGenres, mapMovieItem } from './mappers/movie.mapper'
import type { GenreItemDto, MoviesResponseDto } from './movies.types'

@Injectable()
export class MoviesService {
  constructor(private readonly tmdbService: TmdbService) {}

  async getMovies(query: GetMoviesQueryDto): Promise<MoviesResponseDto> {
    const genresResponse = await this.tmdbService.getGenres()
    const genreMap = buildGenreMap(genresResponse.genres ?? [])

    const source = await this.tmdbService.discoverMovies(query.page)

    return {
      items: (source.results ?? []).map((movie) => mapMovieItem(movie, genreMap)),
      page: source.page,
      totalItems: source.total_results,
      totalPages: source.total_pages,
    }
  }

  async searchMovies(query: SearchMoviesQueryDto): Promise<MoviesResponseDto> {
    const genresResponse = await this.tmdbService.getGenres()
    const genreMap = buildGenreMap(genresResponse.genres ?? [])

    const source = await this.tmdbService.searchMoviesByTitle(query.title, query.page)

    return {
      items: (source.results ?? []).map((movie) => mapMovieItem(movie, genreMap)),
      page: source.page,
      totalItems: source.total_results,
      totalPages: source.total_pages,
    }
  }

  async getMoviesByGenre(
    genreId: number,
    query: GetMoviesByGenreQueryDto,
  ): Promise<MoviesResponseDto> {
    const genresResponse = await this.tmdbService.getGenres()
    const genreMap = buildGenreMap(genresResponse.genres ?? [])

    const source = await this.tmdbService.discoverMoviesByGenre(genreId, query.page)

    return {
      items: (source.results ?? []).map((movie) => mapMovieItem(movie, genreMap)),
      page: source.page,
      totalItems: source.total_results,
      totalPages: source.total_pages,
    }
  }

  async getGenres(): Promise<{ items: GenreItemDto[] }> {
    const source = await this.tmdbService.getGenres()

    return {
      items: mapGenres(source.genres ?? []),
    }
  }
}
