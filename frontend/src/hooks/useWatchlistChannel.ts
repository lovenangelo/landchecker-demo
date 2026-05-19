import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { createCableConsumer } from '@/lib/cable'
import { useAuthStore } from '@/store/useAuthStore'

export function useWatchlistChannel() {
  const queryClient = useQueryClient()
  const user = useAuthStore((s) => s.user)
  const token = useAuthStore((s) => s.token)

  useEffect(() => {
    if (!user || !token) return

    const consumer = createCableConsumer(token)

    const subscription = consumer.subscriptions.create(
      { channel: 'WatchlistChannel' },
      {
        received() {
          queryClient.invalidateQueries({ queryKey: ['watchlist'] })
        },
      }
    )

    return () => {
      subscription.unsubscribe()
      consumer.disconnect()
    }
  }, [user, token, queryClient])
}
