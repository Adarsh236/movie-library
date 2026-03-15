import { useEffect, useRef } from 'react'
import { useDebouncedValue } from './useDebouncedValue'

type UseDebouncedSearchOptions = {
  value?: string
  delay?: number
  onDebouncedChange: (query: string) => void
}

export function useDebouncedSearch({
  value = '',
  delay = 400,
  onDebouncedChange,
}: UseDebouncedSearchOptions) {
  const debouncedValue = useDebouncedValue(value, delay)
  const previousValueRef = useRef<string | null>(null)

  useEffect(() => {
    const normalizedValue = debouncedValue.trim()

    if (previousValueRef.current === normalizedValue) {
      return
    }

    previousValueRef.current = normalizedValue
    onDebouncedChange(normalizedValue)
  }, [debouncedValue, onDebouncedChange])
}
