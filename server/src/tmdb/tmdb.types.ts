export interface TmdbGenre {
  id: number
  name: string
}

export interface TmdbMovie {
  id: number
  title: string
  release_date?: string
  poster_path?: string | null
  vote_average: number
  genre_ids?: number[]
  overview?: string
}

export interface TmdbMoviesResponse {
  page: number
  total_pages: number
  total_results: number
  results: TmdbMovie[]
}

export interface TmdbGenresResponse {
  genres: TmdbGenre[]
}
