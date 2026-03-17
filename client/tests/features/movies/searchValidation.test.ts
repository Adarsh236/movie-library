import {
  getValidSearchTitle,
  isValidSearchTitle,
  normalizeSearchTitle,
} from '@/features/movies/lib/searchValidation'

describe('searchValidation', () => {
  it('trims and collapses repeated spaces', () => {
    expect(normalizeSearchTitle('   lord   of   the rings   ')).toBe('lord of the rings')
  })

  it('accepts a valid title', () => {
    expect(isValidSearchTitle('titanic')).toBe(true)
  })

  it('rejects an empty title after trimming', () => {
    expect(getValidSearchTitle('    ')).toBeNull()
  })

  it('rejects control characters', () => {
    expect(isValidSearchTitle('titanic\n')).toBe(false)
  })

  it('returns normalized valid title', () => {
    expect(getValidSearchTitle('   titanic   ')).toBe('titanic')
  })
})
