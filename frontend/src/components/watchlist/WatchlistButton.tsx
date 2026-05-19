import { Heart } from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { useWatchlistIds, useAddToWatchlist, useRemoveFromWatchlist } from '@/hooks/useWatchlist'
import { useAuthStore } from '@/store/useAuthStore'

interface Props {
  propertyId: number
  className?: string
}

export function WatchlistButton({ propertyId, className }: Props) {
  const user = useAuthStore((s) => s.user)
  const watchedIds = useWatchlistIds()
  const isWatched = watchedIds.has(propertyId)
  const add = useAddToWatchlist()
  const remove = useRemoveFromWatchlist()

  function toggle(e: React.MouseEvent) {
    e.preventDefault()
    e.stopPropagation()
    if (!user) {
      toast.error('Sign in to save properties to your watchlist')
      return
    }
    if (isWatched) {
      remove.mutate(propertyId)
    } else {
      add.mutate(propertyId)
    }
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      className={cn('rounded-full bg-white/80 hover:bg-white shadow-sm', className)}
      onClick={toggle}
      aria-label={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <Heart
        className={cn(
          'h-4 w-4 transition-colors',
          isWatched ? 'fill-rose-500 text-rose-500' : 'text-gray-500',
        )}
      />
    </Button>
  )
}
