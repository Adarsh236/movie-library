import { useSyncExternalStore } from 'react'

export function useIsMobile(query = '(max-width: 63.9375rem)') {
  const subscribe = (callback: () => void) => {
    const mediaQuery = window.matchMedia(query)
    mediaQuery.addEventListener('change', callback)

    return () => {
      mediaQuery.removeEventListener('change', callback)
    }
  }

  const getSnapshot = () => window.matchMedia(query).matches
  const getServerSnapshot = () => false

  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
