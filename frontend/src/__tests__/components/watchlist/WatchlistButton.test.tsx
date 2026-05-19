import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@/test/utils'
import userEvent from '@testing-library/user-event'
import { WatchlistButton } from '@/components/watchlist/WatchlistButton'

vi.mock('@/hooks/useWatchlist')
vi.mock('@/store/useAuthStore')

const { useWatchlistIds, useAddToWatchlist, useRemoveFromWatchlist } = await import('@/hooks/useWatchlist')
const { useAuthStore } = await import('@/store/useAuthStore')

const mockAdd = vi.fn()
const mockRemove = vi.fn()

beforeEach(() => {
  mockAdd.mockClear()
  mockRemove.mockClear()
  vi.mocked(useAddToWatchlist).mockReturnValue({ mutate: mockAdd } as ReturnType<typeof useAddToWatchlist>)
  vi.mocked(useRemoveFromWatchlist).mockReturnValue({ mutate: mockRemove } as ReturnType<typeof useRemoveFromWatchlist>)
  vi.mocked(useAuthStore).mockReturnValue({ id: 1, email: 'user@test.com' } as ReturnType<typeof useAuthStore>)
  vi.mocked(useWatchlistIds).mockReturnValue(new Set())
})

describe('WatchlistButton', () => {
  it('renders button with add-to-watchlist label when not watched', () => {
    render(<WatchlistButton propertyId={1} />)
    expect(screen.getByLabelText('Add to watchlist')).toBeInTheDocument()
  })

  it('shows "Remove from watchlist" label when already watched', () => {
    vi.mocked(useWatchlistIds).mockReturnValue(new Set([1]))
    render(<WatchlistButton propertyId={1} />)
    expect(screen.getByLabelText('Remove from watchlist')).toBeInTheDocument()
  })

  it('calls addToWatchlist when not watched and clicked', async () => {
    render(<WatchlistButton propertyId={3} />)
    await userEvent.click(screen.getByLabelText('Add to watchlist'))
    expect(mockAdd).toHaveBeenCalledWith(3)
    expect(mockRemove).not.toHaveBeenCalled()
  })

  it('calls removeFromWatchlist when watched and clicked', async () => {
    vi.mocked(useWatchlistIds).mockReturnValue(new Set([3]))
    render(<WatchlistButton propertyId={3} />)
    await userEvent.click(screen.getByLabelText('Remove from watchlist'))
    expect(mockRemove).toHaveBeenCalledWith(3)
    expect(mockAdd).not.toHaveBeenCalled()
  })

  it('does not call mutation when user not logged in', async () => {
    vi.mocked(useAuthStore).mockReturnValue(null as ReturnType<typeof useAuthStore>)
    render(<WatchlistButton propertyId={1} />)
    await userEvent.click(screen.getByLabelText('Add to watchlist'))
    expect(mockAdd).not.toHaveBeenCalled()
    expect(mockRemove).not.toHaveBeenCalled()
  })

  it('applies custom className', () => {
    const { container } = render(<WatchlistButton propertyId={1} className="test-class" />)
    expect(container.querySelector('.test-class')).toBeInTheDocument()
  })
})
