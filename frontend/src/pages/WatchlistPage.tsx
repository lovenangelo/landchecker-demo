import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'
import { Layout } from '@/components/layout/Layout'
import { PropertyCard } from '@/components/property/PropertyCard'
import { Button } from '@/components/ui/button'
import { useWatchlist } from '@/hooks/useWatchlist'
import { useAuthStore } from '@/store/useAuthStore'

export function WatchlistPage() {
  const user = useAuthStore((s) => s.user)
  const { data, isLoading } = useWatchlist()

  if (!user) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center gap-4 h-64 text-center">
          <Heart className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">Sign in to view your saved properties.</p>
          <Link to="/login">
            <Button>Sign in</Button>
          </Link>
        </div>
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="mb-6">
        <h1 className="text-xl font-semibold">My Watchlist</h1>
        {!isLoading && data && (
          <p className="text-sm text-muted-foreground mt-0.5">{data.length} saved properties</p>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="rounded-xl overflow-hidden border border-border animate-pulse">
              <div className="aspect-[4/3] bg-muted" />
              <div className="p-3 space-y-2">
                <div className="h-4 bg-muted rounded w-3/4" />
                <div className="h-3 bg-muted rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : data && data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {data.map((item) => (
            <PropertyCard key={item.id} property={item.property} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center gap-4 h-64 text-center">
          <Heart className="h-10 w-10 text-muted-foreground" />
          <p className="text-muted-foreground">No saved properties yet.</p>
          <Link to="/">
            <Button variant="outline">Browse properties</Button>
          </Link>
        </div>
      )}
    </Layout>
  )
}
