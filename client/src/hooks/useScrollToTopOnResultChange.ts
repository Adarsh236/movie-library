import { useEffect, useRef } from 'react'

export function useScrollToTopOnResultChange(resultKey: string | null): void {
  const previousKeyRef = useRef<string | null>(null)

  useEffect(() => {
    if (!resultKey) {
      return
    }

    if (previousKeyRef.current === null) {
      previousKeyRef.current = resultKey
      return
    }

    if (previousKeyRef.current !== resultKey) {
      window.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }

    previousKeyRef.current = resultKey
  }, [resultKey])
}
