import { NavLink } from 'react-router-dom'
import styles from './Header.module.css'
import { SearchBar } from '../search-bar/SearchBar'
import { useHeaderSearch } from '../../hooks/header-search/useHeaderSearch'

type HeaderProps = {
  onOpenSidebar: () => void
}

export function Header({ onOpenSidebar }: HeaderProps) {
  const { searchValue, handleChange, handleSubmit, handleClear, resetSearchDraft } =
    useHeaderSearch()

  return (
    <div className={styles.header}>
      <div className={styles.start}>
        <button
          type='button'
          className={styles.menuButton}
          onClick={onOpenSidebar}
          aria-label='Open navigation menu'
        >
          ☰
        </button>

        <NavLink to='/' className={styles.logo}>
          MOVIE Lib
        </NavLink>
      </div>

      <div className={styles.searchSlot}>
        <SearchBar
          value={searchValue}
          onChange={handleChange}
          onSubmit={handleSubmit}
          onClear={handleClear}
          placeholder='Search movies by title'
        />
      </div>

      <nav className={styles.end} aria-label='Top navigation'>
        <NavLink
          to='/about'
          onClick={resetSearchDraft}
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          About
        </NavLink>
      </nav>
    </div>
  )
}
