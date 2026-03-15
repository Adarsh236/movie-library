import {
  Children,
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type PropsWithChildren,
  type ReactElement,
} from 'react'
import clsx from 'clsx'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'
type ButtonSize = 'sm' | 'md' | 'lg'

export type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
    size?: ButtonSize
    fullWidth?: boolean
    asChild?: boolean
  }
>

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    children,
    className,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    asChild = false,
    type = 'button',
    ...props
  },
  ref,
) {
  const classes = clsx(
    styles.button,
    styles[variant],
    styles[size],
    fullWidth && styles.fullWidth,
    className,
  )

  if (asChild) {
    const child = Children.only(children)

    if (!isValidElement(child)) {
      return null
    }

    const childElement = child as ReactElement<{ className?: string }>

    return cloneElement(childElement, {
      className: clsx(classes, childElement.props.className),
      ...props,
    })
  }

  return (
    <button ref={ref} type={type} className={classes} {...props}>
      {children}
    </button>
  )
})
