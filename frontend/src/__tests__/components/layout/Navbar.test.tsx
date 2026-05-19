import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@/test/utils'
import { Navbar } from '@/components/layout/Navbar'

vi.mock('@/components/property/PropertySearchBar', () => ({
  PropertySearchBar: () => <input placeholder="search" />,
}))
vi.mock('@/components/property/PropertyFilters', () => ({
  PropertyFilters: () => <div>Filters</div>,
}))
vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
vi.mock('@/hooks/useWatchlist')
vi.mock('@/store/useAuthStore')

const { useWatchlistIds } = await import('@/hooks/useWatchlist')
const { useAuthStore } = await import('@/store/useAuthStore')

beforeEach(() => {
  vi.mocked(useWatchlistIds).mockReturnValue(new Set())
  vi.mocked(useAuthStore).mockReturnValue(null as ReturnType<typeof useAuthStore>)
})

describe('Navbar', () => {
  it('renders logo text', () => {
    render(<Navbar />)
    expect(screen.getByText('LandChecker')).toBeInTheDocument()
  })

  it('shows sign in and register links when logged out', () => {
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /sign in/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /register/i })).toBeInTheDocument()
  })

  it('does not show watchlist link when logged out', () => {
    render(<Navbar />)
    expect(screen.queryByRole('link', { name: /watchlist/i })).not.toBeInTheDocument()
  })

  it('shows watchlist link and sign out when logged in', () => {
    vi.mocked(useAuthStore).mockReturnValue({ id: 1, email: 'u@t.com' } as ReturnType<typeof useAuthStore>)
    render(<Navbar />)
    expect(screen.getByRole('link', { name: /watchlist/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
  })

  it('does not show sign in / register when logged in', () => {
    vi.mocked(useAuthStore).mockReturnValue({ id: 1, email: 'u@t.com' } as ReturnType<typeof useAuthStore>)
    render(<Navbar />)
    expect(screen.queryByRole('link', { name: /^sign in$/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /register/i })).not.toBeInTheDocument()
  })

  it('shows watchlist count badge when items exist', () => {
    vi.mocked(useAuthStore).mockReturnValue({ id: 1, email: 'u@t.com' } as ReturnType<typeof useAuthStore>)
    vi.mocked(useWatchlistIds).mockReturnValue(new Set([1, 2, 3]))
    render(<Navbar />)
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('does not show badge when watchlist is empty', () => {
    vi.mocked(useAuthStore).mockReturnValue({ id: 1, email: 'u@t.com' } as ReturnType<typeof useAuthStore>)
    vi.mocked(useWatchlistIds).mockReturnValue(new Set())
    render(<Navbar />)
    expect(screen.queryByText(/^\d+$/)).not.toBeInTheDocument()
  })
})
