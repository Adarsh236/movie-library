import type { TmdbGenre, TmdbMovie } from '../../tmdb/tmdb.types'
import type { GenreResponseDto, MovieItemDto } from '../movies.types'

function toReleaseYear(releaseDate?: string): string {
  if (!releaseDate) return 'Unknown'

  const parsedDate = new Date(releaseDate)

  if (Number.isNaN(parsedDate.getTime())) return 'Unknown'

  return String(parsedDate.getUTCFullYear())
}

function toReleaseDateLabel(releaseDate?: string): string {
  if (!releaseDate) return 'Unknown release date'

  const parsedDate = new Date(releaseDate)

  if (Number.isNaN(parsedDate.getTime())) return 'Unknown release date'

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(parsedDate)
}

export function buildGenreMap(genres: TmdbGenre[]): Map<number, string> {
  return new Map(genres.map((genre) => [genre.id, genre.name]))
}

export function mapMovieItem(movie: TmdbMovie, genreMap: Map<number, string>): MovieItemDto {
  return {
    id: movie.id,
    title: movie.title,
    releaseYear: toReleaseYear(movie.release_date),
    releaseDateLabel: toReleaseDateLabel(movie.release_date),
    posterUrl: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
    rating: Number((movie.vote_average ?? 0).toFixed(1)),
    genres: (movie.genre_ids ?? [])
      .map((genreId) => genreMap.get(genreId))
      .filter((genreName): genreName is string => Boolean(genreName)),
    // TODO: Recheck
    overview: movie.overview?.trim() || 'No overview available.',
  }
}

export function mapGenres(genres: TmdbGenre[]): GenreResponseDto[] {
  return genres.map((genre) => ({
    id: String(genre.id),
    label: genre.name,
  }))
}
