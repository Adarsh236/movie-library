import { NavLink } from 'react-router-dom'
import styles from './Header.module.css'
import { SearchBar } from '../search-bar/SearchBar'

type HeaderProps = {
  onOpenSidebar: () => void
  searchValue: string
  onSearchChange: (value: string) => void
  onSearchSubmit: (value: string) => void
  onSearchClear: () => void
  onPrimaryNavigate: (nextRoute: string) => void
}

export function Header({
  onOpenSidebar,
  searchValue,
  onSearchChange,
  onSearchSubmit,
  onSearchClear,
  onPrimaryNavigate,
}: HeaderProps) {
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

        <NavLink to='/' onClick={() => onPrimaryNavigate('/')} className={styles.logo}>
          MOVIE Lib
        </NavLink>
      </div>

      <div className={styles.searchSlot}>
        <SearchBar
          value={searchValue}
          onChange={onSearchChange}
          onSubmit={onSearchSubmit}
          onClear={onSearchClear}
          placeholder='Search movies by title'
        />
      </div>

      <nav className={styles.end} aria-label='Top navigation'>
        <NavLink
          to='/about'
          onClick={() => onPrimaryNavigate('/about')}
          className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}
        >
          About
        </NavLink>
      </nav>
    </div>
  )
}
