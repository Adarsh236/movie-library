import styles from './Pagination.module.css'

type PaginationProps = {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function clampPage(page: number, totalPages: number): number {
  if (page < 1) return 1
  if (page > totalPages) return totalPages
  return page
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  const previousPage = clampPage(currentPage - 1, totalPages)
  const nextPage = clampPage(currentPage + 1, totalPages)

  return (
    <nav className={styles.pagination} aria-label='Pagination'>
      <button
        type='button'
        className={styles.button}
        disabled={currentPage <= 1}
        onClick={() => onPageChange(previousPage)}
      >
        Previous
      </button>

      <p className={styles.status}>
        Page <span>{currentPage}</span> of <span>{totalPages}</span>
      </p>

      <button
        type='button'
        className={styles.button}
        disabled={currentPage >= totalPages}
        onClick={() => onPageChange(nextPage)}
      >
        Next
      </button>
    </nav>
  )
}
