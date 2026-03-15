import { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'

function normalizePage(value: string | null): number {
  const parsed = Number(value)
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1
}

export function useCatalogUrlState() {
  const [searchParams, setSearchParams] = useSearchParams()

  const state = useMemo(() => {
    const title = (searchParams.get('title') ?? '').trim()
    const genreId = (searchParams.get('genre') ?? '').trim()
    const page = normalizePage(searchParams.get('page'))

    const mode: 'all' | 'title' | 'genre' = title ? 'title' : genreId ? 'genre' : 'all'

    return {
      mode,
      title,
      genreId,
      page,
    }
  }, [searchParams])

  const setTitleSearch = (title: string) => {
    const normalizedTitle = title.trim()
    const next = new URLSearchParams()

    if (normalizedTitle) {
      next.set('title', normalizedTitle)
    }

    setSearchParams(next)
  }

  const setGenreBrowse = (genreId: string) => {
    const normalizedGenreId = genreId.trim()
    const next = new URLSearchParams()

    if (normalizedGenreId) {
      next.set('genre', normalizedGenreId)
    }

    setSearchParams(next)
  }

  const setPage = (page: number) => {
    const next = new URLSearchParams(searchParams)

    if (page <= 1) {
      next.delete('page')
    } else {
      next.set('page', String(page))
    }

    setSearchParams(next)
  }

  const reset = () => {
    setSearchParams(new URLSearchParams())
  }

  return {
    ...state,
    setTitleSearch,
    setGenreBrowse,
    setPage,
    reset,
  }
}
