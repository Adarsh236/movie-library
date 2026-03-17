import { act, renderHook } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { useRecentSearches } from '@/hooks/useRecentSearches'

describe('useRecentSearches', () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  afterEach(() => {
    window.localStorage.clear()
  })

  it('starts empty', () => {
    const { result } = renderHook(() => useRecentSearches())

    expect(result.current.items).toEqual([])
  })

  it('adds a search term', () => {
    const { result } = renderHook(() => useRecentSearches())

    act(() => {
      result.current.addSearch('titanic')
    })

    expect(result.current.items).toEqual(['titanic'])
  })

  it('keeps searches unique and moves an existing item to the top', () => {
    const { result } = renderHook(() => useRecentSearches())

    act(() => {
      result.current.addSearch('titanic')
      result.current.addSearch('batman')
      result.current.addSearch('titanic')
    })

    expect(result.current.items).toEqual(['titanic', 'batman'])
  })

  it('treats duplicate values case-insensitively', () => {
    const { result } = renderHook(() => useRecentSearches())

    act(() => {
      result.current.addSearch('titanic')
      result.current.addSearch('titanic')
    })

    expect(result.current.items).toEqual(['titanic'])
  })

  it('caps the list at five items', () => {
    const { result } = renderHook(() => useRecentSearches())

    act(() => {
      result.current.addSearch('one')
      result.current.addSearch('two')
      result.current.addSearch('three')
      result.current.addSearch('four')
      result.current.addSearch('five')
      result.current.addSearch('six')
    })

    expect(result.current.items).toEqual(['six', 'five', 'four', 'three', 'two'])
  })

  it('removes a single search item', () => {
    const { result } = renderHook(() => useRecentSearches())

    act(() => {
      result.current.addSearch('titanic')
      result.current.addSearch('batman')
      result.current.removeSearch('titanic')
    })

    expect(result.current.items).toEqual(['batman'])
  })

  it('clears all searches', () => {
    const { result } = renderHook(() => useRecentSearches())

    act(() => {
      result.current.addSearch('titanic')
      result.current.addSearch('batman')
      result.current.clearSearches()
    })

    expect(result.current.items).toEqual([])
  })

  it('persists searches to localStorage across hook instances', () => {
    const first = renderHook(() => useRecentSearches())

    act(() => {
      first.result.current.addSearch('titanic')
      first.result.current.addSearch('batman')
    })

    const second = renderHook(() => useRecentSearches())

    expect(second.result.current.items).toEqual(['batman', 'titanic'])
  })
})
