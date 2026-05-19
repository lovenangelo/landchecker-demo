import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@/test/utils'
import { PropertyGrid } from '@/components/property/PropertyGrid'
import type { Property } from '@/types/property'

vi.mock('@/hooks/useProperties')
vi.mock('@/components/property/PropertyCard', () => ({
  PropertyCard: ({ property }: { property: Property }) => (
    <div data-testid="property-card">{property.title}</div>
  ),
}))

const { useProperties } = await import('@/hooks/useProperties')

type MockUseProperties = {
  data: { pages: { data: Partial<Property>[]; meta: object }[] } | undefined
  isLoading: boolean
  isError: boolean
  isFetchingNextPage: boolean
  hasNextPage: boolean
  fetchNextPage: ReturnType<typeof vi.fn>
}

function mockReturn(overrides: Partial<MockUseProperties> = {}) {
  vi.mocked(useProperties).mockReturnValue({
    data: undefined,
    isLoading: false,
    isError: false,
    isFetchingNextPage: false,
    hasNextPage: false,
    fetchNextPage: vi.fn(),
    ...overrides,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } as any)
}

beforeEach(() => mockReturn())

describe('PropertyGrid', () => {
  it('renders skeleton cards while loading', () => {
    mockReturn({ isLoading: true })
    const { container } = render(<PropertyGrid />)
    expect(container.querySelectorAll('.animate-pulse').length).toBeGreaterThan(0)
  })

  it('renders empty state when no properties', () => {
    mockReturn({
      data: { pages: [{ data: [], meta: { current_page: 1, next_page: null, total_pages: 1, total_count: 0 } }] },
    })
    render(<PropertyGrid />)
    expect(screen.getByText(/no properties match/i)).toBeInTheDocument()
  })

  it('renders error state', () => {
    mockReturn({ isError: true })
    render(<PropertyGrid />)
    expect(screen.getByText(/failed to load/i)).toBeInTheDocument()
  })

  it('renders property cards when data present', () => {
    mockReturn({
      data: {
        pages: [{
          data: [{ id: 1, title: 'Home One' }, { id: 2, title: 'Home Two' }],
          meta: { current_page: 1, next_page: null, total_pages: 1, total_count: 2 },
        }],
      },
    })

    render(<PropertyGrid />)
    expect(screen.getAllByTestId('property-card')).toHaveLength(2)
    expect(screen.getByText('Home One')).toBeInTheDocument()
    expect(screen.getByText('Home Two')).toBeInTheDocument()
  })

  it('shows loading spinner when fetching next page', () => {
    mockReturn({
      data: { pages: [{ data: [{ id: 1, title: 'Home' }], meta: {} }] },
      isFetchingNextPage: true,
      hasNextPage: true,
    })
    const { container } = render(<PropertyGrid />)
    expect(container.querySelector('.animate-spin')).toBeInTheDocument()
  })
})
