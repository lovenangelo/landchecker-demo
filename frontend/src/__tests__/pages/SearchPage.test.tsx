import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import { SearchPage } from '@/pages/SearchPage'

vi.mock('@/components/property/PropertyFilters', () => ({
  PropertyFilters: () => <div data-testid="filters">Filters</div>,
}))
vi.mock('@/components/property/PropertyGrid', () => ({
  PropertyGrid: () => <div data-testid="grid">Grid</div>,
}))
vi.mock('@/components/property/PropertySearchBar', () => ({
  PropertySearchBar: () => <input placeholder="search" />,
}))
vi.mock('@/components/ui/sheet', () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTrigger: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetContent: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))
vi.mock('@/hooks/useWatchlist', () => ({
  useWatchlistIds: vi.fn(() => new Set()),
}))
vi.mock('@/store/useAuthStore', () => ({
  useAuthStore: vi.fn(() => null),
}))
vi.mock('@/hooks/useProperties', () => ({
  useProperties: vi.fn(() => ({
    data: { pages: [{ data: [], meta: { total_count: 0 } }] },
    isLoading: false,
    isError: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: vi.fn(),
  })),
}))

describe('SearchPage', () => {
  it('renders without crashing', () => {
    render(<SearchPage />)
  })

  it('shows property grid', () => {
    render(<SearchPage />)
    expect(screen.getByTestId('grid')).toBeInTheDocument()
  })

  it('shows filter sidebar (at least one)', () => {
    render(<SearchPage />)
    // SearchPage renders PropertyFilters in sidebar + Navbar Sheet (mobile)
    const allFilters = screen.getAllByTestId('filters')
    expect(allFilters.length).toBeGreaterThanOrEqual(1)
  })

  it('shows results header', () => {
    render(<SearchPage />)
    expect(screen.getByText(/0 properties/i)).toBeInTheDocument()
  })
})
