import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'movie-library:recent-searches'
const MAX_ITEMS = 5

function normalize(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function sanitizeStoredItems(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return []
  }

  const seen = new Set<string>()
  const result: string[] = []

  for (const item of input) {
    if (typeof item !== 'string') {
      continue
    }

    const normalized = normalize(item)

    if (!normalized) {
      continue
    }

    const key = normalized.toLowerCase()

    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    result.push(normalized)

    if (result.length >= MAX_ITEMS) {
      break
    }
  }

  return result
}

function getRecentSearches(): string[] {
  if (!canUseStorage()) {
    return []
  }

  try {
    const rawValue = window.localStorage.getItem(STORAGE_KEY)

    if (!rawValue) {
      return []
    }

    const parsedValue: unknown = JSON.parse(rawValue)
    return sanitizeStoredItems(parsedValue)
  } catch {
    return []
  }
}

function saveRecentSearches(items: string[]): void {
  if (!canUseStorage()) {
    return
  }

  try {
    if (items.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY)
      return
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
  } catch {
    console.error('Failed to save recent searches.')
  }
}

export function useRecentSearches() {
  const [items, setItems] = useState<string[]>(() => getRecentSearches())

  useEffect(() => {
    saveRecentSearches(items)
  }, [items])

  const push = useCallback((value: string) => {
    const normalizedValue = normalize(value)

    if (!normalizedValue) {
      return
    }

    setItems((currentItems) => {
      return [
        normalizedValue,
        ...currentItems.filter((item) => item.toLowerCase() !== normalizedValue.toLowerCase()),
      ].slice(0, MAX_ITEMS)
    })
  }, [])

  const remove = useCallback((value: string) => {
    const normalizedValue = normalize(value)

    if (!normalizedValue) {
      return
    }

    setItems((currentItems) =>
      currentItems.filter((item) => item.toLowerCase() !== normalizedValue.toLowerCase()),
    )
  }, [])

  const clear = useCallback(() => {
    setItems([])
  }, [])

  return {
    items,
    push,
    remove,
    clear,
    size: items.length,
    isFull: items.length >= MAX_ITEMS,
  }
}
