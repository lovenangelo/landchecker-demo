import { describe, it, expect, beforeEach, vi } from 'vitest'

// Reset module between tests to get fresh localWatchlist state
beforeEach(() => {
  vi.resetModules()
})

describe('watchlist API (mock mode)', () => {
  it('getWatchlist returns initial mock watchlist', async () => {
    const { getWatchlist } = await import('@/api/watchlist')
    const result = await getWatchlist()
    expect(Array.isArray(result)).toBe(true)
    expect(result.length).toBeGreaterThan(0)
  })

  it('addToWatchlist adds a property', async () => {
    const { getWatchlist, addToWatchlist } = await import('@/api/watchlist')
    const before = await getWatchlist()
    const added = await addToWatchlist(1)
    const after = await getWatchlist()

    expect(added.property_id).toBe(1)
    expect(added.property).toBeDefined()
    expect(after.length).toBe(before.length + 1)
  })

  it('addToWatchlist returns item with correct shape', async () => {
    const { addToWatchlist } = await import('@/api/watchlist')
    const item = await addToWatchlist(3)
    expect(item).toHaveProperty('id')
    expect(item).toHaveProperty('user_id')
    expect(item).toHaveProperty('property_id', 3)
    expect(item).toHaveProperty('property')
    expect(item).toHaveProperty('created_at')
  })

  it('removeFromWatchlist removes a property', async () => {
    const { getWatchlist, addToWatchlist, removeFromWatchlist } = await import('@/api/watchlist')
    await addToWatchlist(4)
    const before = await getWatchlist()
    await removeFromWatchlist(4)
    const after = await getWatchlist()
    expect(after.length).toBe(before.length - 1)
    expect(after.find((w) => w.property_id === 4)).toBeUndefined()
  })

  it('removeFromWatchlist is idempotent for non-existent id', async () => {
    const { getWatchlist, removeFromWatchlist } = await import('@/api/watchlist')
    const before = await getWatchlist()
    await removeFromWatchlist(99999)
    const after = await getWatchlist()
    expect(after.length).toBe(before.length)
  })
})
