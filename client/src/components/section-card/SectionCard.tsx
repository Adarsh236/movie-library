import type { HTMLAttributes, PropsWithChildren } from 'react'
import styles from './SectionCard.module.css'

type SectionCardProps = PropsWithChildren<
  HTMLAttributes<HTMLElement> & {
    as?: 'section' | 'div' | 'aside' | 'header' | 'nav'
  }
>

export function SectionCard({
  as = 'section',
  className = '',
  children,
  ...rest
}: SectionCardProps) {
  const Component = as

  return (
    <Component className={className ? `${styles.card} ${className}` : styles.card} {...rest}>
      {children}
    </Component>
  )
}
