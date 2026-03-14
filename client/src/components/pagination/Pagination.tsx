import { Button } from '../button/Button'
import { SectionCard } from '../section-card/SectionCard'
import styles from './Pagination.module.css'

type PaginationProps = {
  page: number
  totalPages: number
  onPrevious: () => void
  onNext: () => void
}

export function Pagination({ page, totalPages, onPrevious, onNext }: PaginationProps) {
  if (totalPages <= 1) {
    return null
  }

  return (
    <SectionCard as='nav' className={styles.pagination} aria-label='Movies pagination'>
      <Button variant='secondary' onClick={onPrevious} disabled={page <= 1}>
        Previous
      </Button>

      <span className={styles.label}>
        Page {page} of {totalPages}
      </span>

      <Button variant='secondary' onClick={onNext} disabled={page >= totalPages}>
        Next
      </Button>
    </SectionCard>
  )
}
