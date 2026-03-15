import { HttpService } from '@nestjs/axios'
import { BadGatewayException, Injectable, InternalServerErrorException } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { tmdbGenresResponseSchema, tmdbMoviesResponseSchema } from './tmdb.schemas'
import { ConfigService } from '@nestjs/config'
import z from 'zod'
import { TmdbGenresResponse, TmdbMoviesResponse } from './tmdb.types'

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

  private get headers(): Record<string, string> {
    return {
      Authorization: `Bearer ${this.accessToken}`,
    }
  }

  private async getAndValidate<T>(
    url: string,
    schema: z.ZodSchema<T>,
    params: Record<string, string | number | boolean>,
    errorMessage: string,
  ): Promise<T> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(url, {
          headers: this.headers,
          params,
        }),
      )

      const parsed = schema.safeParse(response.data)

      if (!parsed.success) {
        throw new BadGatewayException(`TMDB returned an invalid payload for ${url}.`)
      }

      return parsed.data
    } catch (error) {
      if (error instanceof BadGatewayException) {
        throw error
      }

      throw new BadGatewayException(errorMessage)
    }
  }

  async discoverMovies(page: number): Promise<TmdbMoviesResponse> {
    return this.getAndValidate(
      '/discover/movie',
      tmdbMoviesResponseSchema,
      {
        language: 'en-US',
        page,
        include_adult: false,
        include_video: false,
        sort_by: 'popularity.desc',
      },
      'Failed to fetch movies from TMDB.',
    )
  }

  async discoverMoviesByGenre(genreId: number, page: number): Promise<TmdbMoviesResponse> {
    return this.getAndValidate(
      '/discover/movie',
      tmdbMoviesResponseSchema,
      {
        language: 'en-US',
        page,
        include_adult: false,
        include_video: false,
        sort_by: 'popularity.desc',
        with_genres: genreId,
      },
      'Failed to fetch movies by genre from TMDB.',
    )
  }

  async searchMoviesByTitle(title: string, page: number): Promise<TmdbMoviesResponse> {
    return this.getAndValidate(
      '/search/movie',
      tmdbMoviesResponseSchema,
      {
        query: title,
        page,
        include_adult: false,
        language: 'en-US',
      },
      'Failed to search movies from TMDB.',
    )
  }

  async getGenres(): Promise<TmdbGenresResponse> {
    return this.getAndValidate(
      '/genre/movie/list',
      tmdbGenresResponseSchema,
      {
        language: 'en-US',
      },
      'Failed to fetch genres from TMDB.',
    )
  }
}
