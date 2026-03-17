type ShouldNavigateArgs = {
  pathname: string
  routeTitle: string
  normalizedValue: string
  minSearchLength: number
}

export const SEARCH_TITLE_MIN_LENGTH = 3
export const SEARCH_TITLE_MAX_LENGTH = 100

export function normalizeSearchTitle(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

export function isValidSearchTitle(value: string): boolean {
  const normalizedValue = normalizeSearchTitle(value)

  if (!isSearchLongEnough(normalizedValue, SEARCH_TITLE_MIN_LENGTH)) {
    return false
  }

  if (normalizedValue.length > SEARCH_TITLE_MAX_LENGTH) {
    return false
  }

  return !/\p{Cc}/u.test(normalizedValue)
}

export function getValidSearchTitle(value: string): string | null {
  const normalizedValue = normalizeSearchTitle(value)

  if (!isValidSearchTitle(normalizedValue)) {
    return null
  }

  return normalizedValue
}

export function isSearchLongEnough(value: string, minSearchLength: number): boolean {
  return value.length >= minSearchLength
}

export function shouldRedirectHome(value: string): boolean {
  return value.length === 0
}

export function shouldNavigateToSearch({
  pathname,
  routeTitle,
  normalizedValue,
  minSearchLength,
}: ShouldNavigateArgs): boolean {
  if (!normalizedValue) {
    return false
  }

  if (!isSearchLongEnough(normalizedValue, minSearchLength)) {
    return false
  }

  if (pathname === '/search' && routeTitle === normalizedValue) {
    return false
  }

  return true
}
