import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, waitFor, act } from '@testing-library/react'
import { type ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { createTestQueryClient } from '@/test/utils'
import {
  useWatchlist,
  useWatchlistIds,
  useAddToWatchlist,
  useRemoveFromWatchlist,
} from '@/hooks/useWatchlist'
import type { WatchlistItem, Property } from '@/types/property'

vi.mock('@/api/watchlist', () => ({
  getWatchlist: vi.fn(),
  addToWatchlist: vi.fn(),
  removeFromWatchlist: vi.fn(),
}))

const { getWatchlist, addToWatchlist, removeFromWatchlist } = await import('@/api/watchlist')

const mockItem: WatchlistItem = {
  id: 1,
  user_id: 1,
  property_id: 5,
  property: { id: 5 } as Property,
  created_at: '2026-01-01',
}

function wrapper({ children }: { children: ReactNode }) {
  const qc = createTestQueryClient()
  return <QueryClientProvider client={qc}>{children}</QueryClientProvider>
}

vi.mock('@/store/useAuthStore', () => ({
  useAuthStore: vi.fn((selector) => selector({ user: { id: 1, email: 'test@example.com' }, token: 'tok', login: vi.fn(), logout: vi.fn() })),
}))

beforeEach(() => {
  vi.mocked(getWatchlist).mockResolvedValue([mockItem])
  vi.mocked(addToWatchlist).mockResolvedValue(mockItem)
  vi.mocked(removeFromWatchlist).mockResolvedValue(undefined)
})

describe('useWatchlist', () => {
  it('fetches watchlist on mount', async () => {
    const { result } = renderHook(() => useWatchlist(), { wrapper })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data).toEqual([mockItem])
  })
})

describe('useWatchlistIds', () => {
  it('returns a Set of property IDs', async () => {
    const { result } = renderHook(() => useWatchlistIds(), { wrapper })
    await waitFor(() => expect(result.current.size).toBeGreaterThan(0))
    expect(result.current.has(5)).toBe(true)
  })

  it('returns empty Set when watchlist is empty', async () => {
    vi.mocked(getWatchlist).mockResolvedValueOnce([])
    const { result } = renderHook(() => useWatchlistIds(), { wrapper })
    await waitFor(() => expect(result.current).toBeDefined())
    expect(result.current.size).toBe(0)
  })
})

describe('useAddToWatchlist', () => {
  it('calls addToWatchlist with propertyId', async () => {
    const { result } = renderHook(() => useAddToWatchlist(), { wrapper })

    await act(async () => {
      result.current.mutate(3)
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    // TanStack Query v5 passes (variables, context) to mutationFn
    expect(vi.mocked(addToWatchlist)).toHaveBeenCalledWith(3, expect.anything())
  })
})

describe('useRemoveFromWatchlist', () => {
  it('calls removeFromWatchlist with propertyId', async () => {
    const { result } = renderHook(() => useRemoveFromWatchlist(), { wrapper })

    await act(async () => {
      result.current.mutate(5)
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    // TanStack Query v5 passes (variables, context) to mutationFn
    expect(vi.mocked(removeFromWatchlist)).toHaveBeenCalledWith(5, expect.anything())
  })
})
