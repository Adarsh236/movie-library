import { NavLink, useSearchParams } from 'react-router-dom'
import clsx from 'clsx'
import { useGetGenresQuery } from '../../features/movies/api/moviesApi'
import { buildGenreUrl, buildHomeUrl } from '../../features/movies/lib/movieRouteState'
import { useRecentSearches } from '../../hooks/useRecentSearches'
import styles from './Sidebar.module.css'

type SidebarProps = {
  onNavigate?: () => void
  onPrimaryNavigate?: (nextRoute: string) => void
}

export function Sidebar({ onNavigate, onPrimaryNavigate }: SidebarProps) {
  const [searchParams] = useSearchParams()
  const title = searchParams.get('title')
  const { data: genres = [], isLoading, isError } = useGetGenresQuery()
  const { items: recentSearches, clearSearches } = useRecentSearches()

  return (
    <div className={styles.sidebar}>
      <section className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2 className={styles.heading}>Recent Searches</h2>

          {recentSearches.length > 0 ? (
            <button type='button' className={styles.clearButton} onClick={clearSearches}>
              Clear
            </button>
          ) : null}
        </div>

        {recentSearches.length === 0 ? (
          <p className={styles.meta}>Your last 5 searches will appear here.</p>
        ) : (
          <div className={styles.nav} aria-label='Recent searches'>
            {recentSearches.map((item) => (
              <div
                key={item}
                className={clsx(
                  styles.recentSearchItem,
                  title === item && styles.recentSearchItemActive,
                )}
              >
                {item}
              </div>
            ))}
          </div>
        )}
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Browse</h2>

        <nav className={styles.nav} aria-label='Primary sidebar navigation'>
          <NavLink
            to={buildHomeUrl()}
            onClick={() => {
              onPrimaryNavigate?.('/')
              onNavigate?.()
            }}
            end
            className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          >
            All Movies
          </NavLink>

          <NavLink
            to='/about'
            onClick={() => {
              onPrimaryNavigate?.('/about')
              onNavigate?.()
            }}
            className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
          >
            About
          </NavLink>
        </nav>
      </section>

      <section className={styles.section}>
        <h2 className={styles.heading}>Genres</h2>

        {isLoading ? <p className={styles.meta}>Loading genres…</p> : null}
        {isError ? <p className={styles.meta}>Could not load genres.</p> : null}

        {!isLoading && !isError ? (
          <nav className={styles.nav} aria-label='Movie genres'>
            {genres.map((genre) => (
              <NavLink
                key={genre.id}
                to={buildGenreUrl(genre.id)}
                onClick={onNavigate}
                className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
              >
                {genre.label}
              </NavLink>
            ))}
          </nav>
        ) : null}
      </section>
    </div>
  )
}
