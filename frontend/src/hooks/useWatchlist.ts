import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../api/watchlist'
import { useAuthStore } from '../store/useAuthStore'
import type { WatchlistItem } from '../types/property'

export function useWatchlist() {
  const user = useAuthStore((s) => s.user)
  return useQuery({
    queryKey: ['watchlist'],
    queryFn: getWatchlist,
    enabled: !!user,
  })
}

export function useWatchlistIds(): Set<number> {
  const { data } = useWatchlist()
  return useMemo(() => new Set(data?.map((w) => w.property_id) ?? []), [data])
}

export function useAddToWatchlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addToWatchlist,
    onMutate: async (propertyId) => {
      await qc.cancelQueries({ queryKey: ['watchlist'] })
      const previous = qc.getQueryData<WatchlistItem[]>(['watchlist'])
      qc.setQueryData<WatchlistItem[]>(['watchlist'], (old) => [
        ...(old ?? []),
        { id: -propertyId, user_id: 0, property_id: propertyId, property: undefined as never, created_at: new Date().toISOString() },
      ])
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(['watchlist'], ctx.previous)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['watchlist'] }),
  })
}

export function useRemoveFromWatchlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: removeFromWatchlist,
    onMutate: async (propertyId) => {
      await qc.cancelQueries({ queryKey: ['watchlist'] })
      const previous = qc.getQueryData<WatchlistItem[]>(['watchlist'])
      qc.setQueryData<WatchlistItem[]>(['watchlist'], (old) =>
        (old ?? []).filter((w) => w.property_id !== propertyId),
      )
      return { previous }
    },
    onError: (_err, _vars, ctx) => {
      if (ctx?.previous) qc.setQueryData(['watchlist'], ctx.previous)
    },
    onSettled: () => qc.invalidateQueries({ queryKey: ['watchlist'] }),
  })
}
