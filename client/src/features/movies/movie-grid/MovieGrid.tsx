import type { MovieItem } from '../../../types/types'
import { Card } from '../../../components/card/Card'
import styles from './MovieGrid.module.css'

type MovieGridProps = {
  items: MovieItem[]
}

export function MovieGrid({ items }: MovieGridProps) {
  return (
    <section className={styles.grid} aria-label='Movie results'>
      {items.map((movie) => (
        <Card key={movie.id} movie={movie} />
      ))}
    </section>
  )
}
