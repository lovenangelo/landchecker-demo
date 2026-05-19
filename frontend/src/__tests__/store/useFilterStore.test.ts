import { describe, it, expect, beforeEach } from 'vitest'
import { useFilterStore } from '@/store/useFilterStore'

beforeEach(() => {
  useFilterStore.getState().reset()
})

describe('useFilterStore', () => {
  it('starts with default values', () => {
    const s = useFilterStore.getState()
    expect(s.query).toBe('')
    expect(s.min_price).toBeNull()
    expect(s.max_price).toBeNull()
    expect(s.bedrooms).toBeNull()
    expect(s.property_type).toBeNull()
    expect(s.status).toBeNull()
  })

  it('setQuery updates query', () => {
    useFilterStore.getState().setQuery('Carlton')
    expect(useFilterStore.getState().query).toBe('Carlton')
  })

  it('setQuery can clear query', () => {
    useFilterStore.getState().setQuery('Carlton')
    useFilterStore.getState().setQuery('')
    expect(useFilterStore.getState().query).toBe('')
  })

  it('setPriceRange sets min and max', () => {
    useFilterStore.getState().setPriceRange(500000, 1500000)
    const s = useFilterStore.getState()
    expect(s.min_price).toBe(500000)
    expect(s.max_price).toBe(1500000)
  })

  it('setPriceRange can set null values', () => {
    useFilterStore.getState().setPriceRange(500000, 1500000)
    useFilterStore.getState().setPriceRange(null, null)
    const s = useFilterStore.getState()
    expect(s.min_price).toBeNull()
    expect(s.max_price).toBeNull()
  })

  it('setBedrooms updates bedrooms', () => {
    useFilterStore.getState().setBedrooms(3)
    expect(useFilterStore.getState().bedrooms).toBe(3)
  })

  it('setBedrooms can clear to null', () => {
    useFilterStore.getState().setBedrooms(3)
    useFilterStore.getState().setBedrooms(null)
    expect(useFilterStore.getState().bedrooms).toBeNull()
  })

  it('setPropertyType updates property_type', () => {
    useFilterStore.getState().setPropertyType('apartment')
    expect(useFilterStore.getState().property_type).toBe('apartment')
  })

  it('setStatus updates status', () => {
    useFilterStore.getState().setStatus('for_sale')
    expect(useFilterStore.getState().status).toBe('for_sale')
  })

  it('reset restores all defaults', () => {
    useFilterStore.getState().setQuery('test')
    useFilterStore.getState().setPriceRange(100000, 2000000)
    useFilterStore.getState().setBedrooms(4)
    useFilterStore.getState().setPropertyType('house')
    useFilterStore.getState().setStatus('for_sale')

    useFilterStore.getState().reset()
    const s = useFilterStore.getState()

    expect(s.query).toBe('')
    expect(s.min_price).toBeNull()
    expect(s.max_price).toBeNull()
    expect(s.bedrooms).toBeNull()
    expect(s.property_type).toBeNull()
    expect(s.status).toBeNull()
  })
})
