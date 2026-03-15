import clsx from 'clsx'

import styles from './GenreNav.module.css'
import type { GenreOption } from '../../../types/types'
import { SectionCard } from '../../../components/section-card/SectionCard'

type GenreNavProps = {
  activeGenreId: string
  genres: GenreOption[]
  onSelect: (genre: GenreOption | null) => void
}

export function GenreNav({ activeGenreId, genres, onSelect }: GenreNavProps) {
  return (
    <SectionCard as='section' className={styles.panel}>
      <h2 className={styles.title}>Genres</h2>

      <div className={styles.list}>
        <button
          type='button'
          className={clsx(styles.genreButton, !activeGenreId && styles.active)}
          onClick={() => onSelect(null)}
        >
          All Movies
        </button>

        {genres.map((genre) => (
          <button
            key={genre.id}
            type='button'
            className={clsx(styles.genreButton, activeGenreId === genre.id && styles.active)}
            onClick={() => onSelect(genre)}
          >
            {genre.label}
          </button>
        ))}
      </div>
    </SectionCard>
  )
}
