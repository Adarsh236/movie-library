import { useSyncExternalStore } from 'react'
import { getValidSearchTitle } from '../features/movies/lib/searchValidation'

const STORAGE_KEY = 'movie-library:recent-searches'
const CHANGE_EVENT = 'movie-library:recent-searches-changed'
const MAX_RECENT_SEARCHES = 5

let cachedSnapshot: string[] = []

function canUseStorage(): boolean {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
}

function areListsEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) {
    return false
  }

  return a.every((item, index) => item === b[index])
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

    const normalizedItem = getValidSearchTitle(item)

    if (!normalizedItem) {
      continue
    }

    const key = normalizedItem.toLowerCase()

    if (seen.has(key)) {
      continue
    }

    seen.add(key)
    result.push(normalizedItem)

    if (result.length >= MAX_RECENT_SEARCHES) {
      break
    }
  }

  return result
}

function readFromStorage(): string[] {
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

function emitChange(): void {
  if (typeof window === 'undefined') {
    return
  }

  window.dispatchEvent(new Event(CHANGE_EVENT))
}

function syncSnapshotFromStorage(): string[] {
  const nextSnapshot = readFromStorage()

  if (!areListsEqual(cachedSnapshot, nextSnapshot)) {
    cachedSnapshot = nextSnapshot
  }

  return cachedSnapshot
}

function writeSnapshot(nextValues: string[]): string[] {
  const sanitizedValues = sanitizeStoredItems(nextValues)

  if (!areListsEqual(cachedSnapshot, sanitizedValues)) {
    cachedSnapshot = sanitizedValues
  }

  if (!canUseStorage()) {
    return cachedSnapshot
  }

  try {
    if (cachedSnapshot.length === 0) {
      window.localStorage.removeItem(STORAGE_KEY)
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cachedSnapshot))
    }

    emitChange()
  } catch {
    console.error('Failed to persist recent searches.')
  }

  return cachedSnapshot
}

function getRecentSearchesSnapshot(): string[] {
  return syncSnapshotFromStorage()
}

function addRecentSearch(value: string): string[] {
  const normalizedValue = getValidSearchTitle(value)

  if (!normalizedValue) {
    return syncSnapshotFromStorage()
  }

  const nextValues = [
    normalizedValue,
    ...syncSnapshotFromStorage().filter(
      (item) => item.toLowerCase() !== normalizedValue.toLowerCase(),
    ),
  ]

  return writeSnapshot(nextValues)
}

function removeRecentSearch(value: string): string[] {
  const normalizedValue = getValidSearchTitle(value)

  if (!normalizedValue) {
    return syncSnapshotFromStorage()
  }

  const nextValues = syncSnapshotFromStorage().filter(
    (item) => item.toLowerCase() !== normalizedValue.toLowerCase(),
  )

  return writeSnapshot(nextValues)
}

function clearRecentSearches(): string[] {
  return writeSnapshot([])
}

function subscribeToRecentSearches(listener: () => void): () => void {
  if (typeof window === 'undefined') {
    return () => undefined
  }

  const handleLocalChange = (): void => {
    syncSnapshotFromStorage()
    listener()
  }

  const handleStorageChange = (event: StorageEvent): void => {
    if (event.key !== STORAGE_KEY) {
      return
    }

    syncSnapshotFromStorage()
    listener()
  }

  window.addEventListener(CHANGE_EVENT, handleLocalChange)
  window.addEventListener('storage', handleStorageChange)

  return () => {
    window.removeEventListener(CHANGE_EVENT, handleLocalChange)
    window.removeEventListener('storage', handleStorageChange)
  }
}

export function useRecentSearches() {
  const items = useSyncExternalStore(subscribeToRecentSearches, getRecentSearchesSnapshot, () => [])

  return {
    items,
    addSearch: addRecentSearch,
    removeSearch: removeRecentSearch,
    clearSearches: clearRecentSearches,
  }
}
