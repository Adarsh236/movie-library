export interface MovieItemDto {
  id: number
  title: string
  releaseYear: string
  releaseDateLabel: string
  posterUrl: string | null
  rating: number
  genres: string[]
  overview: string
}

export interface MoviesResponseDto {
  items: MovieItemDto[]
  page: number
  totalItems: number
  totalPages: number
}

export interface GenreItemDto {
  id: string
  label: string
}
