import { useInfiniteQuery } from '@tanstack/react-query'
import { useShallow } from 'zustand/react/shallow'
import { getProperties } from '../api/properties'
import { useFilterStore } from '../store/useFilterStore'
import type { PropertyFilters } from '../types/property'

export function useProperties() {
  // useShallow prevents new object reference on every render (avoids useSyncExternalStore infinite loop)
  const filters = useFilterStore(useShallow((s): Partial<PropertyFilters> => ({
    query: s.query || undefined,
    min_price: s.min_price ?? undefined,
    max_price: s.max_price ?? undefined,
    bedrooms: s.bedrooms ?? undefined,
    property_type: s.property_type ?? undefined,
    status: s.status ?? undefined,
  })))

  return useInfiniteQuery({
    queryKey: ['properties', filters],
    queryFn: ({ pageParam }) => getProperties(filters, pageParam as number),
    initialPageParam: 1,
    getNextPageParam: (last) => last.meta.next_page ?? undefined,
  })
}
