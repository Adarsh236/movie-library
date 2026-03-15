export interface Movie {
  id: number
  title: string
  releaseDateLabel: string
  posterUrl: string | null
  rating: number
  genres: string[]
}

export interface MoviesResponse {
  items: Movie[]
  page: number
  totalItems: number
  totalPages: number
}

export interface Genre {
  id: number
  label: string
}

export interface GenresResponse {
  items: Genre[]
}

export interface ApiErrorPayload {
  statusCode: number
  code: string
  message: string
  details?: Record<string, string[]>
}
