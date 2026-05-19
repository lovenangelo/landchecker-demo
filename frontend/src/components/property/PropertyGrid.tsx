import { useEffect, useRef, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { PropertyCard } from './PropertyCard'
import { useProperties } from '@/hooks/useProperties'

function SkeletonCard() {
  return (
    <div className="rounded-xl overflow-hidden border border-border animate-pulse">
      <div className="aspect-[4/3] bg-muted" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-muted rounded w-3/4" />
        <div className="h-3 bg-muted rounded w-1/2" />
        <div className="h-3 bg-muted rounded w-1/4" />
      </div>
    </div>
  )
}

export function PropertyGrid() {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading, isError } = useProperties()

  const sentinelRef = useRef<HTMLDivElement>(null)
  const isFetchingRef = useRef(isFetchingNextPage)
  isFetchingRef.current = isFetchingNextPage

  const onIntersect = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingRef.current) {
        fetchNextPage()
      }
    },
    [fetchNextPage, hasNextPage],
  )

  useEffect(() => {
    const el = sentinelRef.current
    if (!el) return
    const observer = new IntersectionObserver(onIntersect, { rootMargin: '200px' })
    observer.observe(el)
    return () => observer.disconnect()
  }, [onIntersect])

  if (isError) {
    return (
      <div className="flex items-center justify-center h-48 text-muted-foreground">
        Failed to load properties. Please try again.
      </div>
    )
  }

  const properties = data?.pages.flatMap((p) => p.data) ?? []

  return (
    <div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 9 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : properties.length === 0 ? (
        <div className="flex items-center justify-center h-48 text-muted-foreground">
          No properties match your search.
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {properties.map((p) => <PropertyCard key={p.id} property={p} />)}
          </div>
          <div ref={sentinelRef} className="h-4 mt-4" />
          {isFetchingNextPage && (
            <div className="flex justify-center py-4">
              <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
            </div>
          )}
        </>
      )}
    </div>
  )
}
