import { HttpService } from '@nestjs/axios'
import { BadGatewayException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { firstValueFrom } from 'rxjs'
import type { TmdbGenresResponse, TmdbMoviesResponse } from './tmdb.types'

@Injectable()
export class TmdbService {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  private get accessToken(): string {
    const token = this.configService.get<string>('TMDB_ACCESS_TOKEN')

    if (!token) {
      throw new InternalServerErrorException('TMDB access token is not configured.')
    }

    return token
  }

  private get headers() {
    return {
      Authorization: `Bearer ${this.accessToken}`,
    }
  }

  async discoverMovies(page: number): Promise<TmdbMoviesResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<TmdbMoviesResponse>('/discover/movie', {
          headers: this.headers,
          params: {
            language: 'en-US',
            page,
            include_adult: false,
            include_video: false,
            sort_by: 'popularity.desc',
          },
        }),
      )

      return response.data
    } catch {
      throw new BadGatewayException('Failed to fetch movies from TMDB.')
    }
  }

  async discoverMoviesByGenre(genreId: number, page: number): Promise<TmdbMoviesResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<TmdbMoviesResponse>('/discover/movie', {
          headers: this.headers,
          params: {
            language: 'en-US',
            page,
            include_adult: false,
            include_video: false,
            sort_by: 'popularity.desc',
            with_genres: genreId,
          },
        }),
      )

      return response.data
    } catch {
      throw new BadGatewayException('Failed to fetch movies by genre from TMDB.')
    }
  }

  async searchMoviesByTitle(title: string, page: number): Promise<TmdbMoviesResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<TmdbMoviesResponse>('/search/movie', {
          headers: this.headers,
          params: {
            query: title,
            page,
            include_adult: false,
            language: 'en-US',
          },
        }),
      )

      return response.data
    } catch {
      throw new BadGatewayException('Failed to search movies from TMDB.')
    }
  }

  async getGenres(): Promise<TmdbGenresResponse> {
    try {
      const response = await firstValueFrom(
        this.httpService.get<TmdbGenresResponse>('/genre/movie/list', {
          headers: this.headers,
          params: {
            language: 'en-US',
          },
        }),
      )

      return response.data
    } catch {
      throw new BadGatewayException('Failed to fetch genres from TMDB.')
    }
  }
}
