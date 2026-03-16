import { useState } from 'react'
import clsx from 'clsx'
import type { Movie } from '../../../../types/types'
import fallbackPoster from '../../../../assets/fall-back-poster.png'
import styles from './MovieCard.module.css'

type MovieCardProps = {
  movie: Movie
}

function formatRating(value: number): string {
  if (!Number.isFinite(value) || value === 0) {
    return 'N/A'
  }

  return value.toFixed(1)
}

export function MovieCard({ movie }: MovieCardProps) {
  const [failedPosterUrl, setFailedPosterUrl] = useState<string | null>(null)

  const shouldUseFallback = !movie.posterUrl || failedPosterUrl === movie.posterUrl
  const posterSrc = shouldUseFallback ? fallbackPoster : (movie.posterUrl as string)

  const visibleGenres = movie.genres.slice(0, 2)
  const remainingGenresCount = Math.max(movie.genres.length - visibleGenres.length, 0)

  return (
    <article className={styles.card}>
      <div className={styles.posterFrame}>
        <img
          key={posterSrc}
          src={posterSrc}
          alt={`${movie.title} poster`}
          className={clsx(styles.poster, shouldUseFallback && styles.posterFallback)}
          loading='lazy'
          onError={() => {
            if (movie.posterUrl) {
              setFailedPosterUrl(movie.posterUrl)
            }
          }}
        />

        <div className={styles.ratingBadge} aria-label={`Rating ${formatRating(movie.rating)}`}>
          {formatRating(movie.rating)}
        </div>

        <div className={styles.overlay}>
          <header className={styles.header}>
            <h2 className={styles.title} title={movie.title}>
              {movie.title}
            </h2>

            <p className={styles.releaseDate}>{movie.releaseDateLabel}</p>
          </header>

          <ul className={styles.genreList} aria-label='Genres'>
            {visibleGenres.map((genre) => (
              <li key={genre} className={styles.genreTag}>
                {genre}
              </li>
            ))}

            {remainingGenresCount > 0 ? (
              <li className={styles.genreTag} aria-label={`${remainingGenresCount} more genres`}>
                + {remainingGenresCount}
              </li>
            ) : null}
          </ul>
        </div>
      </div>
    </article>
  )
}
