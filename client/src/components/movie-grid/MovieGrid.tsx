import type { Movie } from '../../types/types'
import { MovieCard } from '../movie-card/MovieCard'
import styles from './MovieGrid.module.css'

type MovieGridProps = {
  items: Movie[]
}

export function MovieGrid({ items }: MovieGridProps) {
  return (
    <div className={styles.grid}>
      {items.map((movie) => (
        <MovieCard key={movie.id} movie={movie} />
      ))}
    </div>
  )
}
