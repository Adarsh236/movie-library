export function parsePageParam(value: string | null): number {
  if (!value) return 1

  const parsedValue = Number.parseInt(value, 10)

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return 1
  }

  return parsedValue
}

export function parseTitleParam(value: string | null): string {
  return value?.trim() ?? ''
}

export function parseGenreIdParam(value: string | undefined): number | null {
  if (!value) {
    return null
  }

  const parsedValue = Number.parseInt(value, 10)

  if (!Number.isFinite(parsedValue) || parsedValue < 1) {
    return null
  }

  return parsedValue
}

export function buildHomeUrl(page = 1): string {
  if (page <= 1) {
    return '/'
  }

  const params = new URLSearchParams({
    page: String(page),
  })

  return `/?${params.toString()}`
}

export function buildSearchUrl(title: string, page = 1): string {
  const normalizedTitle = title.trim()
  const params = new URLSearchParams()

  params.set('title', normalizedTitle)

  if (page > 1) {
    params.set('page', String(page))
  }

  return `/search?${params.toString()}`
}

export function buildGenreUrl(genreId: number, page = 1): string {
  const params = new URLSearchParams()

  if (page > 1) {
    params.set('page', String(page))
  }

  const query = params.toString()

  return query ? `/genre/${genreId}?${query}` : `/genre/${genreId}`
}
