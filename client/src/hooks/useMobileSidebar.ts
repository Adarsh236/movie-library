import { useCallback, useEffect, useRef, useState } from 'react'
import { useIsMobile } from './useIsMobile'

type UseMobileSidebarOptions = {
  locationKey: string
}

type UseMobileSidebarResult = {
  isMobile: boolean
  sidebarOpen: boolean
  sidebarRef: React.RefObject<HTMLElement | null>
  toggleButtonRef: React.RefObject<HTMLButtonElement | null>
  closeSidebar: () => void
  toggleSidebar: () => void
}

export function useMobileSidebar({ locationKey }: UseMobileSidebarOptions): UseMobileSidebarResult {
  const isMobile = useIsMobile()
  const [openedForLocation, setOpenedForLocation] = useState<string | null>(null)

  const sidebarRef = useRef<HTMLElement | null>(null)
  const toggleButtonRef = useRef<HTMLButtonElement | null>(null)

  const sidebarOpen = isMobile && openedForLocation === locationKey

  const closeSidebar = useCallback(() => {
    setOpenedForLocation(null)
  }, [])

  const toggleSidebar = useCallback(() => {
    if (!isMobile) return

    setOpenedForLocation((current) => (current === locationKey ? null : locationKey))
  }, [isMobile, locationKey])

  useEffect(() => {
    if (!sidebarOpen) {
      document.body.style.overflow = ''
      return
    }

    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = ''
    }
  }, [sidebarOpen])

  useEffect(() => {
    if (!sidebarOpen) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (!target) return

      const clickedInsideSidebar = sidebarRef.current?.contains(target)
      const clickedToggle = toggleButtonRef.current?.contains(target)

      if (clickedInsideSidebar || clickedToggle) {
        return
      }

      closeSidebar()
    }

    document.addEventListener('pointerdown', handlePointerDown)

    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [sidebarOpen, closeSidebar])

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeSidebar()
      }
    }

    window.addEventListener('keydown', handleEscape)

    return () => {
      window.removeEventListener('keydown', handleEscape)
    }
  }, [closeSidebar])

  return {
    isMobile,
    sidebarOpen,
    sidebarRef,
    toggleButtonRef,
    closeSidebar,
    toggleSidebar,
  }
}
