import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { beforeEach, describe, expect, it, vi } from 'vitest'
import { Header } from '@/components/header/Header'

const { mockUseHeaderSearch } = vi.hoisted(() => ({
  mockUseHeaderSearch: vi.fn(),
}))

vi.mock('@/hooks/header-search/useHeaderSearch', () => ({
  useHeaderSearch: mockUseHeaderSearch,
}))

vi.mock('@/components/search-bar/SearchBar', () => ({
  SearchBar: ({
    value,
    onChange,
    onSubmit,
    onClear,
    placeholder,
  }: {
    value: string
    placeholder?: string
    onChange: (value: string) => void
    onSubmit: (value: string) => void
    onClear?: () => void
  }) => (
    <form
      role='search'
      aria-label='Search movies by title'
      onSubmit={(event) => {
        event.preventDefault()
        onSubmit(value)
      }}
    >
      <input
        aria-label='mock-search-input'
        value={value}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />

      {value ? (
        <button type='button' aria-label='Clear search' onClick={onClear}>
          X
        </button>
      ) : null}
    </form>
  ),
}))

describe('Header', () => {
  beforeEach(() => {
    mockUseHeaderSearch.mockReset()
    mockUseHeaderSearch.mockReturnValue({
      searchValue: 'batman',
      handleChange: vi.fn(),
      handleSubmit: vi.fn(),
      handleClear: vi.fn(),
    })
  })

  function renderHeader(onOpenSidebar = vi.fn()) {
    render(
      <MemoryRouter>
        <Header onOpenSidebar={onOpenSidebar} />
      </MemoryRouter>,
    )

    return { onOpenSidebar }
  }

  it('renders the logo and current search value', () => {
    renderHeader()

    expect(screen.getByRole('link', { name: /movie lib/i })).toBeInTheDocument()
    expect(screen.getByLabelText('mock-search-input')).toHaveValue('batman')
  })

  it('opens the sidebar when the menu button is clicked', () => {
    const { onOpenSidebar } = renderHeader()

    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }))

    expect(onOpenSidebar).toHaveBeenCalledTimes(1)
  })

  it('forwards search input changes to the hook', () => {
    const handleChange = vi.fn()

    mockUseHeaderSearch.mockReturnValue({
      searchValue: 'batman',
      handleChange,
      handleSubmit: vi.fn(),
      handleClear: vi.fn(),
    })

    renderHeader()

    fireEvent.change(screen.getByLabelText('mock-search-input'), {
      target: { value: 'superman' },
    })

    expect(handleChange).toHaveBeenCalledWith('superman')
  })

  it('submits the current search value through the hook', () => {
    const handleSubmit = vi.fn()

    mockUseHeaderSearch.mockReturnValue({
      searchValue: 'batman',
      handleChange: vi.fn(),
      handleSubmit,
      handleClear: vi.fn(),
    })

    renderHeader()

    fireEvent.submit(screen.getByRole('search'))

    expect(handleSubmit).toHaveBeenCalledWith('batman')
  })

  it('clears the search through the hook', () => {
    const handleClear = vi.fn()

    mockUseHeaderSearch.mockReturnValue({
      searchValue: 'batman',
      handleChange: vi.fn(),
      handleSubmit: vi.fn(),
      handleClear,
    })

    renderHeader()

    fireEvent.click(screen.getByRole('button', { name: /clear search/i }))

    expect(handleClear).toHaveBeenCalledTimes(1)
  })

  it('does not render the clear button when the search is empty', () => {
    mockUseHeaderSearch.mockReturnValue({
      searchValue: '',
      handleChange: vi.fn(),
      handleSubmit: vi.fn(),
      handleClear: vi.fn(),
    })

    renderHeader()

    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument()
  })
})
