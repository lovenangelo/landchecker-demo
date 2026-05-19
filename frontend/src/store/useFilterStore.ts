import { create } from 'zustand'
import type { PropertyFilters, PropertyType, PropertyStatus } from '../types/property'

interface FilterState extends PropertyFilters {
  setQuery: (query: string) => void
  setPriceRange: (min: number | null, max: number | null) => void
  setBedrooms: (bedrooms: number | null) => void
  setPropertyType: (type: PropertyType | null) => void
  setStatus: (status: PropertyStatus | null) => void
  reset: () => void
}

const defaults: PropertyFilters = {
  query: '',
  min_price: null,
  max_price: null,
  bedrooms: null,
  property_type: null,
  status: null,
}

export const useFilterStore = create<FilterState>()((set) => ({
  ...defaults,
  setQuery: (query) => set({ query }),
  setPriceRange: (min_price, max_price) => set({ min_price, max_price }),
  setBedrooms: (bedrooms) => set({ bedrooms }),
  setPropertyType: (property_type) => set({ property_type }),
  setStatus: (status) => set({ status }),
  reset: () => set(defaults),
}))
