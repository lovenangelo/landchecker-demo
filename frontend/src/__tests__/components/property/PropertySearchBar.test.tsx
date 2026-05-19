import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, act, waitFor } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { PropertySearchBar } from '@/components/property/PropertySearchBar'
import { useFilterStore } from '@/store/useFilterStore'

beforeEach(() => {
  useFilterStore.getState().reset()
})

afterEach(() => {
  vi.useRealTimers()
})

describe('PropertySearchBar', () => {
  it('renders search input', () => {
    render(<PropertySearchBar />)
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument()
  })

  it('shows typed value in input', () => {
    render(<PropertySearchBar />)
    const input = screen.getByPlaceholderText(/search/i)
    fireEvent.change(input, { target: { value: 'Carlton' } })
    expect(input).toHaveValue('Carlton')
  })

  it('debounces store update — store unchanged before timeout fires', () => {
    vi.useFakeTimers()
    render(<PropertySearchBar />)
    const input = screen.getByPlaceholderText(/search/i)
    fireEvent.change(input, { target: { value: 'Carlton' } })
    expect(useFilterStore.getState().query).toBe('')
  })

  it('updates store after debounce fires', () => {
    vi.useFakeTimers()
    render(<PropertySearchBar />)
    const input = screen.getByPlaceholderText(/search/i)
    fireEvent.change(input, { target: { value: 'Brighton' } })
    act(() => vi.advanceTimersByTime(400))
    expect(useFilterStore.getState().query).toBe('Brighton')
  })

  it('shows clear button when input has value', () => {
    render(<PropertySearchBar />)
    const input = screen.getByPlaceholderText(/search/i)
    fireEvent.change(input, { target: { value: 'test' } })
    expect(screen.getByLabelText('Clear search')).toBeInTheDocument()
  })

  it('does not show clear button when input is empty', () => {
    render(<PropertySearchBar />)
    expect(screen.queryByLabelText('Clear search')).not.toBeInTheDocument()
  })

  it('clear button resets input and store immediately', () => {
    vi.useFakeTimers()
    render(<PropertySearchBar />)
    const input = screen.getByPlaceholderText(/search/i)

    fireEvent.change(input, { target: { value: 'test' } })
    act(() => vi.runAllTimers())
    expect(useFilterStore.getState().query).toBe('test')

    const clearBtn = screen.getByLabelText('Clear search')
    fireEvent.click(clearBtn)

    expect(input).toHaveValue('')
    expect(useFilterStore.getState().query).toBe('')
  })

  it('syncs with external store change', async () => {
    render(<PropertySearchBar />)
    await act(async () => {
      useFilterStore.getState().setQuery('from-store')
    })
    const input = screen.getByPlaceholderText(/search/i)
    await waitFor(() => expect(input).toHaveValue('from-store'))
  })
})
