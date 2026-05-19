import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@/test/utils'
import { WatchlistPage } from '@/pages/WatchlistPage'
import type { WatchlistItem, Property } from '@/types/property'

// Stub Layout to avoid Navbar rendering conflicting "Sign in" links
vi.mock('@/components/layout/Layout', () => ({
  Layout: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
vi.mock('@/components/watchlist/WatchlistButton', () => ({
  WatchlistButton: () => <button aria-label="watchlist" />,
}))
vi.mock('@/hooks/useWatchlist')
vi.mock('@/store/useAuthStore')

const { useWatchlist, useWatchlistIds } = await import('@/hooks/useWatchlist')
const { useAuthStore } = await import('@/store/useAuthStore')

const mockProperty: Property = {
  id: 2,
  title: 'CBD Apartment',
  description: '',
  price: 420000,
  bedrooms: 1,
  property_type: 'apartment',
  status: 'for_sale',
  address: '45 Collins St',
  latitude: -37.81,
  longitude: 144.96,
  image_url: 'https://example.com/img.jpg',
  created_at: '2026-01-01',
  updated_at: '2026-01-01',
}

const mockItem: WatchlistItem = {
  id: 1,
  user_id: 1,
  property_id: 2,
  property: mockProperty,
  created_at: '2026-01-01',
}

beforeEach(() => {
  vi.mocked(useWatchlistIds).mockReturnValue(new Set())
  vi.mocked(useAuthStore).mockReturnValue(null as ReturnType<typeof useAuthStore>)
  vi.mocked(useWatchlist).mockReturnValue({
    data: [],
    isLoading: false,
    isError: false,
  } as ReturnType<typeof useWatchlist>)
})

describe('WatchlistPage', () => {
  it('shows sign-in prompt when not logged in', () => {
    render(<WatchlistPage />)
    expect(screen.getByText(/sign in to view/i)).toBeInTheDocument()
  })

  it('shows a sign in link when not logged in', () => {
    render(<WatchlistPage />)
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
  })

  it('shows empty state when logged in with no saved properties', () => {
    vi.mocked(useAuthStore).mockReturnValue({ id: 1, email: 'u@t.com' } as ReturnType<typeof useAuthStore>)
    render(<WatchlistPage />)
    expect(screen.getByText(/no saved properties/i)).toBeInTheDocument()
  })

  it('shows browse link in empty state', () => {
    vi.mocked(useAuthStore).mockReturnValue({ id: 1, email: 'u@t.com' } as ReturnType<typeof useAuthStore>)
    render(<WatchlistPage />)
    expect(screen.getByRole('link', { name: /browse properties/i })).toBeInTheDocument()
  })

  it('shows watchlist heading when logged in', () => {
    vi.mocked(useAuthStore).mockReturnValue({ id: 1, email: 'u@t.com' } as ReturnType<typeof useAuthStore>)
    render(<WatchlistPage />)
    expect(screen.getByText('My Watchlist')).toBeInTheDocument()
  })

  it('shows saved property count', () => {
    vi.mocked(useAuthStore).mockReturnValue({ id: 1, email: 'u@t.com' } as ReturnType<typeof useAuthStore>)
    vi.mocked(useWatchlist).mockReturnValue({
      data: [mockItem],
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useWatchlist>)
    render(<WatchlistPage />)
    expect(screen.getByText('1 saved properties')).toBeInTheDocument()
  })

  it('renders property cards for watchlist items', () => {
    vi.mocked(useAuthStore).mockReturnValue({ id: 1, email: 'u@t.com' } as ReturnType<typeof useAuthStore>)
    vi.mocked(useWatchlist).mockReturnValue({
      data: [mockItem],
      isLoading: false,
      isError: false,
    } as ReturnType<typeof useWatchlist>)
    render(<WatchlistPage />)
    expect(screen.getByText('CBD Apartment')).toBeInTheDocument()
  })

  it('shows loading skeleton when fetching', () => {
    vi.mocked(useAuthStore).mockReturnValue({ id: 1, email: 'u@t.com' } as ReturnType<typeof useAuthStore>)
    vi.mocked(useWatchlist).mockReturnValue({
      data: undefined,
      isLoading: true,
      isError: false,
    } as ReturnType<typeof useWatchlist>)
    const { container } = render(<WatchlistPage />)
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
  })
})
