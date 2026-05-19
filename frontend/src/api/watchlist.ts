import { apiClient } from '../lib/api-client'
import { mockWatchlist, mockProperties } from '../mocks/properties'
import type { WatchlistItem, Property } from '../types/property'

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false'

let localWatchlist = [...mockWatchlist]
let nextId = 10

export async function getWatchlist(): Promise<WatchlistItem[]> {
  if (USE_MOCK) return localWatchlist
  const res = await apiClient.get<Property[]>('/api/v1/watchlists')
  return res.data.map((p) => ({
    id: p.id,
    user_id: 0,
    property_id: p.id,
    property: p,
    created_at: p.created_at,
  }))
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
  await apiClient.post('/api/v1/watchlists', { property_id: propertyId })
  return { id: 0, user_id: 0, property_id: propertyId, property: {} as Property, created_at: new Date().toISOString() }
}

export async function removeFromWatchlist(propertyId: number): Promise<void> {
  if (USE_MOCK) {
    localWatchlist = localWatchlist.filter((w) => w.property_id !== propertyId)
    return
  }
  await apiClient.delete(`/api/v1/watchlists/${propertyId}`)
}
