import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'
import clsx from 'clsx'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  fullWidth?: boolean
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  className = '',
  type = 'button',
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={clsx(styles.button, styles[variant], fullWidth && styles.fullWidth, className)}
      {...rest}
    />
  )
}
