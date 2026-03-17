import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, expect, it, vi } from 'vitest'
import { Header } from '@/components/header/Header'

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
  function renderHeader(overrides: Partial<React.ComponentProps<typeof Header>> = {}) {
    const props: React.ComponentProps<typeof Header> = {
      onOpenSidebar: vi.fn(),
      searchValue: 'batman',
      onSearchChange: vi.fn(),
      onSearchSubmit: vi.fn(),
      onSearchClear: vi.fn(),
      onPrimaryNavigate: vi.fn(),
      ...overrides,
    }

    render(
      <MemoryRouter>
        <Header {...props} />
      </MemoryRouter>,
    )

    return props
  }

  it('renders the logo and current search value', () => {
    renderHeader()

    expect(screen.getByRole('link', { name: /movie lib/i })).toBeInTheDocument()
    expect(screen.getByLabelText('mock-search-input')).toHaveValue('batman')
  })

  it('opens the sidebar when the menu button is clicked', () => {
    const props = renderHeader()

    fireEvent.click(screen.getByRole('button', { name: /open navigation menu/i }))

    expect(props.onOpenSidebar).toHaveBeenCalledTimes(1)
  })

  it('forwards search input changes', () => {
    const onSearchChange = vi.fn()

    renderHeader({ onSearchChange })

    fireEvent.change(screen.getByLabelText('mock-search-input'), {
      target: { value: 'superman' },
    })

    expect(onSearchChange).toHaveBeenCalledWith('superman')
  })

  it('submits the current search value', () => {
    const onSearchSubmit = vi.fn()

    renderHeader({ onSearchSubmit })

    fireEvent.submit(screen.getByRole('search'))

    expect(onSearchSubmit).toHaveBeenCalledWith('batman')
  })

  it('clears the search', () => {
    const onSearchClear = vi.fn()

    renderHeader({ onSearchClear })

    fireEvent.click(screen.getByRole('button', { name: /clear search/i }))

    expect(onSearchClear).toHaveBeenCalledTimes(1)
  })

  it('does not render the clear button when the search is empty', () => {
    renderHeader({
      searchValue: '',
    })

    expect(screen.queryByRole('button', { name: /clear search/i })).not.toBeInTheDocument()
  })

  it('calls onPrimaryNavigate with / when logo is clicked', () => {
    const onPrimaryNavigate = vi.fn()

    renderHeader({ onPrimaryNavigate })

    fireEvent.click(screen.getByRole('link', { name: /movie lib/i }))

    expect(onPrimaryNavigate).toHaveBeenCalledTimes(1)
    expect(onPrimaryNavigate).toHaveBeenCalledWith('/')
  })

  it('calls onPrimaryNavigate with /about when about link is clicked', () => {
    const onPrimaryNavigate = vi.fn()

    renderHeader({ onPrimaryNavigate })

    fireEvent.click(screen.getByRole('link', { name: /about/i, hidden: true }))

    expect(onPrimaryNavigate).toHaveBeenCalledTimes(1)
    expect(onPrimaryNavigate).toHaveBeenCalledWith('/about')
  })
})
