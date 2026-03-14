import { Button } from '../../../components/button/Button'
import { SectionCard } from '../../../components/section-card/SectionCard'
import styles from './RecentSearchesSidebar.module.css'

type RecentSearchesSidebarProps = {
  items: string[]
  onSelect: (value: string) => void
  onClear: () => void
}

export function RecentSearchesSidebar({ items, onSelect, onClear }: RecentSearchesSidebarProps) {
  return (
    <SectionCard as='aside' className={styles.panel}>
      <div className={styles.header}>
        <h2 className={styles.title}>Recent Searches</h2>

        {items.length > 0 ? (
          <Button variant='ghost' onClick={onClear}>
            Clear
          </Button>
        ) : null}
      </div>

      {items.length === 0 ? (
        <p className={styles.empty}>No recent searches yet.</p>
      ) : (
        <ul className={styles.list}>
          {items.map((item) => (
            <li key={item}>
              <Button variant='ghost' className={styles.itemButton} onClick={() => onSelect(item)}>
                {item}
              </Button>
            </li>
          ))}
        </ul>
      )}
    </SectionCard>
  )
}
