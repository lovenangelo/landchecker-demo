import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@/test/utils'
import { PropertyCard } from '@/components/property/PropertyCard'
import type { Property } from '@/types/property'

vi.mock('@/components/watchlist/WatchlistButton', () => ({
  WatchlistButton: () => <button aria-label="watchlist" />,
}))

const base: Property = {
  id: 1,
  title: '3BR Family Home in Carlton',
  description: 'A great home.',
  price: 850000,
  bedrooms: 3,
  property_type: 'house',
  status: 'for_sale',
  address: '12 Oak Street, Carlton VIC 3053',
  latitude: -37.79,
  longitude: 144.96,
  image_url: 'https://example.com/img.jpg',
  created_at: '2026-01-01',
  updated_at: '2026-01-01',
}

describe('PropertyCard', () => {
  it('renders property title', () => {
    render(<PropertyCard property={base} />)
    expect(screen.getByText('3BR Family Home in Carlton')).toBeInTheDocument()
  })

  it('renders formatted price for sale using toLocaleString', () => {
    render(<PropertyCard property={base} />)
    // Sub-million: formatted with toLocaleString → $850,000
    expect(screen.getByText('$850,000')).toBeInTheDocument()
  })

  it('renders price in millions (decimal)', () => {
    render(<PropertyCard property={{ ...base, price: 1_200_000 }} />)
    expect(screen.getByText('$1.2m')).toBeInTheDocument()
  })

  it('renders price in whole millions', () => {
    render(<PropertyCard property={{ ...base, price: 2_000_000 }} />)
    expect(screen.getByText('$2m')).toBeInTheDocument()
  })

  it('renders weekly price for rentals', () => {
    render(<PropertyCard property={{ ...base, price: 2500, status: 'for_rent' }} />)
    expect(screen.getByText('$2,500/wk')).toBeInTheDocument()
  })

  it('renders address', () => {
    render(<PropertyCard property={base} />)
    expect(screen.getByText('12 Oak Street, Carlton VIC 3053')).toBeInTheDocument()
  })

  it('renders property type badge', () => {
    render(<PropertyCard property={base} />)
    expect(screen.getByText('House')).toBeInTheDocument()
  })

  it('renders bedroom count', () => {
    render(<PropertyCard property={base} />)
    expect(screen.getByText('3 beds')).toBeInTheDocument()
  })

  it('renders singular bedroom', () => {
    render(<PropertyCard property={{ ...base, bedrooms: 1 }} />)
    expect(screen.getByText('1 bed')).toBeInTheDocument()
  })

  it('does not render bedrooms for studio (0 beds)', () => {
    render(<PropertyCard property={{ ...base, bedrooms: 0 }} />)
    expect(screen.queryByText(/bed/)).not.toBeInTheDocument()
  })

  it('renders For Sale status badge', () => {
    render(<PropertyCard property={base} />)
    expect(screen.getByText('For Sale')).toBeInTheDocument()
  })

  it('renders Sold status badge', () => {
    render(<PropertyCard property={{ ...base, status: 'sold' }} />)
    expect(screen.getByText('Sold')).toBeInTheDocument()
  })

  it('renders watchlist button', () => {
    render(<PropertyCard property={base} />)
    expect(screen.getByLabelText('watchlist')).toBeInTheDocument()
  })

  it('renders property image with lazy loading', () => {
    render(<PropertyCard property={base} />)
    const img = screen.getByRole('img')
    expect(img).toHaveAttribute('src', 'https://example.com/img.jpg')
    expect(img).toHaveAttribute('loading', 'lazy')
  })
})
