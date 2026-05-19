import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getWatchlist, addToWatchlist, removeFromWatchlist } from '../api/watchlist'

export function useWatchlist() {
  return useQuery({
    queryKey: ['watchlist'],
    queryFn: getWatchlist,
  })
}

export function useWatchlistIds(): Set<number> {
  const { data } = useWatchlist()
  return new Set(data?.map((w) => w.property_id) ?? [])
}

export function useAddToWatchlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: addToWatchlist,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['watchlist'] }),
  })
}

export function useRemoveFromWatchlist() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: removeFromWatchlist,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['watchlist'] }),
  })
}
