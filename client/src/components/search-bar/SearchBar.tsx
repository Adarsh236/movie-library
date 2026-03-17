import { type SubmitEvent } from 'react'
import clsx from 'clsx'
import { Button } from '../button/Button'
import styles from './SearchBar.module.css'
import { isNonEmptyString } from '../../utils/utils'

type SearchBarProps = {
  id?: string
  value: string
  placeholder?: string
  className?: string
  isBusy?: boolean
  onChange: (value: string) => void
  onSubmit: (value: string) => void
  onClear?: () => void
}

export function SearchBar({
  id = 'movie-search',
  value,
  placeholder = 'Search movies',
  className,
  isBusy = false,
  onChange,
  onSubmit,
  onClear,
}: SearchBarProps) {
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault()
    onSubmit(value)
  }

  const hasValue = isNonEmptyString(value)

  return (
    <form className={clsx(styles.form, className)} onSubmit={handleSubmit} role='search'>
      <label htmlFor={id} className={styles.srOnly}>
        Search movies by title
      </label>

      <div className={styles.field}>
        <input
          id={id}
          name='title'
          type='search'
          autoComplete='off'
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className={styles.input}
          aria-busy={isBusy}
        />

        {hasValue ? (
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className={styles.clearButton}
            onClick={onClear}
            aria-label='Clear search'
            title='Clear search'
          >
            X
          </Button>
        ) : null}
      </div>
    </form>
  )
}
