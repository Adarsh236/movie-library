type ShouldNavigateArgs = {
  pathname: string
  routeTitle: string
  normalizedValue: string
  minSearchLength: number
}

export function normalizeSearchValue(value: string): string {
  return value.trim()
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
