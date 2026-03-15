import { useCallback, type ChangeEvent, type FormEvent, type KeyboardEvent } from 'react'
import styles from './SearchBar.module.css'

interface SearchBarProps {
  value: string
  compact?: boolean
  onChange: (query: string) => void
  onClear: () => void
  onSubmit?: () => void
}

export function SearchBar({ value, compact = false, onChange, onClear, onSubmit }: SearchBarProps) {
  const handleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      onChange(event.target.value)
    },
    [onChange],
  )

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      onSubmit?.()
    },
    [onSubmit],
  )

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLInputElement>) => {
      if (event.key === 'Escape') {
        onClear()
      }
    },
    [onClear],
  )

  return (
    <form
      className={`${styles.container} ${compact ? styles.compact : styles.full}`}
      onSubmit={handleSubmit}
      role='search'
      aria-label='Search movies'
    >
      <div className={styles.inputWrapper}>
        <span className={styles.icon} aria-hidden='true'>
          ⌕
        </span>

        <input
          type='text'
          className={styles.input}
          placeholder='Search by title…'
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          aria-label='Search movies'
          autoComplete='off'
        />

        {value ? (
          <button
            type='button'
            className={styles.clearButton}
            onClick={onClear}
            aria-label='Clear search'
          >
            ✕
          </button>
        ) : null}
      </div>
    </form>
  )
}
