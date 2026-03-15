import clsx from 'clsx'
import { SectionCard } from '../../../components/section-card/SectionCard'
import styles from './RecentSearchesSidebar.module.css'
import baseStyles from '../../../styles/baseStyles.module.css'
import { Button } from '../../../components/button/Button'

type RecentSearchesSidebarProps = {
  items: string[]
  activeValue?: string
  onSelect: (value: string) => void
  onClear: () => void
}

export function RecentSearchesSidebar({
  items,
  activeValue = '',
  onSelect,
  onClear,
}: RecentSearchesSidebarProps) {
  return (
    <SectionCard as='aside' className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recent</h2>

        {items.length > 0 ? (
          <Button variant='ghost' onClick={onClear}>
            Clear
          </Button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>No recent searches yet.</p>
      ) : (
        <div className={styles.list}>
          {items.map((item, index) => (
            <button
              key={`${item}-${index}`}
              type='button'
              className={clsx(
                baseStyles.wordBreak,
                styles.itemButton,
                activeValue.trim().toLowerCase() === item.trim().toLowerCase() && styles.active,
              )}
              onClick={() => onSelect(item)}
            >
              {item}
            </button>
          ))}
        </div>
      )}
    </SectionCard>
  )
}
