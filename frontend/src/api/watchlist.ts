import { apiClient } from '../lib/api-client'
import { mockWatchlist, mockProperties } from '../mocks/properties'
import type { WatchlistItem } from '../types/property'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

let localWatchlist = [...mockWatchlist]
let nextId = 10

export async function getWatchlist(): Promise<WatchlistItem[]> {
  if (USE_MOCK) return localWatchlist
  const res = await apiClient.get<{ data: WatchlistItem[] }>('/api/v1/watchlist')
  return res.data.data
}

export async function addToWatchlist(propertyId: number): Promise<WatchlistItem> {
  if (USE_MOCK) {
    const property = mockProperties.find((p) => p.id === propertyId)!
    const item: WatchlistItem = {
      id: nextId++,
      user_id: 1,
      property_id: propertyId,
      property,
      created_at: new Date().toISOString(),
    }
    localWatchlist = [...localWatchlist, item]
    return item
  }
  const res = await apiClient.post<{ data: WatchlistItem }>('/api/v1/watchlist', { property_id: propertyId })
  return res.data.data
}

export async function removeFromWatchlist(propertyId: number): Promise<void> {
  if (USE_MOCK) {
    localWatchlist = localWatchlist.filter((w) => w.property_id !== propertyId)
    return
  }
  await apiClient.delete(`/api/v1/watchlist/${propertyId}`)
}
