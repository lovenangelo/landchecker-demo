import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor } from '@testing-library/react'
import { type ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { createTestQueryClient } from '@/test/utils'
import { useProperties } from '@/hooks/useProperties'
import { useFilterStore } from '@/store/useFilterStore'
import type { PaginatedResponse, Property } from '@/types/property'

vi.mock('@/api/properties', () => ({
  getProperties: vi.fn(),
}))

const { getProperties } = await import('@/api/properties')

const makePage = (data: Partial<Property>[] = []): PaginatedResponse<Property> => ({
  data: data as Property[],
  meta: { current_page: 1, next_page: null, total_pages: 1, total_count: data.length },
})

function wrapper({ children }: { children: ReactNode }) {
  const qc = createTestQueryClient()
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

beforeEach(() => {
  useFilterStore.getState().reset()
  vi.mocked(getProperties).mockResolvedValue(makePage([{ id: 1, title: 'Test' } as Property]))
})

describe('useProperties', () => {
  it('calls getProperties with current filter state', async () => {
    useFilterStore.getState().setQuery('Carlton')
    useFilterStore.getState().setBedrooms(3)

    const { result } = renderHook(() => useProperties(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    expect(vi.mocked(getProperties)).toHaveBeenCalledWith(
      expect.objectContaining({ query: 'Carlton', bedrooms: 3 }),
      1,
    )
  })

  it('returns paginated data on success', async () => {
    const { result } = renderHook(() => useProperties(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.pages[0].data).toHaveLength(1)
  })

  it('getNextPageParam returns next page number when available', async () => {
    vi.mocked(getProperties).mockResolvedValueOnce({
      data: [],
      meta: { current_page: 1, next_page: 2, total_pages: 3, total_count: 27 },
    })

    const { result } = renderHook(() => useProperties(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.hasNextPage).toBe(true)
  })

  it('getNextPageParam returns undefined when no next page', async () => {
    vi.mocked(getProperties).mockResolvedValueOnce({
      data: [],
      meta: { current_page: 2, next_page: null, total_pages: 2, total_count: 10 },
    })

    const { result } = renderHook(() => useProperties(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.hasNextPage).toBe(false)
  })

  it('exposes isError on failure', async () => {
    vi.mocked(getProperties).mockRejectedValueOnce(new Error('Network error'))
    const { result } = renderHook(() => useProperties(), { wrapper })
    await waitFor(() => expect(result.current.isError).toBe(true))
  })
})
