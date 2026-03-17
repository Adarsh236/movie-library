import { act, cleanup, fireEvent, render, screen } from '@testing-library/react'
import { RouterProvider, createMemoryRouter, useLocation } from 'react-router-dom'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { useHeaderSearch } from '@/hooks/header-search/useHeaderSearch'

const { addSearchMock } = vi.hoisted(() => ({
  addSearchMock: vi.fn(),
}))

vi.mock('@/hooks/useRecentSearches', () => ({
  useRecentSearches: () => ({
    items: [],
    addSearch: addSearchMock,
    clearSearches: vi.fn(),
    removeSearch: vi.fn(),
  }),
}))

function HeaderSearchHarness() {
  const { searchValue, handleChange, handleSubmit, handleClear } = useHeaderSearch({
    debounceMs: 700,
    minSearchLength: 3,
  })

  const location = useLocation()

  return (
    <div>
      <input
        aria-label='search-input'
        value={searchValue}
        onChange={(event) => handleChange(event.target.value)}
      />

      <button type='button' onClick={() => handleSubmit(searchValue)}>
        submit
      </button>

      <button type='button' onClick={handleClear}>
        clear
      </button>

      <div data-testid='location'>
        {location.pathname}
        {location.search}
      </div>
    </div>
  )
}

function renderWithRouter(initialEntries: string[] = ['/']) {
  const router = createMemoryRouter(
    [
      { path: '/', element: <HeaderSearchHarness /> },
      { path: '/search', element: <HeaderSearchHarness /> },
      { path: '/about', element: <HeaderSearchHarness /> },
      { path: '/genre/:genreId', element: <HeaderSearchHarness /> },
    ],
    { initialEntries },
  )

  render(<RouterProvider router={router} />)

  return {
    router,
    input: screen.getByLabelText('search-input'),
    submitButton: screen.getByRole('button', { name: 'submit' }),
    clearButton: screen.getByRole('button', { name: 'clear' }),
    getLocationText: () => screen.getByTestId('location').textContent ?? '',
  }
}

async function flushMicrotasks() {
  await act(async () => {
    await Promise.resolve()
  })
}

describe('useHeaderSearch', () => {
  beforeEach(() => {
    addSearchMock.mockReset()
  })

  afterEach(() => {
    vi.clearAllTimers()
    vi.useRealTimers()
    cleanup()
  })

  it('runs search after debounce', async () => {
    vi.useFakeTimers()

    const { input, router, getLocationText } = renderWithRouter()

    fireEvent.change(input, { target: { value: 'titanic' } })

    expect(getLocationText()).toBe('/')
    expect(addSearchMock).not.toHaveBeenCalled()

    await act(async () => {
      await vi.advanceTimersByTimeAsync(700)
    })

    await flushMicrotasks()

    expect(router.state.location.pathname).toBe('/search')
    expect(router.state.location.search).toBe('?title=titanic')
    expect(getLocationText()).toBe('/search?title=titanic')
    expect(addSearchMock).toHaveBeenCalledWith('titanic')
  })

  it('submits immediately without waiting for debounce', async () => {
    vi.useFakeTimers()

    const { input, submitButton, router } = renderWithRouter()

    fireEvent.change(input, { target: { value: 'batman' } })
    fireEvent.click(submitButton)

    await flushMicrotasks()

    expect(router.state.location.pathname).toBe('/search')
    expect(router.state.location.search).toBe('?title=batman')
    expect(addSearchMock).toHaveBeenCalledWith('batman')
  })

  it('syncs the input with the URL on initial search route', () => {
    const { input } = renderWithRouter(['/search?title=titanic'])

    expect(input).toHaveValue('titanic')
  })

  it('clears the input and returns home', async () => {
    vi.useFakeTimers()

    const { input, clearButton, router } = renderWithRouter(['/search?title=titanic'])

    expect(input).toHaveValue('titanic')

    fireEvent.click(clearButton)

    await flushMicrotasks()

    expect(router.state.location.pathname).toBe('/')
    expect(router.state.location.search).toBe('')
    expect(screen.getByLabelText('search-input')).toHaveValue('')
  })

  it('adds search when opened directly from URL', async () => {
    renderWithRouter(['/search?title=batman'])

    await flushMicrotasks()

    expect(addSearchMock).toHaveBeenCalledWith('batman')
  })

  it('does not search when below minimum length', async () => {
    vi.useFakeTimers()

    const { input, router } = renderWithRouter()

    fireEvent.change(input, { target: { value: 'ca' } })

    await act(async () => {
      await vi.advanceTimersByTimeAsync(700)
    })

    await flushMicrotasks()

    expect(router.state.location.pathname).toBe('/')
    expect(router.state.location.search).toBe('')
    expect(addSearchMock).not.toHaveBeenCalled()
  })
})
