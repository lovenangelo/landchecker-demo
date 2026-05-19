import { describe, it, expect, beforeEach, vi } from 'vitest'
import { getProperties } from '@/api/properties'
import { mockProperties } from '@/mocks/properties'

// Ensure mock mode is active (VITE_USE_MOCK=true set in vitest config)

beforeEach(() => {
  vi.restoreAllMocks()
})

describe('getProperties (mock mode)', () => {
  it('returns all properties with no filters', async () => {
    const result = await getProperties({})
    expect(result.data.length).toBeGreaterThan(0)
    expect(result.meta.total_count).toBe(mockProperties.length)
  })

  it('paginates results', async () => {
    const page1 = await getProperties({}, 1)
    const page2 = await getProperties({}, 2)
    expect(page1.data.length).toBe(9)
    expect(page1.meta.current_page).toBe(1)
    expect(page1.meta.next_page).toBe(2)
    expect(page2.data.length).toBeGreaterThan(0)
    expect(page2.meta.current_page).toBe(2)
  })

  it('last page has null next_page', async () => {
    const totalPages = Math.ceil(mockProperties.length / 9)
    const last = await getProperties({}, totalPages)
    expect(last.meta.next_page).toBeNull()
  })

  it('filters by query (title match)', async () => {
    const result = await getProperties({ query: 'carlton' })
    expect(result.data.length).toBeGreaterThan(0)
    result.data.forEach((p) => {
      const match = p.title.toLowerCase().includes('carlton') || p.address.toLowerCase().includes('carlton')
      expect(match).toBe(true)
    })
  })

  it('filters by query (address match)', async () => {
    const result = await getProperties({ query: 'Melbourne' })
    expect(result.data.length).toBeGreaterThan(0)
  })

  it('returns empty when query matches nothing', async () => {
    const result = await getProperties({ query: 'zzznomatch999' })
    expect(result.data).toHaveLength(0)
    expect(result.meta.total_count).toBe(0)
  })

  it('filters by min_price', async () => {
    const result = await getProperties({ min_price: 1_000_000 })
    result.data.forEach((p) => expect(p.price).toBeGreaterThanOrEqual(1_000_000))
  })

  it('filters by max_price', async () => {
    const result = await getProperties({ max_price: 500_000 })
    result.data.forEach((p) => expect(p.price).toBeLessThanOrEqual(500_000))
  })

  it('filters by price range', async () => {
    const result = await getProperties({ min_price: 400_000, max_price: 700_000 })
    result.data.forEach((p) => {
      expect(p.price).toBeGreaterThanOrEqual(400_000)
      expect(p.price).toBeLessThanOrEqual(700_000)
    })
  })

  it('filters by bedrooms', async () => {
    const result = await getProperties({ bedrooms: 3 })
    result.data.forEach((p) => expect(p.bedrooms).toBe(3))
  })

  it('filters by property_type', async () => {
    const result = await getProperties({ property_type: 'apartment' })
    result.data.forEach((p) => expect(p.property_type).toBe('apartment'))
  })

  it('filters by status', async () => {
    const result = await getProperties({ status: 'for_sale' })
    result.data.forEach((p) => expect(p.status).toBe('for_sale'))
  })

  it('combines multiple filters', async () => {
    const result = await getProperties({ property_type: 'house', status: 'for_sale', bedrooms: 3 })
    result.data.forEach((p) => {
      expect(p.property_type).toBe('house')
      expect(p.status).toBe('for_sale')
      expect(p.bedrooms).toBe(3)
    })
  })

  it('returns correct total_pages', async () => {
    const result = await getProperties({})
    const expected = Math.ceil(mockProperties.length / 9)
    expect(result.meta.total_pages).toBe(expected)
  })
})
