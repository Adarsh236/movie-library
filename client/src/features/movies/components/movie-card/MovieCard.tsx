import { useMemo, useState } from 'react'
import styles from './MovieCard.module.css'
import type { Movie } from '../../../../types/types'

type MovieCardProps = {
  movie: Movie
}

const FALLBACK_POSTER = 'https://placehold.co/400'

function formatRating(value: number): string {
  if (!Number.isFinite(value)) {
    return 'N/A'
  }

  return value.toFixed(1)
}

export function MovieCard({ movie }: MovieCardProps) {
  const [hasImageError, setHasImageError] = useState(false)

  const posterSrc = useMemo(() => {
    if (hasImageError || !movie.posterUrl) {
      return FALLBACK_POSTER
    }

    return movie.posterUrl
  }, [hasImageError, movie.posterUrl])

  return (
    <article className={styles.card}>
      <div className={styles.posterFrame}>
        <img
          src={posterSrc}
          alt={`${movie.title} poster`}
          className={styles.poster}
          loading='lazy'
          onError={() => setHasImageError(true)}
        />
        <div className={styles.ratingBadge} aria-label={`Rating ${formatRating(movie.rating)}`}>
          {formatRating(movie.rating)}
        </div>
      </div>

      <div className={styles.body}>
        <header className={styles.header}>
          <h2 className={styles.title} title={movie.title}>
            {movie.title}
          </h2>
          <p className={styles.releaseDate}>{movie.releaseDateLabel}</p>
        </header>

        <ul className={styles.genreList} aria-label='Genres'>
          {movie.genres.slice(0, 3).map((genre) => (
            <li key={genre} className={styles.genreTag}>
              {genre}
            </li>
          ))}
        </ul>
      </div>
    </article>
  )
}
