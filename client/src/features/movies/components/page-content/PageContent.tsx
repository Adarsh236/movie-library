import type { ReactNode } from 'react'
import { MovieGrid } from '../../../../components/movie-grid/MovieGrid'
import { Pagination } from '../../../../components/pagination/Pagination'
import styles from './PageContent.module.css'
import type { MoviesResponse } from '../../../../types/types'
import { getApiErrorMessage } from '../../../../services/baseApi'
import { Spinner } from '../../../../components/spinner/Spinner'
import { ErrorState } from '../../../../components/error-state/ErrorState'
import { EmptyState } from '../../../../components/empty-state/EmptyState'

type PageContentProps = {
  title: string
  subtitle?: string
  data?: MoviesResponse
  isLoading: boolean
  isFetching?: boolean
  error?: unknown
  onPageChange: (page: number) => void
  emptyState?: ReactNode
}

export function PageContent({
  title,
  subtitle,
  data,
  isLoading,
  isFetching = false,
  error,
  onPageChange,
  emptyState,
}: PageContentProps) {
  if (isLoading) {
    return (
      <section className={styles.page} aria-busy='true'>
        <header className={styles.hero}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </header>

        <div className={styles.stateBox}>
          <Spinner size='lg' label='Loading movies...' />
        </div>
      </section>
    )
  }

  if (error) {
    return (
      <section className={styles.page}>
        <header className={styles.hero}>
          <h1 className={styles.title}>{title}</h1>
          {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
        </header>

        <ErrorState message={getApiErrorMessage(error)} />
      </section>
    )
  }

  const items = data?.items ?? []
  const totalPages = data?.totalPages ?? 1
  const currentPage = data?.page ?? 1

  return (
    <section className={styles.page} aria-busy={isFetching}>
      <header className={styles.hero}>
        <div className={styles.heroRow}>
          <div>
            <h1 className={styles.title}>{title}</h1>
            {subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
          </div>

          {isFetching ? <Spinner size='sm' label='Updating...' /> : null}
        </div>
      </header>

      {items.length === 0 ? (
        (emptyState ?? (
          <EmptyState
            title='No movies found'
            description='Try another search or browse a different genre.'
          />
        ))
      ) : (
        <>
          <MovieGrid items={items} />
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </>
      )}
    </section>
  )
}
